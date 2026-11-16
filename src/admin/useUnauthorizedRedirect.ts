import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, clearAdminToken } from '../api/client'

export function useUnauthorizedRedirect(error: unknown): void {
  const navigate = useNavigate()
  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      clearAdminToken()
      navigate('/admin/login', { replace: true })
    }
  }, [error, navigate])
}