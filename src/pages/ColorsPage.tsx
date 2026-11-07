import SectionHeading from '../components/SectionHeading'
import NailGallery from '../components/NailGallery'
import { colors } from '../data/catalog'

export default function ColorsPage() {
  return <section className="section-alt"><div className="container"><SectionHeading kicker="Galeria de tons" title="Alguns dos nossos esmaltes favoritos" /><NailGallery items={colors} carousel /></div></section>
}
