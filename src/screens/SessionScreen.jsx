import { useEffect, useRef, useState, useCallback } from 'react'
import { createUniverInstance } from '../lib/univerInit'
import { gradeTask, summarizeTask } from '../lib/checker'
import { saveSession, clearSession } from '../lib/autosave'
import { sealPayload, downloadSealedFile } from '../lib/encrypt'
import { sendResults } from '../lib/email'
import TaskPanel from '../components/TaskPanel'
import './SessionScreen.css'

const CONTAINER_ID = 'univer-container'

function buildResultCode(trackId, taskSummaries, totalSecs) {
  const flags = taskSummaries.map((s, i) => {
    const pct = s ? s.score : 0
    return `T${i + 1}${pct >= 0.8 ? '✓' : pct >= 0.5 ? '~' : '✗'}`
  }).join('-')
  return `${trackId.toUpperCase()}-${flags}-${totalSecs}s`
}

export default function SessionScreen({ config, track, onComplete, resume }) {
  const univerAPIRef  = useRef(null)
  const univerInstRef = useRef(null) // Univer instance — needed for disposal
  const autosaveRef   = useRef(null)

  const [taskIndex, setTaskIndex]       = useState(resume?.taskIndex ?? 0)
  const [elapsedTotal, setElapsedTotal] = useState(resume?.elapsedTotal ?? 0)
  const [taskResults, setTaskResults]   = useState(resume?.taskResults ?? {})
  const [taskTimes, setTaskTimes]       = useState(resume?.taskTimes ?? {})
  const [taskStartSec, setTaskStartSec] = useState(resume?.elapsedTotal ?? 0)
  const [status, setStatus]             = useState('running') // running | grading | done
  const [initError, setInitError]       = useState(null)

  // Mirror latest session state into a ref so the autosave interval (created
  // once) never reads a stale closure of taskIndex/results/etc.
  const stateRef = useRef({})
  stateRef.current = { taskIndex, taskResults, taskTimes, elapsedTotal }

  const snapshotSession = () => ({
    config,
    trackId: track.id,
    ...stateRef.current,
    workbookSnapshot: univerAPIRef.current?.getActiveWorkbook()?.save?.() ?? null,
  })

  // Session-wide elapsed timer
  useEffect(() => {
    const t = setInterval(() => setElapsedTotal(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  // Boot Univer — runs after the container div is in the DOM
  useEffect(() => {
    if (univerInstRef.current) return // already up (StrictMode guard)

    try {
      // On recovery, rebuild from the saved grid snapshot instead of the pristine dataset
      const workbookData = resume?.workbookSnapshot || track.workbookData
      const { univer, univerAPI } = createUniverInstance(CONTAINER_ID, workbookData)
      univerInstRef.current = univer
      univerAPIRef.current  = univerAPI
      if (import.meta.env.DEV) {                              // dev-only validation handles
        window.__univerAPI = univerAPI
        window.__track = track
        window.__checker = { gradeTask, summarizeTask }
      }
    } catch (err) {
      console.error('Univer init error:', err)
      setInitError(String(err))
      return
    }

    autosaveRef.current = setInterval(() => {
      saveSession(snapshotSession()).catch(() => {})
    }, 10000)

    return () => {
      clearInterval(autosaveRef.current)
      const inst = univerInstRef.current
      univerInstRef.current = null
      univerAPIRef.current  = null
      // Defer Univer disposal past React's current render/commit — disposing
      // synchronously here unmounts Univer's internal React root mid-render,
      // which floods the console with race-condition warnings.
      if (inst) setTimeout(() => { try { inst.dispose?.() } catch { /* already gone */ } }, 0)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const finishTask = useCallback(async ({ timedOut }) => {
    if (status !== 'running') return
    const task        = track.tasks[taskIndex]
    const answerCells = track.answerKey[task.id] || []

    const cellResults = gradeTask(univerAPIRef.current, task.targetSheet, answerCells)
    const summary     = summarizeTask(cellResults)
    const elapsed     = elapsedTotal - taskStartSec

    const newResults = { ...taskResults, [task.id]: { cellResults, summary, elapsed, timedOut } }
    const newTimes   = { ...taskTimes,   [task.id]: elapsed }
    setTaskResults(newResults)
    setTaskTimes(newTimes)

    const isLast = taskIndex >= track.tasks.length - 1

    if (!isLast) {
      setTaskIndex(i => i + 1)
      setTaskStartSec(elapsedTotal)
      saveSession({
        config, trackId: track.id, taskIndex: taskIndex + 1,
        taskResults: newResults, taskTimes: newTimes, elapsedTotal,
        workbookSnapshot: univerAPIRef.current?.getActiveWorkbook()?.save?.() ?? null,
      }).catch(() => {})
    } else {
      setStatus('grading')
      await completeSession(newResults, newTimes)
    }
  }, [status, taskIndex, taskResults, taskTimes, elapsedTotal, taskStartSec, track, config])

  async function completeSession(results, times) {
    const summaries  = track.tasks.map(t => results[t.id]?.summary || null)
    const resultCode = buildResultCode(track.id, summaries, elapsedTotal)
    const narrative  = await generateNarrative(track, results, config.candidateName)

    const payload = {
      version: 1,
      candidateName:      config.candidateName,
      track:              track.id,
      trackLabel:         track.label,
      resultCode,
      sessionDurationSecs: elapsedTotal,
      tasks: track.tasks.map(t => ({
        id:          t.id,
        label:       t.label,
        elapsedSecs: times[t.id],
        summary:     results[t.id]?.summary,
        cellResults: results[t.id]?.cellResults,
        timedOut:    results[t.id]?.timedOut,
      })),
      narrative,
      exportedAt: new Date().toISOString(),
    }

    if (import.meta.env.DEV) window.__lastPayload = payload // dev-only: inspect grading

    let sealed = null
    try {
      sealed = await sealPayload(payload)
      downloadSealedFile(sealed, config.candidateName)
    } catch (err) {
      console.error('Seal/download failed:', err)
    }

    try {
      await sendResults({
        toEmail:        config.toEmail,
        ccEmails:       config.ccEmails,
        candidateName:  config.candidateName,
        track:          `${track.label} (${track.id})`,
        resultCode,
        narrative,
        sealedPayload:  sealed || '(encryption failed)',
      })
    } catch (err) {
      console.error('Email send failed:', err)
    }

    await clearSession().catch(() => {})
    setStatus('done')
    onComplete({ resultCode, payload })
  }

  // Completion screen triggers via App
  if (status === 'grading' || status === 'done') return null

  if (initError) {
    return (
      <div style={{ padding: '2rem', color: '#ef4444', fontFamily: 'monospace' }}>
        <strong>Spreadsheet failed to load.</strong><br />{initError}
      </div>
    )
  }

  return (
    <div className="session-screen">
      <TaskPanel
        task={track.tasks[taskIndex]}
        taskIndex={taskIndex}
        totalTasks={track.tasks.length}
        elapsedTotal={elapsedTotal}
        onComplete={finishTask}
      />
      {/* id must match CONTAINER_ID — Univer mounts here by string ID */}
      <div id={CONTAINER_ID} className="univer-container" />
    </div>
  )
}

async function generateNarrative(track, results, candidateName) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) return buildFallbackNarrative(track, results, candidateName)

  const summaryText = track.tasks.map(t => {
    const r = results[t.id]
    if (!r) return `${t.label}: not attempted`
    const s = r.summary
    return `${t.label}: ${s.correct}/${s.total} correct, ${s.hardcoded} hardcoded, ${r.elapsed}s${r.timedOut ? ' (timed out)' : ''}`
  }).join('\n')

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-request-forwarding': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content:
          `You are a hiring manager reviewing an Excel skills assessment. Write a 2-paragraph narrative (under 150 words). Be specific and balanced. No score or hire/no-hire recommendation.\n\nCandidate: ${candidateName}\nTrack: ${track.label}\n\nResults:\n${summaryText}\n\nParagraph 1: Strengths. Paragraph 2: Areas of concern.`
        }],
      }),
    })
    const data = await res.json()
    return data.content?.[0]?.text || buildFallbackNarrative(track, results, candidateName)
  } catch {
    return buildFallbackNarrative(track, results, candidateName)
  }
}

function buildFallbackNarrative(track, results, candidateName) {
  const lines = track.tasks.map(t => {
    const r = results[t.id]
    if (!r) return `${t.label}: not completed.`
    const s = r.summary
    const note = s.hardcoded > 0 ? ` (${s.hardcoded} hardcoded)` : ''
    return `${t.label}: ${s.correct}/${s.total} correct${note}.`
  })
  return `Assessment summary for ${candidateName} (${track.label}):\n\n${lines.join(' ')}\n\n(AI narrative unavailable — no API key.)`
}
