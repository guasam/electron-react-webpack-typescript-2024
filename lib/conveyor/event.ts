import type { z } from 'zod'
import type { EventDef } from './types'

/**
 * Declare a typed main→renderer push channel. Emit it from main via `createEmitter`,
 * subscribe in the renderer via the client's `.subscribe()` or the `useConveyorEvent` hook.
 *
 * @example
 * onFocusChange: event(z.boolean())
 */
export function event<TSchema extends z.ZodType>(payload: TSchema): EventDef<z.infer<TSchema>> {
  return { kind: 'event', payload }
}
