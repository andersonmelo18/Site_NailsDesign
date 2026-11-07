import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'

export default function NotFoundPage() {
  return <section><div className="container"><SectionHeading kicker="404" title="Página não encontrada" description="Esse endereço não está disponível. Volte ao início para conhecer o studio." /><Link className="btn-primary" to="/">Voltar ao início</Link></div></section>
}
