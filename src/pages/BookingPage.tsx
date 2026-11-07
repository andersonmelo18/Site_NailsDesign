import { Link } from 'react-router-dom'
import { site, whatsappUrl } from '../data/site'

export default function BookingPage() {
  return <>
    <section className="section-alt"><div className="container"><div className="cta-final"><h1>Vamos marcar o seu horário?</h1><p>Conte qual serviço deseja e o dia que funciona melhor pra você. Consulte a disponibilidade e combine seu horário pelo WhatsApp.</p><a className="btn-primary" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</a></div></div></section>
    <section aria-labelledby="antes-agendar"><div className="container"><div className="section-head"><p className="kicker">Planeje sua visita</p><h2 id="antes-agendar">Tudo pronto para o seu cuidado</h2></div><p className="page-intro">{site.hours}. O horário é confirmado diretamente na conversa com o studio.</p><div className="hero-actions"><Link className="btn-secondary" to="/servicos">Consultar serviços e valores</Link><Link className="btn-secondary" to="/localizacao">Ver como chegar</Link></div></div></section>
  </>
}
