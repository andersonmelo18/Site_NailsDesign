export const site = {
  "name": "Nails Academy",
  "whatsapp": "5583991236614",
  "address": "Rua Siqueira Campos, 57",
  "city": "Cabedelo - PB",
  "hours": "Segunda a sábado · 9h às 19h",
  "coordinates": [
    -6.975142976463658,
    -34.83464040025463
  ],
  "pages": [
    {
      "path": "/",
      "label": "Início",
      "title": "Manicure e Nail Art em Cabedelo",
      "description": "Manicure, esmaltação em gel e nail art personalizada no Nails Academy Studio de Unhas, em Cabedelo. Conheça o studio e agende pelo WhatsApp."
    },
    {
      "path": "/sobre",
      "label": "Sobre",
      "title": "Sobre o studio",
      "description": "Conheça o cuidado, a higiene e o atendimento individual do Nails Academy Studio de Unhas."
    },
    {
      "path": "/servicos",
      "label": "Serviços",
      "title": "Serviços e valores",
      "description": "Confira os serviços e valores de manicure, esmaltação em gel, alongamento em fibra, spa das mãos e nail art."
    },
    {
      "path": "/cores",
      "label": "Cores",
      "title": "Galeria de cores",
      "description": "Explore os tons de esmalte do Nails Academy e escolha a cor do seu próximo atendimento."
    },
    {
      "path": "/estilos",
      "label": "Estilos",
      "title": "Formatos de unhas",
      "description": "Conheça os formatos amendoada, stiletto e bailarina e escolha o estilo das suas unhas."
    },
    {
      "path": "/depoimentos",
      "label": "Depoimentos",
      "title": "Depoimentos",
      "description": "Leia os depoimentos apresentados pelo Nails Academy Studio de Unhas."
    },
    {
      "path": "/localizacao",
      "label": "Localização",
      "title": "Localização e horários",
      "description": "Veja o endereço e os horários do Nails Academy em Cabedelo, Paraíba, e trace sua rota até o studio."
    },
    {
      "path": "/agendamento",
      "label": "Agendamento",
      "title": "Agende seu horário",
      "description": "Fale com o Nails Academy pelo WhatsApp para consultar a disponibilidade e combinar seu atendimento."
    }
  ]
} as const

export const whatsappUrl = (message?: string) => `https://wa.me/${site.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${site.coordinates.join(',')}`
export const imageUrl = (file: string) => `${import.meta.env.BASE_URL}images/${file}`

export const resolveImage = (file?: string | null): string => {
  const value = file?.trim() ?? ''
  if (value.length === 0) return ''
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('/') || value.startsWith('data:')) return value
  return imageUrl(value)
}
