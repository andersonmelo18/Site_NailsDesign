import type {
  Booking,
  BookingInput,
  BookingReceipt,
  BookingStatus,
  Color,
  ColorInput,
  Contact,
  ContactInput,
  ContactReceipt,
  Health,
  Service,
  ServiceInput,
  Style,
  StyleInput,
  Testimonial,
  TestimonialInput,
} from './types'

const TOKEN_KEY = 'nails-academy-admin-token'

const configuredBase = import.meta.env.VITE_API_URL

export const API_BASE_URL = (typeof configuredBase === 'string' && configuredBase.trim().length > 0
  ? configuredBase.trim()
  : '/api'
).replace(/\/+$/, '')

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
  signal?: AbortSignal
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readErrorMessage(payload: unknown, status: number): string {
  if (isRecord(payload) && typeof payload.error === 'string' && payload.error.trim().length > 0) {
    return payload.error
  }
  if (status === 401) return 'Acesso não autorizado. Confira o token do painel.'
  if (status === 404) return 'Registro não encontrado.'
  return `Não foi possível concluir a operação (erro ${status}).`
}

export function getErrorMessage(error: unknown, fallback = 'Não foi possível concluir a operação.'): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error && error.message.trim().length > 0) return error.message
  return fallback
}

export function getAdminToken(): string | null {
  try {
    return window.sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function storeAdminToken(token: string): void {
  window.sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearAdminToken(): void {
  window.sessionStorage.removeItem(TOKEN_KEY)
}

async function send(path: string, options: RequestOptions = {}): Promise<Response> {
  const { body, auth = false, method, signal } = options
  const headers = new Headers({ Accept: 'application/json' })
  if (body !== undefined) headers.set('Content-Type', 'application/json')
  if (auth) {
    const token = getAdminToken()
    if (!token) throw new ApiError(401, 'Entre no painel para continuar.')
    headers.set('Authorization', `Bearer ${token}`)
  }
  try {
    return await fetch(`${API_BASE_URL}${path}`, {
      method: method ?? (body === undefined ? 'GET' : 'POST'),
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor. Confira a conexão e tente novamente.')
  }
}

async function readPayload(response: Response): Promise<unknown> {
  const raw = await response.text()
  if (raw.length === 0) return null
  try {
    return JSON.parse(raw) as unknown
  } catch {
    return raw
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await send(path, options)
  if (!response.ok) {
    const payload = await readPayload(response)
    throw new ApiError(response.status, readErrorMessage(payload, response.status))
  }
  if (!(response.headers.get('content-type') ?? '').includes('json')) {
    throw new ApiError(
      response.status,
      'Resposta inesperada do servidor. Confira se a API está no ar e se VITE_API_URL aponta para ela.',
    )
  }
  const payload = await readPayload(response)
  if (!Array.isArray(payload) && !isRecord(payload)) {
    throw new ApiError(response.status, 'Resposta inesperada do servidor.')
  }
  return payload as T
}

async function requestVoid(path: string, options: RequestOptions = {}): Promise<void> {
  const response = await send(path, options)
  if (!response.ok) {
    const payload = await readPayload(response)
    throw new ApiError(response.status, readErrorMessage(payload, response.status))
  }
}

export function fetchHealth(): Promise<Health> {
  return request<Health>('/health')
}

export function fetchServices(): Promise<Service[]> {
  return request<Service[]>('/services')
}

export function fetchColors(): Promise<Color[]> {
  return request<Color[]>('/colors')
}

export function fetchStyles(): Promise<Style[]> {
  return request<Style[]>('/styles')
}

export function fetchTestimonials(): Promise<Testimonial[]> {
  return request<Testimonial[]>('/testimonials')
}

export function createBooking(input: BookingInput): Promise<BookingReceipt> {
  return request<BookingReceipt>('/bookings', { body: input })
}

export function createContact(input: ContactInput): Promise<ContactReceipt> {
  return request<ContactReceipt>('/contacts', { body: input })
}

export function fetchAdminBookings(): Promise<Booking[]> {
  return request<Booking[]>('/admin/bookings', { auth: true })
}

export function updateBookingStatus(id: number, status: BookingStatus): Promise<Booking> {
  return request<Booking>(`/admin/bookings/${id}`, { method: 'PATCH', body: { status }, auth: true })
}

export function fetchAdminContacts(): Promise<Contact[]> {
  return request<Contact[]>('/admin/contacts', { auth: true })
}

export interface AdminContentApi<TEntity, TInput> {
  list: () => Promise<TEntity[]>
  create: (input: TInput) => Promise<TEntity>
  update: (id: number, input: TInput) => Promise<TEntity>
  remove: (id: number) => Promise<void>
}

export const adminContentApi: {
  services: AdminContentApi<Service, ServiceInput>
  colors: AdminContentApi<Color, ColorInput>
  styles: AdminContentApi<Style, StyleInput>
  testimonials: AdminContentApi<Testimonial, TestimonialInput>
} = {
  services: {
    list: () => request<Service[]>('/admin/services', { auth: true }),
    create: input => request<Service>('/admin/services', { body: input, auth: true }),
    update: (id, input) => request<Service>(`/admin/services/${id}`, { method: 'PATCH', body: input, auth: true }),
    remove: id => requestVoid(`/admin/services/${id}`, { method: 'DELETE', auth: true }),
  },
  colors: {
    list: () => request<Color[]>('/admin/colors', { auth: true }),
    create: input => request<Color>('/admin/colors', { body: input, auth: true }),
    update: (id, input) => request<Color>(`/admin/colors/${id}`, { method: 'PATCH', body: input, auth: true }),
    remove: id => requestVoid(`/admin/colors/${id}`, { method: 'DELETE', auth: true }),
  },
  styles: {
    list: () => request<Style[]>('/admin/styles', { auth: true }),
    create: input => request<Style>('/admin/styles', { body: input, auth: true }),
    update: (id, input) => request<Style>(`/admin/styles/${id}`, { method: 'PATCH', body: input, auth: true }),
    remove: id => requestVoid(`/admin/styles/${id}`, { method: 'DELETE', auth: true }),
  },
  testimonials: {
    list: () => request<Testimonial[]>('/admin/testimonials', { auth: true }),
    create: input => request<Testimonial>('/admin/testimonials', { body: input, auth: true }),
    update: (id, input) => request<Testimonial>(`/admin/testimonials/${id}`, { method: 'PATCH', body: input, auth: true }),
    remove: id => requestVoid(`/admin/testimonials/${id}`, { method: 'DELETE', auth: true }),
  },
}