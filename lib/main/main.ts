import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindowManager } from 'electron-conveyor/main'
import { createAppWindow } from './app'
import { registerResourcesProtocol } from './protocols'
import { registerStores } from '@/conveyor/stores'
import { setDemoHost } from '@/conveyor/demo/host'

/** Tracks every window by label; the substrate for cross-window targeting. */
export const windows = createWindowManager()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Register the custom resources protocol once, and all cross-window stores.
  registerResourcesProtocol()
  registerStores()

  // Give the playground the window manager (broadcast fan-out) + a window opener. Remove to strip.
  let windowCount = 1
  setDemoHost({
    windows,
    openWindow: () => {
      windowCount += 1
      windows.register(`window-${windowCount}`, createAppWindow())
    },
  })

  // Open the main window. (Core apps ship a single window.)
  windows.register('main', createAppWindow())

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createAppWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file, you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
