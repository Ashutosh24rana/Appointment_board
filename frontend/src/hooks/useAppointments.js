import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/appointments.js'

// Centralises fetch/add/edit/cancel/complete + toast + filter state.
export function useAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ date: '', status: '' })
  const [toast, setToast] = useState(null) // { type: 'success'|'error', message }

  const showToast = useCallback((type, message) => {
    setToast({ type, message })
  }, [])

  const fetchList = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.list(filters)
      setAppointments(data)
    } catch (e) {
      showToast('error', e.message)
    } finally {
      setLoading(false)
    }
  }, [filters, showToast])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const run = useCallback(
    async (fn, successMsg) => {
      try {
        const result = await fn()
        showToast('success', successMsg)
        await fetchList()
        return result
      } catch (e) {
        showToast('error', e.message)
        throw e
      }
    },
    [fetchList, showToast],
  )

  return {
    appointments,
    loading,
    filters,
    setFilters,
    toast,
    setToast,
    showToast,
    refresh: fetchList,
    add: (payload) => run(() => api.create(payload), 'Appointment created.'),
    edit: (id, payload) => run(() => api.update(id, payload), 'Appointment updated.'),
    complete: (id) => run(() => api.complete(id), 'Marked as completed.'),
    cancel: (id) => run(() => api.cancel(id), 'Appointment cancelled.'),
  }
}
