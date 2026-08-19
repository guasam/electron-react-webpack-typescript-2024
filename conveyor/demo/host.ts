import type { ConveyorWindowManager } from 'electron-conveyor/main'

/**
 * Bridge to app-level main things the demo needs (the window manager + a window opener), injected by
 * lib/main at startup so conveyor/demo doesn't import app-window code (which would cycle).
 */
interface DemoHost {
  /** `page` is a playground page id the new window should open on. */
  openWindow: (page?: string) => void
  windows: ConveyorWindowManager
}

let host: DemoHost | null = null

export function setDemoHost(value: DemoHost): void {
  host = value
}

export function demoHost(): DemoHost {
  if (!host) throw new Error('[conveyor/demo] host not initialized')
  return host
}
