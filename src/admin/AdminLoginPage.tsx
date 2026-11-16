import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApiError, clearAdminToken, fetchAdminBookings, getErrorMessage, storeAdminToken } from '../api/client'
import '../styles/pages/admin.css'

interface LocationState {
  from?: string
}

export default function AdminLoginPage() {
  const [token, setToken] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from ?? '/admin/bookings'

  useEffect(() => {
    document.title = 'Entrar | Nails Academy'
  }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (checking) return
    const value = token.trim()
    if (value.length === 0) {
      setError('Informe o token de acesso do painel.')
      return
    }
    setChecking(true)
    setError(null)
    storeAdminToken(value)
    try {
      await fetchAdminBookings()
      navigate(from, { replace: true })
    } catch (cause) {
      clearAdminToken()
      setChecking(false)
      setError(cause instanceof ApiError && cause.status === 401
        ? 'Token inválido. Confira o valor e tente novamente.'
        : getErrorMessage(cause, 'Não foi possível validar o token. Confira se o servidor está no ar.'))
    }
  }

  return <div className="admin-login">
    <form className="admin-login-card" onSubmit={event => { void submit(event) }}>
      <p className="kicker">Nails Academy</p>
      <h1>Entrar no painel</h1>
      <p className="section-sub">Use o token de acesso (ADMIN_TOKEN) para gerenciar agendamentos, contatos e conteúdo.</p>
      <div className="form-field">
        <label htmlFor="admin-token">Token de acesso</label>
        <input id="admin-token" name="token" type="password" autoComplete="off" required value={token} onChange={event => setToken(event.target.value)} placeholder="7f3a9c2e81b4d06f9a5e3c7b21d84f60" />
      </div>
      <div className="form-actions">
        <button className="btn-primary" type="submit" disabled={checking}>{checking ? 'Verificando…' : 'Entrar'}</button>
      </div>
      {error && <p className="form-feedback form-feedback-error" role="alert">{error}</p>}
    </form>
  </div>
}