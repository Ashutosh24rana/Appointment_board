export default function FilterBar({ filters, onChange, onClear }) {
  const hasFilter = Boolean(filters.date || filters.status)
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-[10rem] flex-1 flex-col text-sm sm:flex-none">
          <span className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Date
          </span>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onChange({ ...filters, date: e.target.value })}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="flex min-w-[10rem] flex-1 flex-col text-sm sm:flex-none">
          <span className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Status
          </span>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        {hasFilter && (
          <button
            onClick={onClear}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  )
}
