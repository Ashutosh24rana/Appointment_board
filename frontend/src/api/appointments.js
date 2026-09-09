// Thin wrapper around the FastAPI backend. Uses fetch (no extra deps).
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function handle(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data?.detail || `Request failed (${res.status})`
    throw new Error(Array.isArray(msg) ? msg.join('; ') : msg)
  }
  return data
}

function qs(params) {
  const sp = new URLSearchParams()
  if (params.date) sp.set('date', params.date)
  if (params.status) sp.set('status', params.status)
  const s = sp.toString()
  return s ? `?${s}` : ''
}

export const api = {
  list: ({ date, status } = {}) =>
    fetch(`${BASE_URL}/appointments${qs({ date, status })}`).then(handle),
  create: (payload) =>
    fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handle),
  update: (id, payload) =>
    fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handle),
  complete: (id) =>
    fetch(`${BASE_URL}/appointments/${id}/complete`, { method: 'PATCH' }).then(handle),
  cancel: (id) =>
    fetch(`${BASE_URL}/appointments/${id}/cancel`, { method: 'PATCH' }).then(handle),
}
