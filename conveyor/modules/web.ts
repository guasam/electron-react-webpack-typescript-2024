import { shell } from 'electron'
import { z } from 'zod'
import { defineModule, procedure } from '../init'

/** Web-content operations act on the *calling* frame (`ctx.sender`), so they work in any window. */
export const webModule = defineModule('web', {
  undo: procedure().handle(({ ctx }) => ctx.sender.undo()),
  redo: procedure().handle(({ ctx }) => ctx.sender.redo()),
  cut: procedure().handle(({ ctx }) => ctx.sender.cut()),
  copy: procedure().handle(({ ctx }) => ctx.sender.copy()),
  paste: procedure().handle(({ ctx }) => ctx.sender.paste()),
  delete: procedure().handle(({ ctx }) => ctx.sender.delete()),
  selectAll: procedure().handle(({ ctx }) => ctx.sender.selectAll()),
  reload: procedure().handle(({ ctx }) => ctx.sender.reload()),
  forceReload: procedure().handle(({ ctx }) => ctx.sender.reloadIgnoringCache()),
  toggleDevtools: procedure().handle(({ ctx }) => ctx.sender.toggleDevTools()),
  actualSize: procedure().handle(({ ctx }) => ctx.sender.setZoomLevel(0)),
  zoomIn: procedure().handle(({ ctx }) => ctx.sender.setZoomLevel(ctx.sender.zoomLevel + 0.5)),
  zoomOut: procedure().handle(({ ctx }) => ctx.sender.setZoomLevel(ctx.sender.zoomLevel - 0.5)),
  toggleFullscreen: procedure().handle(({ ctx }) => {
    const win = ctx.window
    if (win) win.setFullScreen(!win.isFullScreen())
  }),
  openUrl: procedure()
    .input(
      z.string().refine((s) => {
        try {
          const { protocol } = new URL(s)
          return protocol === 'https:' || protocol === 'http:'
        } catch {
          return false
        }
      }, 'Only http(s) URLs may be opened externally')
    )
    .handle(({ input }) => shell.openExternal(input)),
})
