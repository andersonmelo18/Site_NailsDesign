import { useEffect, useRef, useState } from 'react'
import type { NailOption } from '../data/catalog'
import { resolveImage, whatsappUrl } from '../data/site'

export default function NailModal({ item, onClose }: { item: NailOption; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [imageFailed, setImageFailed] = useState(false)
  const isShape = item.kind === 'formato'
  const message = `Olá! Vi ${isShape ? 'o formato' : 'o tom'} "${item.name}" no site e quero agendar ${isShape ? 'nesse estilo' : 'com esse esmalte'}.`
  const image = resolveImage(item.image)
  const showImage = image.length > 0 && !imageFailed
  useEffect(() => {
    const element = dialog.current
    const previousFocus = document.activeElement
    element?.showModal()
    document.body.classList.add('modal-open')
    return () => {
      element?.close()
      document.body.classList.remove('modal-open')
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [])
  return <dialog ref={dialog} id="colorModal" className="gallery-dialog" data-kind={item.kind} aria-labelledby="modalTitle" aria-describedby="modalDesc" onCancel={event => { event.preventDefault(); onClose() }} onClick={event => {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose()
  }}>
    <button className="modal-close" type="button" aria-label="Fechar" autoFocus onClick={onClose}>&times;</button>
    <div className={showImage ? 'modal-photo' : 'modal-photo modal-photo-placeholder'}>
      {showImage
        ? <img src={image} alt={`${isShape ? 'Formato' : 'Esmalte'} ${item.name}`} onError={() => setImageFailed(true)} />
        : isShape
          ? <div className={`shape ${item.shapeClass ?? ''}`} aria-hidden="true" />
          : <div className="modal-swatch" style={{ background: item.gradient ?? 'var(--blush)' }}>Amostra de cor</div>}
    </div>
    <div className="modal-body"><h2 id="modalTitle">{item.name}</h2><p className="modal-desc" id="modalDesc">{item.description}</p><div className="modal-actions"><a className="btn-primary" href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">{isShape ? 'Quero esse formato' : 'Quero esse tom'}</a></div></div>
  </dialog>
}