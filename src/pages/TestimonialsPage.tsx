import '../styles/pages/testimonials.css'
import { fetchTestimonials } from '../api/client'
import StatusNote from '../components/StatusNote'
import { testimonials as fallbackTestimonials } from '../data/catalog'
import { useApiResource } from '../hooks/useApiResource'

export default function TestimonialsPage() {
  const { data, status, message } = useApiResource(fetchTestimonials, fallbackTestimonials)
  return (<>
<section id="depoimentos" className="section-alt">
  <div className="container">
    <div className="section-head">
      <p className="kicker">Depoimentos</p>
      <h1>Quem já passou por aqui</h1>
    </div>
    <StatusNote status={status} message={message} hint="Exibindo os depoimentos do nosso catálogo." />
    {data.length === 0
      ? <p className="empty-note">Ainda não temos depoimentos publicados.</p>
      : <div className="testimonial-grid">
        {data.map(item => <div className="testimonial" key={item.id}>
          <p className="quote">&ldquo;{item.text}&rdquo;</p>
          <p className="who">&mdash; {item.author}</p>
        </div>)}
      </div>}
  </div>
</section>

  </>)
}