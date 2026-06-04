import { useEffect, useState, useRef } from 'react'
import './TaskPanel.css'

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TaskPanel({ task, taskIndex, totalTasks, elapsedTotal, onComplete }) {
  const [secsLeft, setSecsLeft] = useState(task.minutes * 60)
  const intervalRef = useRef(null)

  useEffect(() => {
    setSecsLeft(task.minutes * 60)
  }, [task.id])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          onComplete({ timedOut: true })
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [task.id])

  const pct = (secsLeft / (task.minutes * 60)) * 100
  const urgent = secsLeft < 60

  return (
    <div className="task-panel">
      <div className="panel-header">
        <span className="task-counter">{taskIndex + 1} of {totalTasks}</span>
        <h2 className="task-label">{task.label}</h2>
      </div>

      <div className={`timer-block ${urgent ? 'urgent' : ''}`}>
        <div className="timer-value">{formatTime(secsLeft)}</div>
        <div className="timer-bar">
          <div className="timer-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="session-elapsed">Session: {formatTime(elapsedTotal)}</div>
      </div>

      <div className="instructions">
        <h3>What to do</h3>
        {task.instructions.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <button className="complete-btn" onClick={() => onComplete({ timedOut: false })}>
        Mark Complete →
      </button>
    </div>
  )
}
