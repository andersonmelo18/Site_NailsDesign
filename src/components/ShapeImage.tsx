import { useState } from 'react'
import type { NailOption } from '../data/catalog'
import { resolveImage } from '../data/site'

export default function ShapeImage({ item }: { item: NailOption }) {
  const [failed, setFailed] = useState(false)
  const src = resolveImage(item.image)
  if (src.length === 0 || failed) {
    return <div className={`shape ${item.shapeClass ?? ''}`} aria-hidden="true" />
  }
  return <img className={`shape ${item.shapeClass ?? ''}`} src={src} alt={`Unha no formato ${item.name}`} onError={() => setFailed(true)} />
}