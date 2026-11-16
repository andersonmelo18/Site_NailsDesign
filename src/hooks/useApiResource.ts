import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../api/client'

export type LoadStatus = 'loading' | 'ready' | 'error'

export interface ApiResource<T> {
  data: T
  status: LoadStatus
  error: unknown
  message: string | null
  reload: () => void
}

export interface AdminResource<T> {
  items: T[]
  status: LoadStatus
  error: unknown
  message: string | null
  reload: () => void
}

function useResource<T>(load: () => Promise<T>, fallback: T): ApiResource<T> {
  const [data, setData] = useState<T>(fallback)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState<unknown>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    load()
      .then(result => {
        if (!active) return
        setData(result)
        setError(null)
        setStatus('ready')
      })
      .catch((cause: unknown) => {
        if (!active) return
        setError(cause)
        setStatus('error')
      })
    return () => {
      active = false
    }
  }, [load, version])

  const reload = useCallback(() => {
    setStatus('loading')
    setVersion(value => value + 1)
  }, [])

  return { data, status, error, message: error === null ? null : getErrorMessage(error), reload }
}

export function useApiResource<T>(load: () => Promise<T>, fallback: T): ApiResource<T> {
  return useResource(load, fallback)
}

export function useAdminResource<T>(load: () => Promise<T[]>): AdminResource<T> {
  const resource = useResource<T[]>(load, [])
  return { items: resource.data, status: resource.status, error: resource.error, message: resource.message, reload: resource.reload }
}