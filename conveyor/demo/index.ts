import { filesModule } from './modules/files'
import { systemModule } from './modules/system'
import { streamModule } from './modules/stream'
import { secureModule } from './modules/secure'
import { windowsModule } from './modules/windows'
import { notifyModule } from './modules/notify'
import { tasksModule } from './modules/tasks'
import { sharedStore } from './stores/shared'

/**
 * The playground's demo IPC surface. To strip the playground run `npm run strip-demo`, or by hand:
 * delete this `conveyor/demo/` folder and remove the `// @demo` marked lines in `conveyor/router.ts`
 * and `app/app.tsx`, plus the `app/demo/` folder.
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

/** The playground's cross-window stores, registered by the router. */
export const demoStores = [sharedStore] as const
