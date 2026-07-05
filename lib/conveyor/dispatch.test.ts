import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { defineModule } from './module'
import { procedure } from './procedure'
import { event } from './event'
import { dispatchProcedure } from './dispatch'
import type { HandlerContext } from './types'

// A fake context — dispatch never touches electron, so a bare object is enough.
const ctx = { window: null, sender: {} as never, event: {} as never } as HandlerContext

const mod = defineModule('demo', {
  echo: procedure()
    .input(z.string())
    .output(z.string())
    .handle(({ input }) => input.toUpperCase()),
  needsCtx: procedure().handle(({ ctx }) => (ctx.window ? 'has-window' : 'no-window')),
  boom: procedure().handle(() => {
    throw new Error('kaboom')
  }),
  badOutput: procedure()
    .output(z.number())
    .handle(() => 'not-a-number' as unknown as number),
  ping: event(z.boolean()),
})

describe('dispatchProcedure', () => {
  it('runs a procedure and returns { ok, data }', async () => {
    const res = await dispatchProcedure(mod, 'echo', 'hi', ctx, true)
    expect(res).toEqual({ ok: true, data: 'HI' })
  })

  it('passes ctx to the resolver', async () => {
    const res = await dispatchProcedure(mod, 'needsCtx', undefined, ctx, true)
    expect(res).toEqual({ ok: true, data: 'no-window' })
  })

  it('rejects invalid input with issues', async () => {
    const res = await dispatchProcedure(mod, 'echo', 123, ctx, true)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.error.code).toBe('INVALID_INPUT')
      expect(Array.isArray(res.error.issues)).toBe(true)
    }
  })

  it('captures a thrown handler error', async () => {
    const res = await dispatchProcedure(mod, 'boom', undefined, ctx, true)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.error.code).toBe('HANDLER_ERROR')
      expect(res.error.message).toContain('kaboom')
    }
  })

  it('validates output only when asked (dev)', async () => {
    const dev = await dispatchProcedure(mod, 'badOutput', undefined, ctx, true)
    expect(dev.ok).toBe(false)
    if (!dev.ok) expect(dev.error.code).toBe('INVALID_OUTPUT')

    // In prod (validateOutput=false) the bad value passes through untouched.
    const prod = await dispatchProcedure(mod, 'badOutput', undefined, ctx, false)
    expect(prod).toEqual({ ok: true, data: 'not-a-number' })
  })

  it('rejects unknown methods and events (not callable as procedures)', async () => {
    const unknown = await dispatchProcedure(mod, 'nope', undefined, ctx, true)
    const asEvent = await dispatchProcedure(mod, 'ping', undefined, ctx, true)
    expect(unknown.ok).toBe(false)
    expect(asEvent.ok).toBe(false)
    if (!unknown.ok) expect(unknown.error.code).toBe('UNKNOWN_PROCEDURE')
    if (!asEvent.ok) expect(asEvent.error.code).toBe('UNKNOWN_PROCEDURE')
  })
})
