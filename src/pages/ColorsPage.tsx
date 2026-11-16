import SectionHeading from '../components/SectionHeading'
import NailGallery from '../components/NailGallery'
import StatusNote from '../components/StatusNote'
import { loadColorOptions } from '../api/mappers'
import { colors } from '../data/catalog'
import { useApiResource } from '../hooks/useApiResource'

export default function ColorsPage() {
  const { data, status, message } = useApiResource(loadColorOptions, colors)
  return <section className="section-alt"><div className="container"><SectionHeading kicker="Galeria de tons" title="Alguns dos nossos esmaltes favoritos" /><StatusNote status={status} message={message} hint="Exibindo os tons do nosso catálogo." /><NailGallery items={data} carousel /></div></section>
}