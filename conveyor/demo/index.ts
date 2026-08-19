import type { BrowserWindow } from 'electron'
import { registerStore } from 'electron-conveyor/main'
import { filesModule } from './modules/files'
import { systemModule, setupSystemEvents } from './modules/system'
import { streamModule } from './modules/stream'
import { secureModule } from './modules/secure'
import { windowsModule } from './modules/windows'
import { sharedStore } from './stores/shared'

/**
 * The playground's demo IPC surface. To strip the playground: delete this `conveyor/demo/` folder
 * and remove the `...demoModules` spread in `router.ts`, `registerDemoStores()` in
 * `stores/index.ts`, and `setupDemoEvents()` in `router.ts`.
 */
export const demoModules = {
  files: filesModule,
  system: systemModule,
  stream: streamModule,
  secure: secureModule,
  windows: windowsModule,
}

/** Register the demo cross-window stores on main. */
export function registerDemoStores() {
  return { shared: registerStore(sharedStore) }
}

/** Wire the demo's per-window push events (OS appearance + power). Call once per window. */
export function setupDemoEvents(win: BrowserWindow): void {
  setupSystemEvents(win)
}
