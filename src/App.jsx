import { useState, useEffect } from 'react'
import { loadSession, clearSession } from './lib/autosave'
import { ENTRY_TRACK } from './data/entry'
import { MID_TRACK } from './data/mid'
import ConfigScreen from './screens/ConfigScreen'
import SessionScreen from './screens/SessionScreen'
import CompleteScreen from './screens/CompleteScreen'

const TRACKS = { entry: ENTRY_TRACK, mid: MID_TRACK }

export default function App() {
  const [phase, setPhase]             = useState('loading')
  const [config, setConfig]           = useState(null)
  const [track, setTrack]             = useState(null)
  const [resultCode, setResultCode]   = useState('')
  const [savedSession, setSavedSession] = useState(null)

  useEffect(() => {
    loadSession().then(session => {
      if (session) { setSavedSession(session); setPhase('recovery') }
      else setPhase('config')
    }).catch(() => setPhase('config'))
  }, [])

  function handleStart(cfg) {
    setConfig(cfg)
    setTrack(TRACKS[cfg.track] || ENTRY_TRACK)
    setPhase('session')
  }

  function handleRecoverYes() {
    setConfig(savedSession.config)
    setTrack(TRACKS[savedSession.trackId] || ENTRY_TRACK)
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

  if (phase === 'recovery') return (
    <div className="recovery-screen">
      <div className="recovery-card">
        <h2>Recover session?</h2>
        <p>A previous session was found for <strong>{savedSession?.config?.candidateName || 'this candidate'}</strong>.</p>
        <div className="recovery-actions">
          <button className="btn-primary" onClick={handleRecoverYes}>Recover session</button>
          <button className="btn-ghost"   onClick={handleRecoverNo}>Start fresh</button>
        </div>
      </div>
    </div>
  )

  if (phase === 'config')   return <ConfigScreen onStart={handleStart} />
  if (phase === 'session')  return <SessionScreen config={config} track={track} onComplete={handleComplete} />
  if (phase === 'complete') return <CompleteScreen resultCode={resultCode} />
  return null
}
