import { useState } from 'react'
import './ConfigScreen.css'

export default function ConfigScreen({ onStart }) {
  const [form, setForm] = useState({
    candidateName: '',
    track: 'entry',
    toEmail: '',
    ccEmails: '',
  })
  const [error, setError] = useState('')

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  function handleStart(e) {
    e.preventDefault()
    if (!form.candidateName.trim()) { setError('Candidate name is required.'); return }
    if (!form.toEmail.trim())       { setError('Results email is required.');  return }
    setError('')
    onStart({
      candidateName: form.candidateName.trim(),
      track: form.track,
      toEmail: form.toEmail.trim(),
      ccEmails: form.ccEmails.split(',').map(s => s.trim()).filter(Boolean),
    })
  }

  return (
    <div className="config-screen">
      <div className="config-card">
        <h1>Excel Live Assessment</h1>
        <p className="config-subtitle">Interviewer setup — complete before handing over the screen</p>

        <form onSubmit={handleStart}>
          <div className="field">
            <label>Candidate name / initials</label>
            <input
              type="text"
              placeholder="e.g. Jane D."
              value={form.candidateName}
              onChange={set('candidateName')}
              autoFocus
            />
          </div>

          <div className="field">
            <label>Difficulty track</label>
            <div className="track-toggle">
              <button
                type="button"
                className={form.track === 'entry' ? 'active' : ''}
                onClick={() => setForm(f => ({ ...f, track: 'entry' }))}
              >
                Entry Level
              </button>
              <button
                type="button"
                className={form.track === 'mid' ? 'active' : ''}
                onClick={() => setForm(f => ({ ...f, track: 'mid' }))}
              >
                Mid Level
              </button>
            </div>
          </div>

          <div className="field">
            <label>Results email (To)</label>
            <input
              type="email"
              placeholder="carl@company.com"
              value={form.toEmail}
              onChange={set('toEmail')}
            />
          </div>

          <div className="field">
            <label>CC addresses <span className="optional">(optional, comma-separated)</span></label>
            <input
              type="text"
              placeholder="hr@company.com, hiring@company.com"
              value={form.ccEmails}
              onChange={set('ccEmails')}
            />
          </div>

          {error && <p className="config-error">{error}</p>}

          <button type="submit" className="start-btn">Start Session →</button>
        </form>
      </div>
    </div>
  )
}
