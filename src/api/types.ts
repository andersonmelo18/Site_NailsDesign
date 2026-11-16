export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type ContentKind = 'services' | 'colors' | 'styles' | 'testimonials'

export interface Health {
  ok: boolean
  version: string
}

export interface Service {
  id: number
  name: string
  description: string
  price: string
  duration: number
}

export interface Color {
  id: number
  name: string
  hex: string
  description: string
  image: string | null
}

export interface Style {
  id: number
  name: string
  description: string
  image: string | null
}

export interface Testimonial {
  id: number
  author: string
  text: string
  rating: number
}

export interface Booking {
  id: number
  name: string
  phone: string
  service: string
  date: string
  time: string
  notes: string | null
  status: BookingStatus
  createdAt: string
}

export interface BookingInput {
  name: string
  phone: string
  service: string
  date: string
  time: string
  notes?: string
}

export interface BookingReceipt {
  id: number
  status: BookingStatus
  createdAt: string
}

export interface Contact {
  id: number
  name: string
  phone: string
  message: string
  createdAt: string
}

export interface ContactInput {
  name: string
  phone: string
  message: string
}

export interface ContactReceipt {
  id: number
  createdAt: string
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