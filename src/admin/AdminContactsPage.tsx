import { fetchAdminContacts } from '../api/client'
import { useAdminResource } from '../hooks/useApiResource'
import { formatDateTime } from '../utils/labels'
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect'
import '../styles/pages/admin.css'

export default function AdminContactsPage() {
  const { items, status, message, error, reload } = useAdminResource(fetchAdminContacts)
  useUnauthorizedRedirect(error)

  return <section className="admin-panel">
    <div className="admin-panel-head">
      <div>
        <h1>Contatos</h1>
        <p className="section-sub">Mensagens enviadas pelo formulário da página de localização.</p>
      </div>
      <button className="btn-secondary" type="button" onClick={reload}>Atualizar</button>
    </div>
    {status === 'loading' && <p className="status-note" role="status">Carregando…</p>}
    {status === 'error' && <p className="status-note status-note-error" role="status">{message}</p>}
    {status === 'ready' && items.length === 0 && <p className="admin-empty">Nenhuma mensagem recebida até agora.</p>}
    {status === 'ready' && items.length > 0 && <ul className="admin-list">
      {items.map(contact => <li className="admin-row" key={contact.id}>
        <div>
          <strong>{contact.name}</strong>
          <small>{contact.phone} · {formatDateTime(contact.createdAt)}</small>
          <p className="admin-message">{contact.message}</p>
        </div>
        <div className="admin-actions">
          <a className="btn-secondary" href={`tel:${contact.phone.replace(/\D/g, '')}`}>Ligar</a>
          <a className="btn-secondary" href={`https://wa.me/55${contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
      </li>)}
    </ul>}
  </section>
}