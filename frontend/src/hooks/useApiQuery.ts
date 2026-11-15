import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '../api/errors'

export type ApiQueryResult<T> = {
  data: T | null
  loading: boolean
  error: ApiError | null
  refetch: () => void
}

/**
 * Runs one API request and tracks its lifecycle.
 *
 * `deps` works like a `useEffect` dependency list: when any value changes the
 * request runs again. `refetch()` re-runs it after a mutation.
 */
export function useApiQuery<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[] = [],
): ApiQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [version, setVersion] = useState(0)

  // Keep the latest closure without making it a dependency.
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    fetcherRef
      .current()
      .then((result) => {
        if (active) setData(result)
      })
      .catch((caught: unknown) => {
        if (!active) return
        setError(
          caught instanceof ApiError
            ? caught
            : new ApiError(0, {
                code: 'server_error',
                message: 'Terjadi kesalahan tak terduga.',
              }),
        )
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      // Ignore a response that arrived after the filters changed.
      active = false
    }
  }, [...deps, version])

  const refetch = useCallback(() => setVersion((value) => value + 1), [])

  return { data, loading, error, refetch }
}
