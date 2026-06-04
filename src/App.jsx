import { useState, useEffect } from 'react'
import { loadSession, clearSession } from './lib/autosave'
import { TEMPLATE_MAP, TEMPLATES } from './data/templates'
import ConfigScreen from './screens/ConfigScreen'
import SessionScreen from './screens/SessionScreen'
import CompleteScreen from './screens/CompleteScreen'

const DEFAULT_TEMPLATE = TEMPLATES[0]

export default function App() {
  const [phase, setPhase]               = useState('loading')
  const [config, setConfig]             = useState(null)
  const [track, setTrack]               = useState(null)
  const [resume, setResume]             = useState(null)
  const [resultCode, setResultCode]     = useState('')
  const [savedSession, setSavedSession] = useState(null)

  useEffect(() => {
    loadSession().then(session => {
      if (session) { setSavedSession(session); setPhase('recovery') }
      else setPhase('config')
    }).catch(() => setPhase('config'))
  }, [])

  function handleStart(cfg) {
    setConfig(cfg)
    setTrack(TEMPLATE_MAP[cfg.track] || DEFAULT_TEMPLATE)
    setResume(null)
    setPhase('session')
  }

  function handleRecoverYes() {
    setConfig(savedSession.config)
    setTrack(TEMPLATE_MAP[savedSession.trackId] || DEFAULT_TEMPLATE)
    setResume(savedSession)            // carries workbookSnapshot + progress
    setPhase('session')
  }

  function handleRecoverNo() {
    clearSession().catch(() => {})
    setSavedSession(null)
    setPhase('config')
  }

  function handleComplete({ resultCode: code }) {
    setResultCode(code)
    setPhase('complete')
  }

  if (phase === 'loading') return <div className="loading">Loading…</div>

  if (phase === 'recovery') {
    const s = savedSession
    const tmpl = TEMPLATE_MAP[s?.trackId]
    return (
      <div className="recovery-screen">
        <div className="recovery-card">
          <h2>Recover session?</h2>
          <p>
            A previous session was found for <strong>{s?.config?.candidateName || 'this candidate'}</strong>
            {tmpl ? <> on <strong>{tmpl.label}</strong></> : null}.
          </p>
          <p className="recovery-sub">Recovering restores their spreadsheet and progress exactly where they left off.</p>
          <div className="recovery-actions">
            <button className="btn-primary" onClick={handleRecoverYes}>Recover session</button>
            <button className="btn-ghost"   onClick={handleRecoverNo}>Start fresh</button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'config')   return <ConfigScreen onStart={handleStart} />
  if (phase === 'session')  return <SessionScreen config={config} track={track} resume={resume} onComplete={handleComplete} />
  if (phase === 'complete') return <CompleteScreen resultCode={resultCode} />
  return null
}
