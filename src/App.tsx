import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { site } from './data/site'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ColorsPage = lazy(() => import('./pages/ColorsPage'))
const StylesPage = lazy(() => import('./pages/StylesPage'))
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'))
const LocationPage = lazy(() => import('./pages/LocationPage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="sobre" element={<AboutPage />} />
      <Route path="servicos" element={<ServicesPage />} />
      <Route path="cores" element={<ColorsPage />} />
      <Route path="estilos" element={<StylesPage />} />
      <Route path="depoimentos" element={<TestimonialsPage />} />
      <Route path="localizacao" element={<LocationPage />} />
      <Route path="agendamento" element={<BookingPage />} />
      {site.pages.map(page => <Route key={page.path} path={page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`} element={<Navigate to={page.path} replace />} />)}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
}
