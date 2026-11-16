import ContactForm from '../components/ContactForm'
import SectionHeading from '../components/SectionHeading'
import StudioMap from '../components/StudioMap'
import { site, directionsUrl } from '../data/site'
import '../styles/pages/location.css'

export default function LocationPage() {
  return <>
    <section><div className="container"><SectionHeading kicker="Localização" title="Onde nos encontrar" /><div className="local-grid"><div className="local-info"><p className="local-address">{site.address}<br />{site.city}</p><p className="local-hours">{site.hours}</p><a className="btn-primary" href={directionsUrl} target="_blank" rel="noopener noreferrer">Traçar rota</a></div><StudioMap /></div></div></section>
    <section className="section-alt" aria-labelledby="contato"><div className="container"><div className="section-head"><p className="kicker">Contato</p><h2 id="contato">Mande uma mensagem</h2><p className="section-sub">Tem uma dúvida sobre serviços, valores ou cuidados? Escreva aqui que o studio responde pelo canal que você preferir.</p></div><ContactForm /></div></section>
  </>
}