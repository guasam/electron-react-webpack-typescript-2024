import { initConveyor } from 'electron-conveyor/define'

/**
 * The app's custom handler context, merged onto the base electron fields (`event`, `sender`,
 * `window`) for every procedure. Supplied by `createContext` in `router.ts`. It's a type, so
 * referencing main-only services here never pulls runtime into the renderer bundle.
 */
export interface AppContext {
  /** Epoch ms when the main process started. */
  appStartedAt: number
}

/** Authoring primitives bound to `AppContext`. Modules import these instead of the bare package. */
export const { procedure, defineModule, event, middleware } = initConveyor<AppContext>()
