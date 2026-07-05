import type { BrowserWindow } from 'electron'
import { createRouter } from '@/lib/conveyor/main'
import { appModule } from './app'
import { webModule } from './web'
import { windowModule, setupWindowEvents } from './window'

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
