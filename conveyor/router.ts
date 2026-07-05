import type { BrowserWindow } from 'electron'
import { createRouter } from 'electron-conveyor/main'
import { appModule } from './modules/app'
import { webModule } from './modules/web'
import { windowModule, setupWindowEvents } from './modules/window'

/**
 * The app's IPC surface. Runtime is MAIN-ONLY; the renderer imports only `type AppRouter`
 * and infers its fully-typed client from it — no client code crosses the process boundary.
 */
export const router = createRouter({
  app: appModule,
  window: windowModule,
  web: webModule,
})

export type AppRouter = typeof router

/** Wire per-window push events. Call once per created window. */
export function setupEvents(win: BrowserWindow): void {
  setupWindowEvents(win)
}
