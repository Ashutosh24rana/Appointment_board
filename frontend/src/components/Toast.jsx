export default function Toast({ toast, onClose }) {
  if (!toast) return null
  const ok = toast.type === 'success'
  return (
    <div className="anim-toast-in fixed bottom-5 right-5 z-50 max-w-sm">
      <div
        className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-white shadow-xl ${
          ok ? 'bg-slate-900' : 'bg-red-600'
        }`}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            ok ? 'bg-emerald-500' : 'bg-white/25'
          }`}
        >
          {ok ? '✓' : '!'}
        </span>
        <span className="leading-snug">{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-1 shrink-0 rounded-full px-1.5 py-0.5 font-bold opacity-60 transition hover:bg-white/15 hover:opacity-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
