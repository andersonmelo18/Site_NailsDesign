export interface NailOption {
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
