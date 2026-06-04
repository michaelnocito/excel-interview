import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Note: no <StrictMode>. Univer mounts its own React root and is not
// StrictMode-safe — the dev double-invoke creates/disposes Univer twice,
// causing "synchronously unmount a root" race warnings.
createRoot(document.getElementById('root')).render(<App />)
