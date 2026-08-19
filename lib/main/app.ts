import { BrowserWindow, shell, app } from 'electron'
import { join } from 'path'
import appIcon from '@/resources/build/icon.png?asset'
import { setupEvents } from '@/conveyor/router'

export function createAppWindow(): BrowserWindow {
  // Create the main window.
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 780,
    minWidth: 720,
    minHeight: 520,
    show: false,
    backgroundColor: '#0e1011',
    icon: appIcon,
    frame: false,
    titleBarStyle: 'hiddenInset',
    title: 'Electron React App',
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
    },
  })

  // Wire per-window push events. Procedure handlers are registered once, globally, via the
  // `@/conveyor/router` import side-effect and resolve the calling window from each invoke.
  setupEvents(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Only hand http(s) URLs to the OS — never arbitrary protocol handlers.
    try {
      const { protocol } = new URL(url)
      if (protocol === 'https:' || protocol === 'http:') shell.openExternal(url)
    } catch {
      // malformed URL — ignore
    }
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}
