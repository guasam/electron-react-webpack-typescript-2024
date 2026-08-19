import { defineModule, procedure } from '../../init'
import { openDemoWindow } from '../window-factory'

/** Opens another app window — the shared-store demo uses it to show cross-window sync. */
export const windowsModule = defineModule('windows', {
  open: procedure().handle(() => {
    openDemoWindow()
  }),
})
