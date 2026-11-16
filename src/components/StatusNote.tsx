import type { LoadStatus } from '../hooks/useApiResource'

export default function StatusNote({ status, message, hint }: { status: LoadStatus; message: string | null; hint?: string }) {
  if (status === 'loading') return <p className="status-note" role="status">Carregando…</p>
  if (status === 'error') {
    const detail = message ?? 'Não foi possível carregar os dados.'
    return <p className="status-note status-note-error" role="status">{hint ? `${detail} ${hint}` : detail}</p>
  }
  return null
}