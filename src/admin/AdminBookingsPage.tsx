import { useState } from 'react'
import { fetchAdminBookings, getErrorMessage, updateBookingStatus } from '../api/client'
import type { Booking, BookingStatus } from '../api/types'
import { useAdminResource } from '../hooks/useApiResource'
import { bookingStatusLabels, formatDate, formatDateTime } from '../utils/labels'
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect'
import '../styles/pages/admin.css'

const statuses = Object.keys(bookingStatusLabels) as BookingStatus[]

export default function AdminBookingsPage() {
  const { items, status, message, error, reload } = useAdminResource(fetchAdminBookings)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  useUnauthorizedRedirect(error)

  const changeStatus = async (id: number, next: BookingStatus) => {
    setSavingId(id)
    setActionError(null)
    try {
      await updateBookingStatus(id, next)
      reload()
    } catch (cause) {
      setActionError(getErrorMessage(cause, 'Não foi possível atualizar o status.'))
    } finally {
      setSavingId(null)
    }
  }

  return <section className="admin-panel">
    <div className="admin-panel-head">
      <div>
        <h1>Agendamentos</h1>
        <p className="section-sub">Pedidos enviados pelo formulário do site.</p>
      </div>
      <button className="btn-secondary" type="button" onClick={reload}>Atualizar</button>
    </div>
    {actionError && <p className="form-feedback form-feedback-error" role="alert">{actionError}</p>}
    {status === 'loading' && <p className="status-note" role="status">Carregando…</p>}
    {status === 'error' && <p className="status-note status-note-error" role="status">{message}</p>}
    {status === 'ready' && items.length === 0 && <p className="admin-empty">Nenhum agendamento recebido até agora.</p>}
    {status === 'ready' && items.length > 0 && <div className="admin-table-scroll">
      <table className="admin-table">
        <thead><tr><th scope="col">Pedido</th><th scope="col">Cliente</th><th scope="col">Serviço</th><th scope="col">Quando</th><th scope="col">Status</th></tr></thead>
        <tbody>{items.map((booking: Booking) => <tr key={booking.id}>
          <td>#{booking.id}</td>
          <td><strong>{booking.name}</strong><br />{booking.phone}{booking.notes && <span className="admin-note">Obs.: {booking.notes}</span>}</td>
          <td>{booking.service}</td>
          <td>{formatDate(booking.date)} · {booking.time}</td>
          <td>
            <select className="status-select" aria-label={`Status do agendamento ${booking.id}`} value={booking.status} disabled={savingId === booking.id} onChange={event => { void changeStatus(booking.id, event.target.value as BookingStatus) }}>
              {statuses.map(value => <option key={value} value={value}>{bookingStatusLabels[value]}</option>)}
            </select>
            <span className="admin-note">Recebido em {formatDateTime(booking.createdAt)}</span>
          </td>
        </tr>)}</tbody>
      </table>
    </div>}
  </section>
}