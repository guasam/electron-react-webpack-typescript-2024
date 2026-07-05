import type { z } from 'zod'
import type { HandlerContext, ProcedureDef } from './types'

/**
 * Fluent builder for a renderer→main procedure. The input type flows from `.input()`
 * into the resolver, and the result type is inferred from what the resolver returns.
 *
 * @example
 * procedure().input(z.string()).handle(({ input }) => shell.openExternal(input))
 * procedure().output(z.string()).handle(() => app.getVersion())
 * procedure().handle(({ ctx }) => ctx.window?.minimize())   // void in, void out
 */
class ProcedureBuilder<TInput = void> {
  constructor(
    private readonly _input?: z.ZodType,
    private readonly _output?: z.ZodType
  ) {}

  /** Declare & validate the single input argument. Validated on every call (trust boundary). */
  input<TSchema extends z.ZodType>(schema: TSchema): ProcedureBuilder<z.infer<TSchema>> {
    return new ProcedureBuilder<z.infer<TSchema>>(schema, this._output)
  }

  /** Declare the output schema. Validated in dev only (correctness aid, not security). */
  output<TSchema extends z.ZodType>(schema: TSchema): ProcedureBuilder<TInput> {
    return new ProcedureBuilder<TInput>(this._input, schema)
  }

  /** Attach the implementation. The return type becomes the client's awaited result type. */
  handle<TResult>(
    resolver: (opts: { input: TInput; ctx: HandlerContext }) => TResult
  ): ProcedureDef<TInput, TResult> {
    return {
      kind: 'procedure',
      input: this._input,
      output: this._output,
      resolver: resolver as ProcedureDef<TInput, TResult>['resolver'],
    }
  }
}

export function procedure(): ProcedureBuilder {
  return new ProcedureBuilder()
}
