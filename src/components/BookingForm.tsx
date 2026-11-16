import { useState } from 'react'
import type { FormEvent } from 'react'
import { createBooking, fetchServices, getErrorMessage } from '../api/client'
import type { BookingReceipt } from '../api/types'
import { services as fallbackServices } from '../data/catalog'
import { whatsappUrl } from '../data/site'
import { useApiResource } from '../hooks/useApiResource'
import { bookingStatusLabels } from '../utils/labels'
import { formatPhone } from '../utils/phone'

interface FormState {
  name: string
  phone: string
  service: string
  date: string
  time: string
  notes: string
}

const emptyForm: FormState = { name: '', phone: '', service: '', date: '', time: '', notes: '' }

function today(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export default function BookingForm() {
  const { data: serviceOptions } = useApiResource(fetchServices, fallbackServices)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [sending, setSending] = useState(false)
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null)
  const [error, setError] = useState<string | null>(null)

  const update = (field: keyof FormState, value: string) => setForm(current => ({ ...current, [field]: value }))

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    setSending(true)
    setError(null)
    setReceipt(null)
    try {
      const result = await createBooking({
        name: form.name.trim(),
        phone: form.phone.trim(),
        service: form.service,
        date: form.date,
        time: form.time,
        notes: form.notes.trim().length > 0 ? form.notes.trim() : undefined,
      })
      setReceipt(result)
      setForm(emptyForm)
    } catch (cause) {
      setError(getErrorMessage(cause, 'Não foi possível enviar o pedido. Tente novamente.'))
    } finally {
      setSending(false)
    }
  }

  return <form className="booking-form" onSubmit={event => { void submit(event) }}>
    <div className="form-grid">
      <div className="form-field">
        <label htmlFor="booking-name">Seu nome</label>
        <input id="booking-name" name="name" type="text" autoComplete="name" required value={form.name} onChange={event => update('name', event.target.value)} placeholder="Como podemos te chamar?" />
      </div>
      <div className="form-field">
        <label htmlFor="booking-phone">Celular</label>
        <input id="booking-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required value={form.phone} onChange={event => update('phone', formatPhone(event.target.value))} placeholder="(83) 99999-9999" />
      </div>
      <div className="form-field field-wide">
        <label htmlFor="booking-service">Serviço desejado</label>
        <select id="booking-service" name="service" required value={form.service} onChange={event => update('service', event.target.value)}>
          <option value="">Selecione um serviço</option>
          {serviceOptions.map(service => <option key={service.id} value={service.name}>{service.name} — {service.price}</option>)}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="booking-date">Dia</label>
        <input id="booking-date" name="date" type="date" required min={today()} value={form.date} onChange={event => update('date', event.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="booking-time">Horário</label>
        <input id="booking-time" name="time" type="time" required step={900} value={form.time} onChange={event => update('time', event.target.value)} />
      </div>
      <div className="form-field field-wide">
        <label htmlFor="booking-notes">Algum detalhe? <span className="form-optional">(opcional)</span></label>
        <textarea id="booking-notes" name="notes" rows={3} value={form.notes} onChange={event => update('notes', event.target.value)} placeholder="Conte se prefere algum formato, cor ou cuidado especial." />
      </div>
    </div>
    <div className="form-actions">
      <button className="btn-primary" type="submit" disabled={sending}>{sending ? 'Enviando…' : 'Pedir meu horário'}</button>
      <span className="form-hint">O horário é confirmado pelo studio pelo WhatsApp.</span>
    </div>
    {error && <p className="form-feedback form-feedback-error" role="alert">{error}</p>}
    {receipt && <div className="form-feedback form-feedback-success" role="status">
      <strong>Pedido #{receipt.id} enviado.</strong> Status: {bookingStatusLabels[receipt.status]}. O studio confirma o horário pelo WhatsApp.
      <span className="form-feedback-link"><a href={whatsappUrl(`Olá! Acabei de pedir o horário #${receipt.id} pelo site.`)} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a></span>
    </div>}
  </form>
}