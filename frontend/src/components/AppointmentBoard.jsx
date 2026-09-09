import { useEffect, useState } from 'react'
import FilterBar from './FilterBar.jsx'
import AppointmentCard from './AppointmentCard.jsx'
import AppointmentFormModal from './AppointmentFormModal.jsx'
import Toast from './Toast.jsx'
import { useAppointments } from '../hooks/useAppointments.js'

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton mt-2 h-3 w-1/3 rounded" />
      <div className="skeleton mt-4 h-3 w-1/2 rounded" />
      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3.5">
        <div className="skeleton h-7 w-16 rounded-lg" />
        <div className="skeleton h-7 w-20 rounded-lg" />
        <div className="skeleton h-7 w-16 rounded-lg" />
      </div>
    </div>
  )
}

export default function AppointmentBoard() {
  const {
    appointments, loading, filters, setFilters,
    toast, setToast, add, edit, complete, cancel,
  } = useAppointments()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  // auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast, setToast])

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(appt) {
    setEditing(appt)
    setModalOpen(true)
  }

  async function handleSubmit(form) {
    if (editing) await edit(editing.id, form)
    else await add(form)
  }

  const counts = {
    scheduled: appointments.filter((a) => a.status === 'scheduled').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {loading ? 'Your schedule' : (
              <>
                {appointments.length}{' '}
                <span className="font-medium text-slate-500">
                  appointment{appointments.length === 1 ? '' : 's'}
                </span>
              </>
            )}
          </h2>
          {!loading && appointments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-700">
                ● {counts.scheduled} scheduled
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                ● {counts.completed} completed
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-500">
                ● {counts.cancelled} cancelled
              </span>
            </div>
          )}
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-[0.98]"
        >
          <span className="text-base leading-none">＋</span>
          Add Appointment
        </button>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({ date: '', status: '' })}
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">
            📅
          </span>
          <h3 className="mt-4 font-bold text-slate-900">No appointments found</h3>
          <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500">
            {filters.date || filters.status
              ? 'Try adjusting your filters, or create a new appointment.'
              : 'Get started by adding your first appointment.'}
          </p>
          <button
            onClick={openCreate}
            className="mt-5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            ＋ Add Appointment
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {appointments.map((a) => (
            <AppointmentCard
              key={a.id}
              appt={a}
              onEdit={openEdit}
              onComplete={complete}
              onCancel={cancel}
            />
          ))}
        </div>
      )}

      <AppointmentFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
