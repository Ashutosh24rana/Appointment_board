import { useEffect, useState } from 'react'
import { todayLocal, validateForm } from '../utils/validation.js'

const empty = { title: '', description: '', date: '', start_time: '', end_time: '' }

export default function AppointmentFormModal({ open, initial, onClose, onSubmit }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              title: initial.title ?? '',
              description: initial.description ?? '',
              date: initial.date ?? '',
              start_time: (initial.start_time ?? '').slice(0, 5),
              end_time: (initial.end_time ?? '').slice(0, 5),
            }
          : empty,
      )
      setErrors({})
      setServerError('')
    }
  }, [open, initial])

  // close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    const v = validateForm(form)
    setErrors(v)
    if (Object.keys(v).length) return
    setSaving(true)
    setServerError('')
    try {
      await onSubmit(form)
      onClose()
    } catch (err) {
      setServerError(err.message) // e.g. 409 time-slot conflict
    } finally {
      setSaving(false)
    }
  }

  const input = (hasErr) =>
    `w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 transition outline-none placeholder:text-slate-400 ${
      hasErr
        ? 'border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-2 focus:ring-red-100'
        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`

  const label = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500'
  const errText = 'mt-1 text-xs font-medium text-red-600'

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="anim-pop-in w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-bold leading-tight text-slate-900">
              {initial ? 'Edit Appointment' : 'New Appointment'}
            </h2>
            <p className="text-xs text-slate-500">
              {initial ? 'Update the details below' : 'Fill in the details below'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-lg leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div>
            <label className={label}>Title *</label>
            <input
              placeholder="e.g. Design review with team"
              value={form.title}
              onChange={set('title')}
              className={input(errors.title)}
              autoFocus
            />
            {errors.title && <p className={errText}>{errors.title}</p>}
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea
              placeholder="Optional notes, agenda, link…"
              value={form.description}
              onChange={set('description')}
              rows={2}
              className={`${input(false)} resize-none`}
            />
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-3 sm:col-span-1">
              <label className={label}>Date *</label>
              <input type="date" value={form.date} min={todayLocal()} onChange={set('date')} className={input(errors.date)} />
              {errors.date && <p className={errText}>{errors.date}</p>}
            </div>
            <div>
              <label className={label}>Starts *</label>
              <input type="time" value={form.start_time} onChange={set('start_time')} className={input(errors.start_time)} />
              {errors.start_time && <p className={errText}>{errors.start_time}</p>}
            </div>
            <div>
              <label className={label}>Ends *</label>
              <input type="time" value={form.end_time} onChange={set('end_time')} className={input(errors.end_time)} />
              {errors.end_time && <p className={errText}>{errors.end_time}</p>}
            </div>
          </div>
          {serverError && (
            <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
              <span className="mt-0.5">⚠</span>
              {serverError}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
            >
              {saving ? 'Saving…' : initial ? 'Save changes' : 'Create appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
