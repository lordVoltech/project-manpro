import type { ApiErrorBody, ApiErrorCode } from './types'

/**
 * Error thrown for every non-2xx response, whether it came from the mock
 * backend or from the real one. Screens handle a single error type.
 */
export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode
  readonly fieldErrors: Record<string, string>

  constructor(status: number, body: ApiErrorBody['error']) {
    super(body.message)
    this.name = 'ApiError'
    this.status = status
    this.code = body.code
    this.fieldErrors = body.field_errors ?? {}
  }

  /** True when one or more form fields failed validation. */
  get isValidation(): boolean {
    return this.status === 422 || this.code === 'validation_failed'
  }
}
