const styles = {
  scheduled: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-600',
    bar: 'bg-blue-600',
  },
  completed: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-600',
    bar: 'bg-emerald-500',
  },
  cancelled: {
    badge: 'bg-slate-100 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
    bar: 'bg-slate-300',
  },
}

function fmtTime(t) {
  // backend returns "HH:MM:SS" — display "HH:MM"
  return typeof t === 'string' ? t.slice(0, 5) : t
}

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export default function AppointmentCard({ appt, onEdit, onComplete, onCancel }) {
  const locked = appt.status !== 'scheduled'
  const s = styles[appt.status] || styles.scheduled
  const cancelled = appt.status === 'cancelled'

  return (
    <article
      className={`anim-fade-up group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        cancelled ? 'opacity-70' : ''
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${s.bar}`} />
      <div className="p-5 pl-6">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`font-semibold leading-snug text-slate-900 ${
              cancelled ? 'line-through decoration-slate-400' : ''
            }`}
          >
            {appt.title}
          </h3>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${s.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {appt.status}
          </span>
        </div>

        {appt.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">
            {appt.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-slate-400">
              <rect x="3" y="4" width="18" height="18" rx="3" />
              <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
            </svg>
            {fmtDate(appt.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-slate-400">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" />
            </svg>
            {fmtTime(appt.start_time)} – {fmtTime(appt.end_time)}
          </span>
        </div>

        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3.5">
          <button
            onClick={() => onEdit(appt)}
            disabled={locked}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
          >
            Edit
          </button>
          <button
            onClick={() => onComplete(appt.id)}
            disabled={locked}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-35"
          >
            ✓ Complete
          </button>
          <button
            onClick={() => onCancel(appt.id)}
            disabled={locked}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
          >
            Cancel
          </button>
        </div>
      </div>
    </article>
  )
}
