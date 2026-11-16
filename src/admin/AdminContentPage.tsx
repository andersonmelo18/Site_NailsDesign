import { useState } from 'react'
import type { FormEvent } from 'react'
import { getErrorMessage } from '../api/client'
import type { ContentKind } from '../api/types'
import { useAdminResource } from '../hooks/useApiResource'
import { contentConfig, contentKinds } from './contentConfig'
import type { ContentItem } from './contentConfig'
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect'
import '../styles/pages/admin.css'

interface EditorState {
  id: number | null
  values: Record<string, string>
}

const emptyValues = (fields: { name: string }[]): Record<string, string> =>
  Object.fromEntries(fields.map(field => [field.name, '']))

export default function AdminContentPage() {
  const [kind, setKind] = useState<ContentKind>('services')
  const config = contentConfig[kind]
  const { items, status, message, error, reload } = useAdminResource(config.list)
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  useUnauthorizedRedirect(error)

  const selectKind = (next: ContentKind) => {
    if (next === kind) return
    setKind(next)
    setEditor(null)
    setFormError(null)
    setNotice(null)
  }

  const openNew = () => {
    setEditor({ id: null, values: emptyValues(config.fields) })
    setFormError(null)
    setNotice(null)
  }

  const openEdit = (item: ContentItem) => {
    setEditor({ id: item.id, values: config.toValues(item) })
    setFormError(null)
    setNotice(null)
  }

  const updateField = (name: string, value: string) => {
    setEditor(current => current === null ? current : { ...current, values: { ...current.values, [name]: value } })
  }

  const validate = (values: Record<string, string>): string | null => {
    for (const field of config.fields) {
      const value = (values[field.name] ?? '').trim()
      if (field.required && value.length === 0) return `Preencha o campo ${field.label}.`
    }
    if (kind === 'colors' && !/^#[0-9a-fA-F]{6}$/.test((values.hex ?? '').trim())) {
      return 'Informe a cor no formato #RRGGBB, por exemplo #7C2D42.'
    }
    if (kind === 'services') {
      const duration = Number(values.duration)
      if (!Number.isInteger(duration) || duration <= 0) return 'A duração deve ser um número inteiro maior que zero.'
    }
    if (kind === 'testimonials') {
      const rating = Number(values.rating)
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'A nota deve ser um número inteiro de 1 a 5.'
    }
    return null
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const current = editor
    if (current === null || saving) return
    const problem = validate(current.values)
    if (problem !== null) {
      setFormError(problem)
      return
    }
    setSaving(true)
    setFormError(null)
    setNotice(null)
    try {
      const input = config.fromValues(current.values)
      if (current.id === null) {
        await config.create(input)
        setNotice(`${config.singular} cadastrado com sucesso.`)
      } else {
        await config.update(current.id, input)
        setNotice('Alterações salvas.')
      }
      setEditor(null)
      reload()
    } catch (cause) {
      setFormError(getErrorMessage(cause, 'Não foi possível salvar.'))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item: ContentItem) => {
    if (editor !== null || saving) return
    if (!window.confirm(`Excluir "${config.title(item)}"? Esta ação não pode ser desfeita.`)) return
    setSaving(true)
    setNotice(null)
    setFormError(null)
    try {
      await config.remove(item.id)
      setNotice('Registro excluído.')
      reload()
    } catch (cause) {
      setFormError(getErrorMessage(cause, 'Não foi possível excluir.'))
    } finally {
      setSaving(false)
    }
  }

  return <section className="admin-panel">
    <div className="admin-panel-head">
      <div>
        <h1>Conteúdo</h1>
        <p className="section-sub">Gerencie os dados que aparecem nas páginas do site.</p>
      </div>
      <button className="btn-primary" type="button" onClick={openNew} disabled={editor !== null}>Novo {config.singular.toLowerCase()}</button>
    </div>

    <div className="admin-tabs" role="group" aria-label="Tipo de conteúdo">
      {contentKinds.map(value => <button key={value} className="admin-tab" type="button" aria-pressed={value === kind} onClick={() => selectKind(value)}>{contentConfig[value].label}</button>)}
    </div>

    {editor !== null && <form className="admin-form" onSubmit={event => { void submit(event) }}>
      <h2>{editor.id === null ? `Novo ${config.singular.toLowerCase()}` : `Editar ${config.singular.toLowerCase()}`}</h2>
      <div className="form-grid">
        {config.fields.map(field => <div className={`form-field${field.wide ? ' field-wide' : ''}`} key={field.name}>
          <label htmlFor={`content-${field.name}`}>{field.label}</label>
          {field.type === 'textarea'
            ? <textarea id={`content-${field.name}`} rows={4} required={field.required} value={editor.values[field.name] ?? ''} placeholder={field.placeholder} onChange={event => updateField(field.name, event.target.value)} />
            : <input id={`content-${field.name}`} type={field.type} required={field.required} value={editor.values[field.name] ?? ''} placeholder={field.placeholder} min={field.type === 'number' ? 1 : undefined} step={field.type === 'number' ? 1 : undefined} onChange={event => updateField(field.name, event.target.value)} />}
        </div>)}
      </div>
      {formError && <p className="form-feedback form-feedback-error" role="alert">{formError}</p>}
      <div className="form-actions">
        <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
        <button className="btn-secondary" type="button" disabled={saving} onClick={() => { setEditor(null); setFormError(null) }}>Cancelar</button>
      </div>
    </form>}

    {notice && <p className="form-feedback form-feedback-success" role="status">{notice}</p>}
    {status === 'loading' && <p className="status-note" role="status">Carregando…</p>}
    {status === 'error' && <p className="status-note status-note-error" role="status">{message}</p>}
    {status === 'ready' && items.length === 0 && <p className="admin-empty">Nenhum registro cadastrado.</p>}
    {status === 'ready' && items.length > 0 && <ul className="admin-list">
      {items.map(item => <li className="admin-row" key={item.id}>
        <div>
          <strong>{config.title(item)}</strong>
          <small>{config.subtitle(item)}</small>
        </div>
        <div className="admin-actions">
          <button className="btn-secondary" type="button" onClick={() => openEdit(item)} disabled={saving}>Editar</button>
          <button className="btn-secondary" type="button" onClick={() => { void remove(item) }} disabled={saving}>Excluir</button>
        </div>
      </li>)}
    </ul>}
  </section>
}