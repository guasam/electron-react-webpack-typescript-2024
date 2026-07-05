import type { AnyModule, ConveyorResult, HandlerContext, ProcedureDef } from './types'

const message = (err: unknown): string => (err instanceof Error ? err.message : String(err))

/**
 * Pure procedure dispatch — no electron, no logging. Validates input (always), runs the
 * resolver, validates output (when `validateOutput`), and returns a typed result envelope.
 * `main.ts` wraps this with `ipcMain.handle` + a real `ctx`; tests call it directly.
 */
export async function dispatchProcedure(
  mod: AnyModule,
  method: string,
  input: unknown,
  ctx: HandlerContext,
  validateOutput: boolean
): Promise<ConveyorResult<unknown>> {
  const def = mod.record[method]
  if (!def || def.kind !== 'procedure') {
    return { ok: false, error: { code: 'UNKNOWN_PROCEDURE', message: `Unknown procedure: ${mod.id}.${method}` } }
  }
  const proc = def as ProcedureDef

  // Input is the trust boundary — always validated.
  let parsedInput: unknown = input
  if (proc.input) {
    const parsed = proc.input.safeParse(input)
    if (!parsed.success) {
      return { ok: false, error: { code: 'INVALID_INPUT', message: `Invalid input for ${mod.id}.${method}`, issues: parsed.error.issues } }
    }
    parsedInput = parsed.data
  }

  let result: unknown
  try {
    result = await proc.resolver({ input: parsedInput, ctx })
  } catch (err) {
    return { ok: false, error: { code: 'HANDLER_ERROR', message: `${mod.id}.${method}: ${message(err)}` } }
  }

  // Output comes from trusted main code — validated in dev only.
  if (validateOutput && proc.output) {
    const parsed = proc.output.safeParse(result)
    if (!parsed.success) {
      return { ok: false, error: { code: 'INVALID_OUTPUT', message: `Invalid output for ${mod.id}.${method}`, issues: parsed.error.issues } }
    }
    return { ok: true, data: parsed.data }
  }
  return { ok: true, data: result }
}
