import { NavLink } from 'react-router-dom'
import { site, whatsappUrl } from '../data/site'

export default function Footer() {
  return <footer>
    <div className="container">
      <div className="footer-grid">
        <div><p className="footer-brand">{site.name}</p><p>Studio de unhas · Cabedelo, PB</p></div>
        <ul className="footer-links">{site.pages.map(page => <li key={page.path}><NavLink to={page.path} end>{page.label}</NavLink></li>)}</ul>
        <ul className="footer-links"><li><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li></ul>
      </div>
      <p className="footer-bottom">&copy; {new Date().getFullYear()} {site.name} Studio de Unhas. Página de demonstração.</p>
    </div>
  </footer>
}
