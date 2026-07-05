import type { Module, ModuleRecord } from './types'

/**
 * Group a set of procedures and events under a namespace id. This is the single source
 * of truth for a feature: contract + handlers live here, and the renderer client type is
 * inferred from it — no hand-written API classes, no magic channel strings.
 *
 * @example
 * export const windowModule = defineModule('window', {
 *   minimize: procedure().handle(({ ctx }) => ctx.window?.minimize()),
 *   onFocusChange: event(z.boolean()),
 * })
 */
export function defineModule<TId extends string, TRecord extends ModuleRecord>(
  id: TId,
  record: TRecord
): Module<TId, TRecord> {
  return { id, record }
}
