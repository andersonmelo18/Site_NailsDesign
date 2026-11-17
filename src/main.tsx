import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// ThemeProvider: componente do MUI (biblioteca de componentes) que distribui
// um mesmo tema (cores, fontes, raio de borda) para todos os componentes MUI
// usados na aplicação, em qualquer página. O tema em si fica em src/theme.ts.
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
