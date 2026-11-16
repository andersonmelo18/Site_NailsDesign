import SectionHeading from '../components/SectionHeading'
import NailGallery from '../components/NailGallery'
import StatusNote from '../components/StatusNote'
import { loadStyleOptions } from '../api/mappers'
import { shapes } from '../data/catalog'
import { useApiResource } from '../hooks/useApiResource'

export default function StylesPage() {
  const { data, status, message } = useApiResource(loadStyleOptions, shapes)
  return <section><div className="container"><SectionHeading kicker="Galeria de estilos" title="Escolha o formato da sua unha" description="Cada formato valoriza um tipo de mão e um estilo de vida diferente. Toque pra ver como fica na prática." /><StatusNote status={status} message={message} hint="Exibindo os formatos do nosso catálogo." /><NailGallery items={data} /></div></section>
}