import { conveyor } from '@/conveyor/client'

export interface MenuItem {
  label?: string
  shortcut?: string
  action?: () => void
  separator?: boolean
}

export interface Menu {
  label: string
  items: MenuItem[]
}

/** Titlebar menu, wired to the core `window` and `web` modules. Edit these to taste. */
export const MENUS: Menu[] = [
  {
    label: 'File',
    items: [{ label: 'Close Window', shortcut: 'Ctrl+W', action: () => conveyor.window.close() }],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', shortcut: 'Ctrl+Z', action: () => conveyor.web.undo() },
      { label: 'Redo', shortcut: 'Ctrl+Y', action: () => conveyor.web.redo() },
      { separator: true },
      { label: 'Cut', shortcut: 'Ctrl+X', action: () => conveyor.web.cut() },
      { label: 'Copy', shortcut: 'Ctrl+C', action: () => conveyor.web.copy() },
      { label: 'Paste', shortcut: 'Ctrl+V', action: () => conveyor.web.paste() },
      { separator: true },
      { label: 'Select All', shortcut: 'Ctrl+A', action: () => conveyor.web.selectAll() },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Reload', shortcut: 'Ctrl+R', action: () => conveyor.web.reload() },
      { label: 'Toggle DevTools', shortcut: 'Ctrl+Shift+I', action: () => conveyor.web.toggleDevtools() },
      { separator: true },
      { label: 'Zoom In', action: () => conveyor.web.zoomIn() },
      { label: 'Zoom Out', action: () => conveyor.web.zoomOut() },
      { label: 'Actual Size', action: () => conveyor.web.actualSize() },
      { separator: true },
      { label: 'Toggle Fullscreen', shortcut: 'F11', action: () => conveyor.web.toggleFullscreen() },
    ],
  },
]
