import { z } from 'zod'
import { defineModule, procedure, middleware } from '../../init'

// Demo-only lock state, held in main. A real app would gate on a session/token in context.
let unlocked = false
const PIN = '1234'

/** Cross-cutting timing — logs how long the wrapped handler took (the `.use()` wrap pattern). */
const timed = middleware(async ({ path, next }) => {
  const start = performance.now()
  const result = await next()
  // eslint-disable-next-line no-console -- demo telemetry
  console.log(`[conveyor] ${path} (${(performance.now() - start).toFixed(1)}ms)`)
  return result
})

/** Guard — blocks the handler unless the demo is unlocked. */
const requireUnlocked = middleware(({ next }) => {
  if (!unlocked) throw new Error('Locked: unlock with PIN 1234 first')
  return next()
})

/**
 * Middleware + context demo — `readSecret` is wrapped by `timed` and guarded by `requireUnlocked`,
 * and reads `ctx.appStartedAt` from the app context. Try it locked (fails), unlock, try again.
 */
export const secureModule = defineModule('secure', {
  status: procedure()
    .output(z.object({ unlocked: z.boolean() }))
    .handle(() => ({ unlocked })),

  unlock: procedure()
    .input(z.string())
    .output(z.boolean())
    .handle(({ input }) => {
      unlocked = input === PIN
      return unlocked
    }),

  lock: procedure().handle(() => {
    unlocked = false
  }),

  readSecret: procedure()
    .use(timed)
    .use(requireUnlocked)
    .output(z.object({ secret: z.string(), uptimeMs: z.number() }))
    .handle(({ ctx }) => ({ secret: 'The cake is a lie 🍰', uptimeMs: Date.now() - ctx.appStartedAt })),
})
