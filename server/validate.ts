export interface BookingInput {
  name: string
  phone: string
  service: string
  date: string
  time: string
  notes: string | null
}

export interface ContactInput {
  name: string
  phone: string
  message: string
}

export interface ServiceInput {
  name: string
  description: string
  price: string
  duration: number
}

export interface ColorInput {
  name: string
  hex: string
  description: string
  image: string | null
}

export interface StyleInput {
  name: string
  description: string
  image: string | null
}

export interface TestimonialInput {
  author: string
  text: string
  rating: number
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function isDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function isTime(value: unknown): value is string {
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)
}

export function isImage(value: unknown): value is string | null {
  return value === null || isNonEmptyString(value)
}

export function parseId(raw: string): number | null {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

export function parseBooking(body: unknown): BookingInput | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null
  const b = body as Record<string, unknown>
  if (
    !isNonEmptyString(b.name) ||
    !isNonEmptyString(b.phone) ||
    !isNonEmptyString(b.service) ||
    !isDate(b.date) ||
    !isTime(b.time)
  ) {
    return null
  }
  if (b.notes !== undefined && b.notes !== null && !isNonEmptyString(b.notes)) return null
  return {
    name: b.name,
    phone: b.phone,
    service: b.service,
    date: b.date,
    time: b.time,
    notes: isNonEmptyString(b.notes) ? b.notes : null,
  }
}

export function parseContact(body: unknown): ContactInput | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null
  const c = body as Record<string, unknown>
  if (!isNonEmptyString(c.name) || !isNonEmptyString(c.phone) || !isNonEmptyString(c.message)) {
    return null
  }
  return { name: c.name, phone: c.phone, message: c.message }
}

export function parseService(body: unknown): ServiceInput | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null
  const s = body as Record<string, unknown>
  if (
    !isNonEmptyString(s.name) ||
    !isNonEmptyString(s.description) ||
    !isNonEmptyString(s.price) ||
    typeof s.duration !== 'number' ||
    !Number.isInteger(s.duration) ||
    s.duration <= 0
  ) {
    return null
  }
  return { name: s.name, description: s.description, price: s.price, duration: s.duration }
}

export function parseColor(body: unknown): ColorInput | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null
  const c = body as Record<string, unknown>
  if (!isNonEmptyString(c.name) || !isHexColor(c.hex) || !isNonEmptyString(c.description) || !isImage(c.image)) {
    return null
  }
  return { name: c.name, hex: c.hex, description: c.description, image: c.image }
}

export function parseStyle(body: unknown): StyleInput | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null
  const s = body as Record<string, unknown>
  if (!isNonEmptyString(s.name) || !isNonEmptyString(s.description) || !isImage(s.image)) {
    return null
  }
  return { name: s.name, description: s.description, image: s.image }
}

export function parseTestimonial(body: unknown): TestimonialInput | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null
  const t = body as Record<string, unknown>
  if (
    !isNonEmptyString(t.author) ||
    !isNonEmptyString(t.text) ||
    typeof t.rating !== 'number' ||
    !Number.isInteger(t.rating) ||
    t.rating < 1 ||
    t.rating > 5
  ) {
    return null
  }
  return { author: t.author, text: t.text, rating: t.rating }
}
