import { defineModule, procedure } from '../../init'
import { demoHost } from '../host'

/** Opens another app window - the shared-state and broadcast demos use it to show cross-window work. */
export const windowsModule = defineModule('windows', {
  open: procedure().handle(() => {
    demoHost().openWindow()
  }),
})
