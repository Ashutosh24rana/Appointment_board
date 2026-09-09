import AppointmentBoard from './components/AppointmentBoard.jsx'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <rect x="3" y="4" width="18" height="18" rx="3" />
              <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
              <path d="m9 16 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900">
              Appointment Board
            </h1>
            <p className="text-xs text-slate-500">Plan your team&apos;s day at a glance</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <AppointmentBoard />
      </main>
    </div>
  )
}
