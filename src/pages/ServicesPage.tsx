import '../styles/pages/services.css'
import { fetchServices } from '../api/client'
import StatusNote from '../components/StatusNote'
import { services as fallbackServices } from '../data/catalog'
import { useApiResource } from '../hooks/useApiResource'

export default function ServicesPage() {
  const { data, status, message } = useApiResource(fetchServices, fallbackServices)
  return (<>
<section id="servicos">
  <div className="container">
    <div className="section-head">
      <p className="kicker">Serviços</p>
      <h1>O que fazemos por aqui</h1>
    </div>
    <StatusNote status={status} message={message} hint="Exibindo os serviços do nosso catálogo." />
    {data.length === 0
      ? <p className="empty-note">Nenhum serviço cadastrado no momento.</p>
      : <ul className="menu-list">
        {data.map(service => <li className="menu-row" key={service.id}>
          <span className="name">{service.name}{service.duration > 0 && <span className="desc"> · {service.duration} min</span>}</span>
          <span className="leader"></span>
          <span className="price">{service.price}</span>
        </li>)}
      </ul>}
  </div>
</section>

  </>)
}