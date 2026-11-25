import SectionHeading from '../components/SectionHeading'
import StudioMap from '../components/StudioMap'
import { site, directionsUrl } from '../data/site'
import '../styles/pages/location.css'
// Mesmo componente de clima usado em BookingPage: aqui é a segunda "parte
// diferente da aplicação" em que a biblioteca de componentes (MUI) e o
// consumo de API aparecem, reaproveitando o componente com as mesmas props.
import WeatherCard from '../components/WeatherCard'

export default function LocationPage() {
  const [latitude, longitude] = site.coordinates

  return <section><div className="container"><SectionHeading kicker="Localização" title="Onde nos encontrar" /><div className="local-grid"><div className="local-info"><p className="local-address">{site.address}<br />{site.city}</p><p className="local-hours">{site.hours}</p><a className="btn-primary" href={directionsUrl} target="_blank" rel="noopener noreferrer">Traçar rota</a>
    <div style={{ marginTop: 20 }}>
      <WeatherCard titulo="Como está o tempo agora" latitude={latitude} longitude={longitude} />
    </div>
  </div><StudioMap /></div></div></section>
}
