import { Suspense, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { site } from '../data/site'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const page = site.pages.find(item => item.path === pathname)
  const previousPath = useRef(pathname)
  const title = page?.title ?? 'Página não encontrada'
  const description = page?.description ?? 'Volte ao início para conhecer o Nails Academy.'

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.focus()
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else if (previousPath.current !== pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.getElementById('conteudo')?.focus({ preventScroll: true })
    }
    previousPath.current = pathname
  }, [pathname, hash])

  return <>
    <title>{`${title} | ${site.name}`}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={`${title} | ${site.name}`} />
    <meta property="og:description" content={description} />
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <Header key={pathname} />
    <main id="conteudo" tabIndex={-1}>
      {pathname !== '/' && <nav className="breadcrumb container" aria-label="Caminho da página"><Link to="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">{page?.label ?? 'Página não encontrada'}</span></nav>}
      <Suspense fallback={<p className="page-loading" role="status">Carregando página…</p>}><Outlet /></Suspense>
      {page && !['/', '/agendamento'].includes(pathname) && <aside className="page-action container" aria-label="Agendamento"><p>Seu próximo cuidado começa aqui.</p><Link className="btn-primary" to="/agendamento">Agendar horário</Link></aside>}
    </main>
    <Footer />
    <WhatsAppButton />
  </>
}
