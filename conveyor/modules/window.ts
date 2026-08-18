import { BrowserWindow } from 'electron'
import { z } from 'zod'
import { defineModule, procedure, event } from '../init'
import { createEmitter } from 'electron-conveyor/main'

const windowInit = z.object({
  width: z.number(),
  height: z.number(),
  minimizable: z.boolean(),
  maximizable: z.boolean(),
  platform: z.string(),
})

export const windowModule = defineModule('window', {
  init: procedure()
    .output(windowInit)
    .handle(({ ctx }) => {
      const win = ctx.window
      if (!win) throw new Error('window.init called without an owning window')
      const { width, height } = win.getBounds()
      return {
        width,
        height,
        minimizable: win.isMinimizable(),
        maximizable: win.isMaximizable(),
        platform: process.platform,
      }
    }),

  isMinimizable: procedure()
    .output(z.boolean())
    .handle(({ ctx }) => ctx.window?.isMinimizable() ?? false),

  isMaximizable: procedure()
    .output(z.boolean())
    .handle(({ ctx }) => ctx.window?.isMaximizable() ?? false),

  minimize: procedure().handle(({ ctx }) => {
    ctx.window?.minimize()
  }),

  maximize: procedure().handle(({ ctx }) => {
    ctx.window?.maximize()
  }),

  close: procedure().handle(({ ctx }) => {
    ctx.window?.close()
  }),

  maximizeToggle: procedure().handle(({ ctx }) => {
    const win = ctx.window
    if (!win) return
    if (win.isMaximized()) win.unmaximize()
    else win.maximize()
  }),

  // main → renderer push
  onFocusChange: event(z.boolean()),
  onMaximizeChange: event(z.boolean()),
})

/** Wire this window's native events to the module's push emitters. */
export function setupWindowEvents(win: BrowserWindow): void {
  const emit = createEmitter(windowModule, win)
  win.on('focus', () => emit.onFocusChange(true))
  win.on('blur', () => emit.onFocusChange(false))
  win.on('maximize', () => emit.onMaximizeChange(true))
  win.on('unmaximize', () => emit.onMaximizeChange(false))
}
