// src/components/NailModal.tsx
//
// Modal reescrito com componentes do MUI (biblioteca de componentes):
// Dialog, DialogContent, IconButton e Button. Antes este arquivo controlava
// manualmente o <dialog> nativo (showModal/close, foco anterior, clique fora
// etc. — tudo em useEffect). O Dialog do MUI já resolve essa parte
// (abre/fecha, prende o foco dentro do modal, fecha com Esc e devolve o
// foco ao elemento que abriu), então o componente ficou mais enxuto e mais
// fácil de explicar na apresentação.
//
// Continua recebendo as mesmas props de antes (`item`, `onClose`) e
// continua sendo usado nas mesmas páginas (via NailGallery, em ColorsPage,
// StylesPage e na galeria da Home) — por isso ele conta como um componente
// da biblioteca "utilizado em diferentes partes da aplicação".
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import type { NailOption } from '../data/catalog'
import { imageUrl, whatsappUrl } from '../data/site'

export default function NailModal({ item, onClose }: { item: NailOption; onClose: () => void }) {
  const [imageFailed, setImageFailed] = useState(false)
  const isShape = item.kind === 'formato'
  const message = `Olá! Vi ${isShape ? 'o formato' : 'o tom'} "${item.name}" no site e quero agendar ${isShape ? 'nesse estilo' : 'com esse esmalte'}.`

  return (
    // `open` sempre true aqui porque o componente só é montado quando há um
    // item selecionado (ver NailGallery.tsx: `{selected && <NailModal ... />}`).
    // `onClose` cobre tanto o clique fora do modal quanto a tecla Esc.
    <Dialog open onClose={onClose} aria-labelledby="modalTitle" maxWidth="xs" fullWidth>
      <IconButton
        aria-label="Fechar"
        onClick={onClose}
        autoFocus
        sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>

      {item.image && !imageFailed ? (
        <img
          src={imageUrl(item.image)}
          alt={`${isShape ? 'Formato' : 'Esmalte'} ${item.name}`}
          onError={() => setImageFailed(true)}
          style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{ width: '100%', aspectRatio: '4 / 3', display: 'grid', placeItems: 'center', background: item.gradient ?? 'var(--blush)', color: '#fff' }}
        >
          {imageFailed ? 'Imagem indisponível' : 'Amostra de cor'}
        </div>
      )}

      <DialogContent>
        <Typography id="modalTitle" variant="h5" component="h2" gutterBottom>
          {item.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {item.description}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 1 }}
        >
          {isShape ? 'Quero esse formato' : 'Quero esse tom'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
