import emailjs from '@emailjs/browser'

// EmailJS credentials — set these in .env or replace with your IDs
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || ''
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || ''

export async function sendResults({ toEmail, ccEmails, candidateName, track, resultCode, narrative, sealedPayload }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured — skipping email send')
    return { ok: false, reason: 'not-configured' }
  }

  const ccList = ccEmails.filter(Boolean).join(', ')

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email:        toEmail,
        cc_email:        ccList,
        candidate_name:  candidateName,
        track:           track,
        result_code:     resultCode,
        narrative:       narrative,
        sealed_payload:  sealedPayload,
        sent_at:         new Date().toLocaleString(),
      },
      PUBLIC_KEY
    )
    return { ok: true }
  } catch (err) {
    console.error('EmailJS send failed:', err)
    return { ok: false, reason: err?.text || String(err) }
  }
}
