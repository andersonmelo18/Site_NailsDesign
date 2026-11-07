import '../styles/pages/about.css'

export default function AboutPage() {
  return (<>
<section id="sobre" className="section-alt">
  <div className="container">
    <div className="section-head">
      <p className="kicker">Sobre o studio</p>
      <h1>Cuidado que começa antes do esmalte</h1>
    </div>
    <div className="about-grid">
      <div className="about-item">
        <h3>Higiene em primeiro lugar</h3>
        <p>Instrumentos esterilizados a cada atendimento e materiais individuais, sem exceção.</p>
      </div>
      <div className="about-item">
        <h3>Tempo pra cada detalhe</h3>
        <p>Horários espaçados, sem encaixes apressados — cada procedimento no seu tempo certo.</p>
      </div>
      <div className="about-item">
        <h3>Produtos de qualidade</h3>
        <p>Esmaltes e géis selecionados por durabilidade e saúde da unha, não só pela cor.</p>
      </div>
    </div>
  </div>
</section>

  </>)
}
