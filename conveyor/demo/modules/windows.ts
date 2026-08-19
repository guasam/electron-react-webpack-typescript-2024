import { z } from 'zod'
import { defineModule, procedure } from '../../init'
import { demoHost } from '../host'

/** Opens another app window, and reports how many are open, for the cross-window demos. */
export const windowsModule = defineModule('windows', {
  open: procedure()
    // Optional playground page id — the new window opens straight onto it.
    .input(z.string().optional())
    .handle(({ input }) => {
      demoHost().openWindow(input)
    }),
  count: procedure()
    .output(z.number())
    .handle(() => demoHost().windows.all().length),
})
