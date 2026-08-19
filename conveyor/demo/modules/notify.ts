import { z } from 'zod'
import { defineModule, procedure, event } from '../../init'
import { createEmitter } from 'electron-conveyor/main'
import { demoHost } from '../host'

/**
 * Cross-window notify - a typed main→renderer event fanned out to the OTHER windows (not the caller,
 * which already sees the change) via the window manager. Used by the shared-store demo.
 */
export const notifyModule = defineModule('notify', {
  onNotify: event(z.string()),

  toOthers: procedure()
    .input(z.string())
    .handle(({ input, ctx }) => {
      createEmitter(notifyModule, demoHost().windows.except(ctx.sender)).onNotify(input)
    }),
})
