// Client-side validation before submit (mirrors backend rules).

// Local YYYY-MM-DD (avoids the UTC off-by-one of toISOString()).
export function todayLocal() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function nowHM() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export function validateForm({ title, date, start_time, end_time }) {
  const errors = {}
  if (!title || !title.trim()) errors.title = 'Title is required.'
  if (!date) {
    errors.date = 'Date is required.'
  } else if (date < todayLocal()) {
    errors.date = 'Date cannot be in the past.'
  }
  if (!start_time) errors.start_time = 'Start time is required.'
  if (!end_time) errors.end_time = 'End time is required.'
  if (start_time && end_time && end_time <= start_time) {
    errors.end_time = 'End time must be after start time.'
  } else if (
    date === todayLocal() &&
    start_time &&
    end_time &&
    end_time <= nowHM()
  ) {
    errors.end_time = 'This time slot has already passed today.'
  }
  return errors
}
