import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { site } from '../data/site'

export default function Header() {
  const [open, setOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false)
    }
    const desktop = matchMedia('(min-width: 1200px)')
    const onResize = () => setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
      desktop.removeEventListener('change', onResize)
    }
  }, [open])

  return <header className="site-header" ref={header}>
    <div className="nav-wrap">
      <Link to="/" className="logo" aria-label="Nails Academy — página inicial">{site.name}</Link>
      <nav className="desktop-nav" aria-label="Navegação principal">
        <ul className="nav-links">{site.pages.filter(page => page.path !== '/agendamento').map(page =>
          <li key={page.path}><NavLink to={page.path} end>{page.label}</NavLink></li>
        )}</ul>
      </nav>
      <NavLink className="nav-cta" to="/agendamento">Agendar horário</NavLink>
      <button ref={toggle} className={`menu-toggle${open ? ' open' : ''}`} type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="mobilePanel" onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
    </div>
    <nav className={`mobile-panel${open ? ' open' : ''}`} id="mobilePanel" aria-label="Navegação móvel">
      {site.pages.map(page => <NavLink key={page.path} to={page.path} end onClick={() => setOpen(false)}>{page.label}</NavLink>)}
    </nav>
  </header>
}
