const DB_NAME = 'excel-interview'
const STORE = 'session'
const KEY = 'active'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE)
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = e => reject(e.target.error)
  })
}

export async function saveSession(data) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put({ ...data, savedAt: Date.now() }, KEY)
    tx.oncomplete = resolve
    tx.onerror = e => reject(e.target.error)
  })
}

export async function loadSession() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(KEY)
    req.onsuccess = e => resolve(e.target.result || null)
    req.onerror = e => reject(e.target.error)
  })
}

export async function clearSession() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(KEY)
    tx.oncomplete = resolve
    tx.onerror = e => reject(e.target.error)
  })
}
