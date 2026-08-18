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
})
