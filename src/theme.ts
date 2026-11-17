// src/theme.ts
//
// Tema do MUI (biblioteca de componentes) configurado com a MESMA paleta
// que já existe em `src/styles/base.css` (--wine, --gold, --ivory, --ink).
// Assim os componentes prontos da biblioteca (Dialog, Card, Button...)
// saem da caixa com a cara do site, em vez do azul padrão do Material UI.
//
// Isso é usado em `main.tsx`, dentro de um <ThemeProvider>, que é o jeito
// do MUI aplicar esse tema a todos os componentes da aplicação de uma vez.
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#7C2D42' }, // --wine
    secondary: { main: '#B4863E' }, // --gold
    background: { default: '#FBF6EE' }, // --ivory
    text: { primary: '#2A1B22' }, // --ink
  },
  typography: {
    // Mesma fonte de corpo de texto usada no restante do site (index.css
    // já carrega a fonte "Manrope" pelo Google Fonts no index.html).
    fontFamily: "'Manrope', sans-serif",
  },
  shape: {
    borderRadius: 14, // cantos arredondados, combinando com os cards do site
  },
})
