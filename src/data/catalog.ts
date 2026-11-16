import type { Service, Testimonial } from '../api/types'

export interface NailOption {
  id?: number
  name: string
  description: string
  kind: 'cor' | 'formato'
  image?: string
  gradient?: string
  shapeClass?: string
}

export const colors: NailOption[] = [
  {
    "name": "Vinho Profundo",
    "description": "Tom intenso e sofisticado, perfeito pra quem quer um acabamento marcante sem perder a elegância.",
    "kind": "cor",
    "image": "nailcolor_vinho.webp",
    "gradient": "linear-gradient(160deg,#8C3A50,#4E1B2B)"
  },
  {
    "name": "Nude Cerâmica",
    "description": "Clássico atemporal, combina com qualquer produção e disfarça o crescimento entre as manutenções.",
    "kind": "cor",
    "gradient": "linear-gradient(160deg,#E4C9A6,#C79A4E)"
  },
  {
    "name": "Dourado Fosco",
    "description": "Um brilho contido, ótimo pra ocasiões especiais sem parecer exagerado no dia a dia.",
    "kind": "cor",
    "gradient": "linear-gradient(160deg,#C79A4E,#8A6428)"
  },
  {
    "name": "Marfim Perolado",
    "description": "Leve e delicado, com um leve efeito perolado que aparece sob luz natural.",
    "kind": "cor",
    "gradient": "linear-gradient(160deg,#F3E7D6,#E4C9A6)"
  },
  {
    "name": "Borgonha Metálico",
    "description": "Vinho com um toque metalizado — pedido certo pra quem gosta de um destaque a mais.",
    "kind": "cor",
    "gradient": "linear-gradient(160deg,#A14A5E,#6E2135)"
  },
  {
    "name": "Café Escuro",
    "description": "Neutro e versátil, com uma profundidade que fica ótima em unhas curtas ou compridas.",
    "kind": "cor",
    "image": "nailcolor_cafe.webp",
    "gradient": "linear-gradient(160deg,#5C2436,#2A1B22)"
  }
]

export const shapes: NailOption[] = [
  {
    "name": "Amendoada",
    "description": "Ponta arredondada e afilada, lembrando uma amêndoa. Alonga visualmente os dedos e é resistente no dia a dia — o formato mais pedido de todos.",
    "kind": "formato",
    "image": "amendoada.png",
    "shapeClass": "shape-almond"
  },
  {
    "name": "Stiletto",
    "description": "Ponta fina e marcante, o formato mais ousado da cartela. Pede unhas mais compridas e um pouco mais de cuidado no dia a dia.",
    "kind": "formato",
    "image": "stiletto.png",
    "shapeClass": "shape-stiletto"
  },
  {
    "name": "Bailarina",
    "description": "Laterais retas e ponta reta, como uma sapatilha de ponta. Dá um ar moderno e alongado, sem a fragilidade da ponta fina.",
    "kind": "formato",
    "image": "bailarina.png",
    "shapeClass": "shape-ballerina"
  }
]

export const services: Service[] = [
  {
    id: 1,
    name: 'Manicure tradicional',
    description: 'Higienização, corte e lixamento com acabamento em esmalte tradicional.',
    price: 'R$ 35',
    duration: 45
  },
  {
    id: 2,
    name: 'Esmaltação em gel',
    description: 'Esmaltação em gel com longa duração e brilho uniforme por semanas.',
    price: 'R$ 60',
    duration: 60
  },
  {
    id: 3,
    name: 'Alongamento em fibra',
    description: 'Alongamento em fibra com resistência e visual natural.',
    price: 'R$ 120',
    duration: 90
  },
  {
    id: 4,
    name: 'Spa das mãos',
    description: 'Pele hidratada com esfoliação, massagem e hidratação profunda.',
    price: 'R$ 45',
    duration: 40
  },
  {
    id: 5,
    name: 'Nail art personalizada',
    description: 'Decoração sob medida: cores, adesivos e efeitos combinados com o seu estilo.',
    price: 'a partir de R$ 15',
    duration: 30
  }
]

export const testimonials: Testimonial[] = [
  {
    id: 1,
    author: 'Renata A.',
    text: 'Minhas unhas nunca duraram tanto tempo com o gel. Voltei porque o atendimento é calmo, sem correria.',
    rating: 5
  },
  {
    id: 2,
    author: 'Juliana M.',
    text: 'Marquei sem saber o que queria e saí com uma nail art que combinou exatamente com meu estilo.',
    rating: 5
  },
  {
    id: 3,
    author: 'Carla S.',
    text: 'Percebi a diferença na higiene logo na primeira vez. Hoje é o único lugar que confio pra fazer minhas unhas.',
    rating: 5
  }
]
