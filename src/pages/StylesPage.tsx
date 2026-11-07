import SectionHeading from '../components/SectionHeading'
import NailGallery from '../components/NailGallery'
import { shapes } from '../data/catalog'

export default function StylesPage() {
  return <section><div className="container"><SectionHeading kicker="Galeria de estilos" title="Escolha o formato da sua unha" description="Cada formato valoriza um tipo de mão e um estilo de vida diferente. Toque pra ver como fica na prática." /><NailGallery items={shapes} /></div></section>
}
