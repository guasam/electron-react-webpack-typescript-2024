import { contextBridge, ipcRenderer } from 'electron'
import type { ConveyorBridge } from './client'

/**
 * Expose the minimal conveyor bridge to the renderer. Just two functions, no Zod — keeps the
 * preload tiny and `sandbox`-compatible. The typed client Proxy is built renderer-side over this.
 */
export function exposeConveyor(): void {
  const bridge: ConveyorBridge = {
    invoke: (channel, method, ...args) => ipcRenderer.invoke(channel, method, ...args),
    subscribe: (channel, cb) => {
      const listener = (_event: Electron.IpcRendererEvent, payload: unknown) => cb(payload)
      ipcRenderer.on(channel, listener)
      // contextBridge forwards this disposer back to the renderer.
      return () => ipcRenderer.removeListener(channel, listener)
    },
  }

  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('conveyor', bridge)
  } else {
    window.conveyor = bridge
  }
}
