import { Link } from 'react-router-dom'
import { imageUrl } from '../data/site'
import '../styles/pages/home.css'

export default function HomePage() {
  return (<>
<section className="hero">
  <div className="container">
    <div className="hero-copy">
      <p className="hero-eyebrow">Studio de unhas · Cabedelo</p>
      <h1>Suas mãos merecem um acabamento <em>impecável</em></h1>
      <p className="lead">Manicure de precisão, esmaltação em gel duradoura e nail art autoral, feitas sob medida pra sua rotina. Atendimento individual, sem pressa.</p>
      <div className="hero-actions">
        <Link className="btn-primary" to="/agendamento">Agendar pelo WhatsApp</Link>
        <Link className="btn-secondary" to="/servicos">Ver serviços</Link>
      </div>
    </div>
    <div className="hero-visual">
      <div className="accent-block" aria-hidden="true"></div>
      <div className="photo-frame">
        <img src={imageUrl("espaco.webp")} alt="Espaço do Nails Academy Studio de Unhas" />
      </div>
      <span className="hero-badge">+200 clientes atendidas</span>
    </div>
  </div>
</section>
<section className="section-alt" aria-labelledby="explorar-titulo">
  <div className="container">
    <div className="section-head">
      <p className="kicker">Conheça o Nails Academy</p>
      <h2 id="explorar-titulo">Seu cuidado, do seu jeito</h2>
    </div>
    <div className="explore-grid">
      <Link className="explore-card" to="/sobre"><span className="explore-number">01</span><h3>O studio</h3><p>Conheça nosso espaço e o cuidado com cada detalhe.</p><span className="explore-link">Conhecer o studio →</span></Link>
      <Link className="explore-card" to="/servicos"><span className="explore-number">02</span><h3>Serviços</h3><p>Manicure, gel, alongamento e nail art. Confira os valores.</p><span className="explore-link">Ver serviços →</span></Link>
      <Link className="explore-card" to="/cores"><span className="explore-number">03</span><h3>Suas cores</h3><p>Dos neutros aos tons intensos, encontre seu favorito.</p><span className="explore-link">Explorar os tons →</span></Link>
      <Link className="explore-card" to="/estilos"><span className="explore-number">04</span><h3>Seu formato</h3><p>Amendoada, stiletto ou bailarina: descubra seu estilo.</p><span className="explore-link">Conhecer os formatos →</span></Link>
      <Link className="explore-card" to="/depoimentos"><span className="explore-number">05</span><h3>Experiências</h3><p>Leia o que dizem as clientes que já passaram por aqui.</p><span className="explore-link">Ler depoimentos →</span></Link>
      <Link className="explore-card" to="/localizacao"><span className="explore-number">06</span><h3>Venha nos visitar</h3><p>Veja nosso endereço em Cabedelo e os horários do studio.</p><span className="explore-link">Ver localização →</span></Link>
    </div>
  </div>
</section>

  </>)
}
