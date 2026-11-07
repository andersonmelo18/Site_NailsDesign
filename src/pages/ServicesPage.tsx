import '../styles/pages/services.css'

export default function ServicesPage() {
  return (<>
<section id="servicos">
  <div className="container">
    <div className="section-head">
      <p className="kicker">Serviços</p>
      <h1>O que fazemos por aqui</h1>
    </div>
    <ul className="menu-list">
      <li className="menu-row">
        <span className="name">Manicure tradicional</span>
        <span className="leader"></span>
        <span className="price">R$ 35</span>
      </li>
      <li className="menu-row">
        <span className="name">Esmaltação em gel</span>
        <span className="leader"></span>
        <span className="price">R$ 60</span>
      </li>
      <li className="menu-row">
        <span className="name">Alongamento em fibra</span>
        <span className="leader"></span>
        <span className="price">R$ 120</span>
      </li>
      <li className="menu-row">
        <span className="name">Spa das mãos</span>
        <span className="leader"></span>
        <span className="price">R$ 45</span>
      </li>
      <li className="menu-row">
        <span className="name">Nail art personalizada</span>
        <span className="leader"></span>
        <span className="price">a partir de R$ 15</span>
      </li>
    </ul>
  </div>
</section>

  </>)
}
