import { useEffect, useRef, useState } from 'react'
import type { NailOption } from '../data/catalog'
import NailModal from './NailModal'
import ShapeImage from './ShapeImage'
import '../styles/pages/gallery.css'

export default function NailGallery({ items, carousel = false }: { items: NailOption[]; carousel?: boolean }) {
  const [selected, setSelected] = useState<NailOption | null>(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  const track = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const element = track.current
    if (!carousel || !element) return
    const update = () => setEdges({ start: element.scrollLeft <= 4, end: element.scrollLeft >= element.scrollWidth - element.clientWidth - 4 })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    element.addEventListener('scroll', update, { passive: true })
    update()
    return () => { observer.disconnect(); element.removeEventListener('scroll', update) }
  }, [carousel])

  const move = (direction: number) => {
    const element = track.current
    const card = element?.querySelector<HTMLElement>('.nail-card')
    if (!element || !card) return
    element.scrollBy({ left: direction * (card.offsetWidth + parseFloat(getComputedStyle(element).gap)), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  const close = () => { setSelected(null); trigger.current?.focus() }
  const keyFor = (item: NailOption, index: number) => String(item.id ?? `${item.name}-${index}`)
  return <>
    <div className={carousel ? 'carousel' : undefined}>
      {carousel && <button className="carousel-btn carousel-prev" type="button" disabled={edges.start} aria-label="Ver tons anteriores" onClick={() => move(-1)}>‹</button>}
      <div ref={track} className={carousel ? 'carousel-track' : 'shape-grid'} tabIndex={carousel ? 0 : undefined} role="group" aria-label={carousel ? 'Galeria de tons de esmalte' : 'Formatos de unhas'} onKeyDown={event => {
        if (!carousel || event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
        event.preventDefault()
        move(event.key === 'ArrowLeft' ? -1 : 1)
      }}>
        {items.map((item, index) => <button className="nail-card" key={keyFor(item, index)} type="button" aria-haspopup="dialog" onClick={event => { trigger.current = event.currentTarget; setSelected(item) }}>
          {item.kind === 'cor'
            ? <div className="nail-chip" style={{ background: item.gradient }} />
            : <ShapeImage item={item} />}
          <p>{item.name}</p><span className="see-more">Ver detalhes</span>
        </button>)}
      </div>
      {carousel && <button className="carousel-btn carousel-next" type="button" disabled={edges.end} aria-label="Ver mais tons" onClick={() => move(1)}>›</button>}
    </div>
    {carousel && <p className="carousel-hint">Arraste para o lado para ver todos os tons</p>}
    {selected && <NailModal key={selected.id ?? selected.name} item={selected} onClose={close} />}
  </>
}