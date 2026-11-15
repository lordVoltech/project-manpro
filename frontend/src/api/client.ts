/**
 * HTTP transport for the API contract.
 *
 * Mode is chosen by VITE_API_MODE:
 * - "mock" (default): requests are resolved in-browser by src/api/mock.
 * - "live": requests go to VITE_API_BASE_URL (the PHP backend).
 *
 * Screens only import `api` and the types; they never know which mode is on.
 */
import { ApiError } from './errors'
import { handleMockRequest, type QueryParams } from './mock/handlers'
import type { ApiErrorBody } from './types'

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export type QueryInput = Record<
  string,
  string | number | boolean | null | undefined
>

export type ApiMode = 'mock' | 'live'

const env = import.meta.env
export const apiMode: ApiMode = env?.VITE_API_MODE === 'live' ? 'live' : 'mock'
const baseUrl = (env?.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '')

export type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  query?: QueryInput
  signal?: AbortSignal
}

function toQueryParams(query?: QueryInput): QueryParams {
  const params: QueryParams = {}
  if (!query) return params

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    params[key] = String(value)
  }

  return params
}

function buildUrl(path: string, query?: QueryInput): string {
  const search = new URLSearchParams(toQueryParams(query)).toString()
  return `${baseUrl}${path}${search ? `?${search}` : ''}`
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const method = options.method ?? 'GET'

  if (apiMode === 'mock') {
    return handleMockRequest<T>(method, path, toQueryParams(options.query), options.body)
  }

  const hasBody = options.body !== undefined
  let response: Response

  try {
    response = await fetch(buildUrl(path, options.query), {
      method,
      headers: {
        Accept: 'application/json',
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      },
      body: hasBody ? JSON.stringify(options.body) : undefined,
      // PHP session cookie must travel with every request.
      credentials: 'include',
      signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, {
      code: 'server_error',
      message: 'Tidak dapat menghubungi server. Periksa koneksi Anda.',
    })
  }

  if (response.status === 204) return undefined as T

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const body = payload as ApiErrorBody | null
    throw new ApiError(
      response.status,
      body?.error ?? {
        code: 'server_error',
        message: 'Terjadi kesalahan pada server.',
      },
    )
  }

  return payload as T
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
