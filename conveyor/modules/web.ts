import { shell } from 'electron'
import { z } from 'zod'
import { defineModule, command } from '../init'

/**
 * Web-content operations for the titlebar menu. Each acts on the *calling* frame (`ctx.sender`),
 * so it targets whichever window invoked it. Core chrome (not part of the strippable demo).
 */
export const webModule = defineModule({
  undo: command(({ ctx }) => ctx.sender.undo()),
  redo: command(({ ctx }) => ctx.sender.redo()),
  cut: command(({ ctx }) => ctx.sender.cut()),
  copy: command(({ ctx }) => ctx.sender.copy()),
  paste: command(({ ctx }) => ctx.sender.paste()),
  selectAll: command(({ ctx }) => ctx.sender.selectAll()),
  reload: command(({ ctx }) => ctx.sender.reload()),
  forceReload: command(({ ctx }) => ctx.sender.reloadIgnoringCache()),
  toggleDevtools: command(({ ctx }) => ctx.sender.toggleDevTools()),
  actualSize: command(({ ctx }) => ctx.sender.setZoomLevel(0)),
  zoomIn: command(({ ctx }) => ctx.sender.setZoomLevel(ctx.sender.zoomLevel + 0.5)),
  zoomOut: command(({ ctx }) => ctx.sender.setZoomLevel(ctx.sender.zoomLevel - 0.5)),
  toggleFullscreen: command(({ ctx }) => {
    const win = ctx.window
    if (win) win.setFullScreen(!win.isFullScreen())
  }),
  openUrl: command(
    z.string().refine((s) => {
      try {
        const { protocol } = new URL(s)
        return protocol === 'https:' || protocol === 'http:'
      } catch {
        return false
      }
    }, 'Only http(s) URLs may be opened externally'),
    ({ input }) => shell.openExternal(input)
  ),
})
