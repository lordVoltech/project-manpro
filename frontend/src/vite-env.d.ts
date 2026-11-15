/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "mock" (default) serves data in the browser; "live" calls the PHP API. */
  readonly VITE_API_MODE?: 'mock' | 'live'
  /** Base URL of the PHP API, e.g. "/api" behind the Vite proxy. */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
