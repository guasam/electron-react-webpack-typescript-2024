import { app } from 'electron'
import { z } from 'zod'
import { defineModule, procedure } from 'electron-conveyor/define'

export const appModule = defineModule('app', {
  version: procedure()
    .output(z.string())
    .handle(() => app.getVersion()),
})
