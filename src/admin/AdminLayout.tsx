import { Suspense, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAdminToken } from '../api/client'
import '../styles/pages/admin.css'

const adminLinks = [
  { to: '/admin/bookings', label: 'Agendamentos' },
  { to: '/admin/contacts', label: 'Contatos' },
  { to: '/admin/content', label: 'Conteúdo' },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Painel | Nails Academy'
  }, [])

  const logout = () => {
    clearAdminToken()
    navigate('/admin/login', { replace: true })
  }

  return <div className="admin-shell">
    <header className="admin-topbar">
      <Link to="/">Nails Academy</Link>
      <span className="admin-topbar-label">Painel</span>
      <button className="btn-secondary" type="button" onClick={logout}>Sair</button>
    </header>
    <div className="admin-body">
      <nav className="admin-nav" aria-label="Navegação do painel">
        <ul>{adminLinks.map(link => <li key={link.to}><NavLink to={link.to}>{link.label}</NavLink></li>)}</ul>
      </nav>
      <main className="admin-main"><Suspense fallback={<p className="page-loading" role="status">Carregando…</p>}><Outlet /></Suspense></main>
    </div>
  </div>
}