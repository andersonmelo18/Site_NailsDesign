import { useState } from 'react'
import type { FormEvent } from 'react'
import { createContact, getErrorMessage } from '../api/client'
import { whatsappUrl } from '../data/site'
import { formatPhone } from '../utils/phone'

interface FormState {
  name: string
  phone: string
  message: string
}

const emptyForm: FormState = { name: '', phone: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (field: keyof FormState, value: string) => setForm(current => ({ ...current, [field]: value }))

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    setSending(true)
    setError(null)
    setSent(false)
    try {
      await createContact({ name: form.name.trim(), phone: form.phone.trim(), message: form.message.trim() })
      setSent(true)
      setForm(emptyForm)
    } catch (cause) {
      setError(getErrorMessage(cause, 'Não foi possível enviar a mensagem. Tente novamente.'))
    } finally {
      setSending(false)
    }
  }

  return <form className="booking-form" onSubmit={event => { void submit(event) }}>
    <div className="form-grid">
      <div className="form-field">
        <label htmlFor="contact-name">Seu nome</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" required value={form.name} onChange={event => update('name', event.target.value)} placeholder="Como podemos te chamar?" />
      </div>
      <div className="form-field">
        <label htmlFor="contact-phone">Celular</label>
        <input id="contact-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required value={form.phone} onChange={event => update('phone', formatPhone(event.target.value))} placeholder="(83) 99999-9999" />
      </div>
      <div className="form-field field-wide">
        <label htmlFor="contact-message">Mensagem</label>
        <textarea id="contact-message" name="message" rows={4} required value={form.message} onChange={event => update('message', event.target.value)} placeholder="Escreva sua dúvida ou como podemos ajudar." />
      </div>
    </div>
    <div className="form-actions">
      <button className="btn-primary" type="submit" disabled={sending}>{sending ? 'Enviando…' : 'Enviar mensagem'}</button>
      <span className="form-hint">Prefere conversar agora? <a href={whatsappUrl('Olá! Vim pelo site e gostaria de falar com o studio.')}>Chamar no WhatsApp</a>.</span>
    </div>
    {error && <p className="form-feedback form-feedback-error" role="alert">{error}</p>}
    {sent && <p className="form-feedback form-feedback-success" role="status">Mensagem enviada! O studio responde em breve.</p>}
  </form>
}