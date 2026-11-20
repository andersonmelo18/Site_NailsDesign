import { Link } from 'react-router-dom'
import { site, whatsappUrl } from '../data/site'
// Componente que consome a API de clima (ver src/components/WeatherCard.tsx).
// Aqui ele recebe as coordenadas do studio, vindas de src/data/site.ts.
import WeatherCard from '../components/WeatherCard'

export default function BookingPage() {
  // site.coordinates = [latitude, longitude], já cadastrado em data/site.ts.
  const [latitude, longitude] = site.coordinates

  return <>
    <section className="section-alt"><div className="container"><div className="cta-final"><h1>Vamos marcar o seu horário?</h1><p>Conte qual serviço deseja e o dia que funciona melhor pra você. Consulte a disponibilidade e combine seu horário pelo WhatsApp.</p><a className="btn-primary" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</a></div></div></section>
    <section aria-labelledby="antes-agendar"><div className="container"><div className="section-head"><p className="kicker">Planeje sua visita</p><h2 id="antes-agendar">Tudo pronto para o seu cuidado</h2></div><p className="page-intro">{site.hours}. O horário é confirmado diretamente na conversa com o studio.</p>
      {/* Previsão do tempo ajuda quem está agendando a se planejar (ex: levar guarda-chuva). */}
      <div style={{ margin: '24px 0' }}>
        <WeatherCard titulo="Previsão do tempo em Cabedelo" latitude={latitude} longitude={longitude} />
      </div>
      <div className="hero-actions"><Link className="btn-secondary" to="/servicos">Consultar serviços e valores</Link><Link className="btn-secondary" to="/localizacao">Ver como chegar</Link></div></div></section>
  </>
}
