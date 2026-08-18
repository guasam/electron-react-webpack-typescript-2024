import { initConveyor } from 'electron-conveyor/define'

/**
 * The app's custom handler context. Every procedure handler receives this merged on top of the
 * base electron fields (`event`, `sender`, `window`). Supplied by `createContext` in `router.ts`.
 *
 * It's a type — referencing main-only services here never pulls runtime into the renderer bundle.
 */
export interface AppContext {
  /** Epoch ms when the main process started. Demonstrates context flowing into handlers. */
  appStartedAt: number
}

/**
 * Authoring primitives bound to `AppContext`. Modules import `procedure` / `defineModule` / `event`
 * from here (not from `electron-conveyor/define`), so `ctx` is fully typed in every handler.
 */
export const { procedure, defineModule, event, middleware } = initConveyor<AppContext>()

/**
 * Example middleware: log each call and how long it took. Demonstrates the wrap pattern
 * (`await next()`), and composes onto any procedure via `.use(logged)`.
 */
export const logged = middleware(async ({ path, next }) => {
  const start = performance.now()
  const result = await next()
  // eslint-disable-next-line no-console -- intentional dev-time telemetry example
  console.log(`[conveyor] ${path} (${(performance.now() - start).toFixed(1)}ms)`)
  return result
})
