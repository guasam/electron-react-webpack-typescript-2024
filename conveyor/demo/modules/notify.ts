import { z } from 'zod'
import { defineModule, procedure, event } from '../../init'
import { createEmitter } from 'electron-conveyor/main'
import { demoHost } from '../host'

/**
 * Cross-window broadcast - a typed main→renderer event fanned out to windows via the window manager.
 * `broadcast` hits every window; `toOthers` skips the caller (used when the sender already sees it).
 */
export const notifyModule = defineModule('notify', {
  onNotify: event(z.string()),

  broadcast: procedure()
    .input(z.string())
    .handle(({ input }) => {
      createEmitter(notifyModule, demoHost().windows.broadcast).onNotify(input)
    }),

  toOthers: procedure()
    .input(z.string())
    .handle(({ input, ctx }) => {
      createEmitter(notifyModule, demoHost().windows.except(ctx.sender)).onNotify(input)
    }),
})
