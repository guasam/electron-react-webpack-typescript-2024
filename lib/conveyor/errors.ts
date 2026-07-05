import type { ConveyorErrorCode, ConveyorErrorPayload } from './types'

/**
 * Thrown in the renderer when a procedure fails in main. Carries the real message plus a
 * stable `code` and (for validation failures) the Zod `issues` — so callers can branch on
 * `err.code` and surface field-level detail instead of parsing a string.
 */
export class ConveyorError extends Error {
  readonly code: ConveyorErrorCode
  readonly issues?: unknown

  constructor(payload: ConveyorErrorPayload) {
    super(payload.message)
    this.name = 'ConveyorError'
    this.code = payload.code
    this.issues = payload.issues
  }
}
