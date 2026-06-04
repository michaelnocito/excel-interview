import { useState } from 'react'
import { TEMPLATES, TEMPLATE_MAP } from '../data/templates'
import './ConfigScreen.css'

export default function ConfigScreen({ onStart }) {
  const [form, setForm] = useState({
    candidateName: '',
    track: TEMPLATES[0].id,
    toEmail: '',
    ccEmails: '',
  })
  const [error, setError] = useState('')
  const selected = TEMPLATE_MAP[form.track]

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
            <label>Assessment template</label>
            <select className="template-select" value={form.track} onChange={set('track')}>
              {TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            {selected && (
              <p className="template-meta">
                {selected.tasks.length} tasks · {selected.workbookData.name}
              </p>
            )}
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
