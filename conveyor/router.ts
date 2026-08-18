import type { BrowserWindow } from 'electron'
import { createRouter } from 'electron-conveyor/main'
import { windowModule, setupWindowEvents } from './modules/window'
import { demoModules, setupDemoEvents } from './demo'

/**
 * The app's IPC surface. Runtime is MAIN-ONLY; the renderer imports only `type AppRouter`.
 * `window` is the one core module (the titlebar needs it); the rest come from the playground.
 */

/** Main-process start time — surfaced to handlers as `ctx.appStartedAt` via `createContext`. */
const APP_STARTED_AT = Date.now()

export const router = createRouter(
  {
    window: windowModule,
    ...demoModules, // playground — remove this spread to strip
  },
  {
    createContext: () => ({ appStartedAt: APP_STARTED_AT }),
  }
)

export type AppRouter = typeof router

/** Wire per-window push events. Call once per created window. */
export function setupEvents(win: BrowserWindow): void {
  setupWindowEvents(win)
  setupDemoEvents(win) // playground — remove to strip
}
