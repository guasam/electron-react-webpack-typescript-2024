import { app } from 'electron'
import { z } from 'zod'
import { defineModule, procedure, logged } from '../init'

export const appModule = defineModule('app', {
  version: procedure()
    .output(z.string())
    .handle(() => app.getVersion()),

  // Demonstrates custom context (`ctx.appStartedAt`) + a wrapping middleware (`logged`).
  uptime: procedure()
    .use(logged)
    .output(z.number())
    .handle(({ ctx }) => Date.now() - ctx.appStartedAt),

  // Streaming demo: emit `from → 0`, one per 500ms. `signal` (fired on unsubscribe) stops it early.
  countdown: procedure()
    .input(z.number())
    .output(z.number())
    .stream(async function* ({ input, signal }) {
      for (let i = input; i >= 0 && !signal.aborted; i--) {
        yield i
        if (i > 0) await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }),
})
