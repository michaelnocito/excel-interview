import './CompleteScreen.css'

export default function CompleteScreen({ resultCode }) {
  return (
    <div className="complete-screen">
      <div className="complete-card">
        <div className="complete-check">✓</div>
        <h1>Session Complete</h1>
        <p>Thank you. Your results have been saved.</p>
        {resultCode && (
          <div className="result-code">
            <span className="result-code-label">Session reference</span>
            <span className="result-code-value">{resultCode}</span>
          </div>
        )}
      </div>
    </div>
  )
}
