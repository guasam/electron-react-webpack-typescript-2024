import { registerStore } from 'electron-conveyor/main'
import { filesModule } from './modules/files'
import { systemModule } from './modules/system'
import { streamModule } from './modules/stream'
import { secureModule } from './modules/secure'
import { windowsModule } from './modules/windows'
import { notifyModule } from './modules/notify'
import { tasksModule } from './modules/tasks'
import { sharedStore } from './stores/shared'

/**
 * The playground's demo IPC surface. To strip the playground: delete this `conveyor/demo/` folder
 * and remove the `...demoModules` spread in `router.ts` plus `registerDemoStores()` in
 * `stores/index.ts` and `setDemoHost(...)` in `lib/main/main.ts`.
 */
export const demoModules = {
  files: filesModule,
  system: systemModule,
  stream: streamModule,
  secure: secureModule,
  windows: windowsModule,
  notify: notifyModule,
  tasks: tasksModule,
}

/** Register the demo cross-window stores on main. */
export function registerDemoStores() {
  return { shared: registerStore(sharedStore) }
}
