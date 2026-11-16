import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getAdminToken } from '../api/client'

export default function AdminGuard() {
  const location = useLocation()
  if (!getAdminToken()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}