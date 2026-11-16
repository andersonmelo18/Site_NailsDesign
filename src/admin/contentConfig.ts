import { adminContentApi } from '../api/client'
import type { Color, ColorInput, Service, ServiceInput, Style, StyleInput, Testimonial, TestimonialInput } from '../api/types'
import type { ContentKind } from '../api/types'

export type ContentItem = Service | Color | Style | Testimonial

export type ContentInput = ServiceInput | ColorInput | StyleInput | TestimonialInput

export interface ContentField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number'
  required?: boolean
  placeholder?: string
  wide?: boolean
}

export interface ContentKindConfig {
  label: string
  singular: string
  fields: ContentField[]
  title: (item: ContentItem) => string
  subtitle: (item: ContentItem) => string
  list: () => Promise<ContentItem[]>
  create: (input: ContentInput) => Promise<ContentItem>
  update: (id: number, input: ContentInput) => Promise<ContentItem>
  remove: (id: number) => Promise<void>
  toValues: (item: ContentItem) => Record<string, string>
  fromValues: (values: Record<string, string>) => ContentInput
}

export const contentKinds: ContentKind[] = ['services', 'colors', 'styles', 'testimonials']

const valueOf = (values: Record<string, string>, key: string): string => (values[key] ?? '').trim()

export const contentConfig: Record<ContentKind, ContentKindConfig> = {
  services: {
    label: 'Serviços',
    singular: 'Serviço',
    fields: [
      { name: 'name', label: 'Nome', type: 'text', required: true, placeholder: 'Manicure tradicional' },
      { name: 'price', label: 'Preço', type: 'text', required: true, placeholder: 'R$ 35' },
      { name: 'duration', label: 'Duração (min)', type: 'number', required: true, placeholder: '45' },
      { name: 'description', label: 'Descrição', type: 'textarea', required: true, wide: true },
    ],
    title: item => (item as Service).name,
    subtitle: item => {
      const service = item as Service
      return `${service.price} · ${service.duration} min`
    },
    list: () => adminContentApi.services.list(),
    create: input => adminContentApi.services.create(input as ServiceInput),
    update: (id, input) => adminContentApi.services.update(id, input as ServiceInput),
    remove: id => adminContentApi.services.remove(id),
    toValues: item => {
      const service = item as Service
      return { name: service.name, price: service.price, duration: String(service.duration), description: service.description }
    },
    fromValues: values => ({
      name: valueOf(values, 'name'),
      price: valueOf(values, 'price'),
      duration: Number(valueOf(values, 'duration')),
      description: valueOf(values, 'description'),
    }),
  },
  colors: {
    label: 'Cores',
    singular: 'Cor',
    fields: [
      { name: 'name', label: 'Nome', type: 'text', required: true, placeholder: 'Vinho Profundo' },
      { name: 'hex', label: 'Hexadecimal', type: 'text', required: true, placeholder: '#7C2D42' },
      { name: 'description', label: 'Descrição', type: 'textarea', required: true, wide: true },
      { name: 'image', label: 'Imagem (opcional)', type: 'text', placeholder: 'nailcolor_vinho.webp', wide: true },
    ],
    title: item => (item as Color).name,
    subtitle: item => (item as Color).hex,
    list: () => adminContentApi.colors.list(),
    create: input => adminContentApi.colors.create(input as ColorInput),
    update: (id, input) => adminContentApi.colors.update(id, input as ColorInput),
    remove: id => adminContentApi.colors.remove(id),
    toValues: item => {
      const color = item as Color
      return { name: color.name, hex: color.hex, description: color.description, image: color.image ?? '' }
    },
    fromValues: values => ({
      name: valueOf(values, 'name'),
      hex: valueOf(values, 'hex').toUpperCase(),
      description: valueOf(values, 'description'),
      image: valueOf(values, 'image').length > 0 ? valueOf(values, 'image') : null,
    }),
  },
  styles: {
    label: 'Estilos',
    singular: 'Estilo',
    fields: [
      { name: 'name', label: 'Nome', type: 'text', required: true, placeholder: 'Amendoada' },
      { name: 'description', label: 'Descrição', type: 'textarea', required: true, wide: true },
      { name: 'image', label: 'Imagem (opcional)', type: 'text', placeholder: 'amendoada.png', wide: true },
    ],
    title: item => (item as Style).name,
    subtitle: item => (item as Style).image ?? 'sem imagem',
    list: () => adminContentApi.styles.list(),
    create: input => adminContentApi.styles.create(input as StyleInput),
    update: (id, input) => adminContentApi.styles.update(id, input as StyleInput),
    remove: id => adminContentApi.styles.remove(id),
    toValues: item => {
      const style = item as Style
      return { name: style.name, description: style.description, image: style.image ?? '' }
    },
    fromValues: values => ({
      name: valueOf(values, 'name'),
      description: valueOf(values, 'description'),
      image: valueOf(values, 'image').length > 0 ? valueOf(values, 'image') : null,
    }),
  },
  testimonials: {
    label: 'Depoimentos',
    singular: 'Depoimento',
    fields: [
      { name: 'author', label: 'Nome da cliente', type: 'text', required: true, placeholder: 'Renata A.' },
      { name: 'rating', label: 'Nota (1 a 5)', type: 'number', required: true, placeholder: '5' },
      { name: 'text', label: 'Depoimento', type: 'textarea', required: true, wide: true },
    ],
    title: item => (item as Testimonial).author,
    subtitle: item => {
      const testimonial = item as Testimonial
      return `Nota ${testimonial.rating}/5`
    },
    list: () => adminContentApi.testimonials.list(),
    create: input => adminContentApi.testimonials.create(input as TestimonialInput),
    update: (id, input) => adminContentApi.testimonials.update(id, input as TestimonialInput),
    remove: id => adminContentApi.testimonials.remove(id),
    toValues: item => {
      const testimonial = item as Testimonial
      return { author: testimonial.author, text: testimonial.text, rating: String(testimonial.rating) }
    },
    fromValues: values => ({
      author: valueOf(values, 'author'),
      text: valueOf(values, 'text'),
      rating: Number(valueOf(values, 'rating')),
    }),
  },
}