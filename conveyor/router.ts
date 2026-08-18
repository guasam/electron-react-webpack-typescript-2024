import type { BrowserWindow } from 'electron'
import { createRouter } from 'electron-conveyor/main'
import { appModule } from './modules/app'
import { webModule } from './modules/web'
import { windowModule, setupWindowEvents } from './modules/window'

/**
 * The app's IPC surface. Runtime is MAIN-ONLY; the renderer imports only `type AppRouter`
 * and infers its fully-typed client from it — no client code crosses the process boundary.
 */
/** Main-process start time — surfaced to handlers as `ctx.appStartedAt` via `createContext`. */
const APP_STARTED_AT = Date.now()

export const router = createRouter(
  {
    app: appModule,
    window: windowModule,
    web: webModule,
  },
  {
    // Supplies the app's custom context (typed as `AppContext`) to every handler. Required
    // because the modules were authored with `initConveyor<AppContext>()`.
    createContext: () => ({ appStartedAt: APP_STARTED_AT }),
  }
)

export type AppRouter = typeof router

/** Wire per-window push events. Call once per created window. */
export function setupEvents(win: BrowserWindow): void {
  setupWindowEvents(win)
}
