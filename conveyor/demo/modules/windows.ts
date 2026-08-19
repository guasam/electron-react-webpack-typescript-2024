import { z } from 'zod'
import { defineModule, procedure } from '../../init'
import { demoHost } from '../host'

/** Opens another app window, and reports how many are open, for the cross-window demos. */
export const windowsModule = defineModule('windows', {
  open: procedure().handle(() => {
    demoHost().openWindow()
  }),
  count: procedure()
    .output(z.number())
    .handle(() => demoHost().windows.all().length),
})
