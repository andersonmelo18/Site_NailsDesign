import '../styles/pages/testimonials.css'

export default function TestimonialsPage() {
  return (<>
<section id="depoimentos" className="section-alt">
  <div className="container">
    <div className="section-head">
      <p className="kicker">Depoimentos</p>
      <h1>Quem já passou por aqui</h1>
    </div>
    <div className="testimonial-grid">
      <div className="testimonial">
        <p className="quote">"Minhas unhas nunca duraram tanto tempo com o gel. Voltei porque o atendimento é calmo, sem correria."</p>
        <p className="who">— Renata A.</p>
      </div>
      <div className="testimonial">
        <p className="quote">"Marquei sem saber o que queria e saí com uma nail art que combinou exatamente com meu estilo."</p>
        <p className="who">— Juliana M.</p>
      </div>
      <div className="testimonial">
        <p className="quote">"Percebi a diferença na higiene logo na primeira vez. Hoje é o único lugar que confio pra fazer minhas unhas."</p>
        <p className="who">— Carla S.</p>
      </div>
    </div>
  </div>
</section>

  </>)
}
