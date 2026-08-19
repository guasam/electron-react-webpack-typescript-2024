// Injected by lib/main at startup so the `windows.open` demo procedure can spawn another window
// without importing app-window code (which would create an import cycle).
let factory: (() => void) | null = null

export function setDemoWindowFactory(fn: () => void): void {
  factory = fn
}

export function openDemoWindow(): void {
  factory?.()
}
