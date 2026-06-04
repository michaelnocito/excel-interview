import { useEffect, useRef, useState, useCallback } from 'react'
import { createUniverInstance } from '../lib/univerInit'
import { gradeTask, summarizeTask } from '../lib/checker'
import { saveSession, clearSession } from '../lib/autosave'
import { sealPayload, downloadSealedFile } from '../lib/encrypt'
import { sendResults } from '../lib/email'
import TaskPanel from '../components/TaskPanel'
import './SessionScreen.css'

function buildResultCode(track, taskSummaries, totalSecs) {
  const flags = taskSummaries.map((s, i) => {
    const pct = s ? s.score : 0
    return `T${i + 1}${pct >= 0.8 ? '✓' : pct >= 0.5 ? '~' : '✗'}`
  }).join('-')
  return `${track.toUpperCase()}-${flags}-${totalSecs}s`
}

export default function SessionScreen({ config, track, onComplete }) {
  const containerRef = useRef(null)
  const univerRef    = useRef(null)
  const autosaveRef  = useRef(null)

  const [taskIndex, setTaskIndex]       = useState(0)
  const [elapsedTotal, setElapsedTotal] = useState(0)
  const [taskResults, setTaskResults]   = useState({})
  const [taskTimes, setTaskTimes]       = useState({})
  const [taskStartSec, setTaskStartSec] = useState(0)
  const [status, setStatus]            = useState('running') // running | grading | done

  // Session-wide elapsed timer
  useEffect(() => {
    const t = setInterval(() => setElapsedTotal(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  // Boot Univer once
  useEffect(() => {
    if (!containerRef.current || univerRef.current) return
    const { univerAPI } = createUniverInstance(containerRef.current, track.workbookData)
    univerRef.current = univerAPI

    // Autosave every 10 s
    autosaveRef.current = setInterval(() => {
      saveSession({
        config,
        trackId: track.id,
        taskIndex,
        taskResults,
        taskTimes,
        elapsedTotal,
      }).catch(() => {})
    }, 10000)

    return () => {
      clearInterval(autosaveRef.current)
    }
  }, [])

  const finishTask = useCallback(async ({ timedOut }) => {
    if (status !== 'running') return
    const taskId = track.tasks[taskIndex].id
    const answerCells = track.answerKey[taskId] || []
    const sheetName = track.tasks[taskIndex].targetSheet

    const cellResults = gradeTask(univerRef.current, sheetName, answerCells)
    const summary = summarizeTask(cellResults)
    const elapsed = elapsedTotal - taskStartSec

    const newResults = { ...taskResults, [taskId]: { cellResults, summary, elapsed, timedOut } }
    const newTimes   = { ...taskTimes, [taskId]: elapsed }
    setTaskResults(newResults)
    setTaskTimes(newTimes)

    const isLast = taskIndex >= track.tasks.length - 1

    if (!isLast) {
      setTaskIndex(i => i + 1)
      setTaskStartSec(elapsedTotal)
      saveSession({ config, trackId: track.id, taskIndex: taskIndex + 1, taskResults: newResults, taskTimes: newTimes, elapsedTotal }).catch(() => {})
    } else {
      setStatus('grading')
      await completeSession(newResults, newTimes)
    }
  }, [status, taskIndex, taskResults, taskTimes, elapsedTotal, taskStartSec, track, config])

  async function completeSession(results, times) {
    const summaries = track.tasks.map(t => results[t.id]?.summary || null)
    const resultCode = buildResultCode(track.id, summaries, elapsedTotal)

    // Build narrative prompt for AI (or stub if no API key)
    const narrative = await generateNarrative(track, results, config.candidateName)

    const payload = {
      version: 1,
      candidateName: config.candidateName,
      track: track.id,
      trackLabel: track.label,
      resultCode,
      sessionDurationSecs: elapsedTotal,
      tasks: track.tasks.map(t => ({
        id: t.id,
        label: t.label,
        elapsedSecs: times[t.id],
        summary: results[t.id]?.summary,
        cellResults: results[t.id]?.cellResults,
        timedOut: results[t.id]?.timedOut,
      })),
      narrative,
      exportedAt: new Date().toISOString(),
    }

    // Seal + download
    let sealed = null
    try {
      sealed = await sealPayload(payload)
      downloadSealedFile(sealed, config.candidateName)
    } catch (err) {
      console.error('Seal/download failed:', err)
    }

    // Email
    try {
      await sendResults({
        toEmail: config.toEmail,
        ccEmails: config.ccEmails,
        candidateName: config.candidateName,
        track: `${track.label} (${track.id})`,
        resultCode,
        narrative,
        sealedPayload: sealed || '(encryption failed)',
      })
    } catch (err) {
      console.error('Email send failed:', err)
    }

    await clearSession().catch(() => {})
    setStatus('done')
    onComplete({ resultCode, payload })
  }

  if (status === 'grading' || status === 'done') return null

  const currentTask = track.tasks[taskIndex]

  return (
    <div className="session-screen">
      <TaskPanel
        task={currentTask}
        taskIndex={taskIndex}
        totalTasks={track.tasks.length}
        elapsedTotal={elapsedTotal}
        onComplete={finishTask}
      />
      <div className="univer-container" ref={containerRef} />
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
    return `${t.label}: ${s.correct}/${s.total} correct, ${s.hardcoded} hardcoded, ${r.elapsed}s elapsed${r.timedOut ? ' (timed out)' : ''}`
  }).join('\n')

  const prompt = `You are a hiring manager reviewing an Excel skills assessment. Write a 2-paragraph narrative (under 150 words) summarizing this candidate's performance. Be specific, factual, and balanced. Do not include a score or overall hire/no-hire recommendation — Carl will make that judgment.

Candidate: ${candidateName}
Track: ${track.label}

Results:
${summaryText}

Paragraph 1: Strengths observed.
Paragraph 2: Areas of concern or growth.`

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
        messages: [{ role: 'user', content: prompt }],
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
    const hardcodedNote = s.hardcoded > 0 ? ` (${s.hardcoded} cell(s) hardcoded instead of formula)` : ''
    return `${t.label}: ${s.correct}/${s.total} cells correct${hardcodedNote}.`
  })
  return `Assessment summary for ${candidateName} (${track.label} track):\n\n${lines.join(' ')}\n\n(AI narrative unavailable — API key not configured.)`
}
