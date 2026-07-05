import { app, ipcMain, BrowserWindow } from 'electron'
import { dispatchProcedure } from './dispatch'
import type { AnyModule, EventEmitters, HandlerContext, ModuleMap, Router } from './types'

// Main-process entry point. Re-export the store registrar so main code has one import site:
//   import { createRouter, createEmitter, registerStore } from '@/lib/conveyor/main'
export { registerStore } from './store-main'
export type { StoreHandle } from './store-main'

// Dev flag via Electron's own signal. We avoid Vite's `import.meta.env.DEV` here: this file runs
// in the Electron main process, and when conveyor is consumed as an externalized package it is not
// transformed by the app's Vite build, so `import.meta.env` would be undefined at runtime.
// `app.isPackaged` is accurate in both dev and packaged builds and needs no env vars.
const isDev = !app.isPackaged

/**
 * Register every module's procedures on the main process. One `ipcMain.handle` per module
 * (namespaced `conveyor:${id}`), dispatched by method. Returns the router value whose *type*
 * (`typeof router`) is the single contract the renderer infers its client from.
 */
export function createRouter<TModules extends ModuleMap>(modules: TModules): Router<TModules> {
  for (const key of Object.keys(modules)) {
    registerModule(modules[key])
  }
  return { modules }
}

function registerModule(mod: AnyModule): void {
  const channel = `conveyor:${mod.id}`

  ipcMain.handle(channel, async (event, method: string, input: unknown) => {
    const ctx: HandlerContext = {
      event,
      sender: event.sender,
      window: BrowserWindow.fromWebContents(event.sender),
    }
    const result = await dispatchProcedure(mod, method, input, ctx, isDev)
    if (!result.ok && isDev) {
      console.error(`[conveyor] ${result.error.code}: ${result.error.message}`, result.error.issues ?? '')
    }
    return result
  })
}

/**
 * Build the typed push emitters for a module, targeting a specific window. Wire main-side
 * sources to these in a per-window `setupEvents(win)` (e.g. `win.on('focus', () => emit.onFocusChange(true))`).
 */
export function createEmitter<TModule extends AnyModule>(mod: TModule, win: BrowserWindow): EventEmitters<TModule> {
  const emitters: Record<string, (payload: unknown) => void> = {}

  for (const key of Object.keys(mod.record)) {
    const def = mod.record[key]
    if (def.kind !== 'event') continue
    const channel = `conveyor:event:${mod.id}:${key}`

    emitters[key] = (payload: unknown) => {
      if (isDev) def.payload.parse(payload)
      if (!win.isDestroyed()) win.webContents.send(channel, payload)
    }
  }

  return emitters as EventEmitters<TModule>
}
