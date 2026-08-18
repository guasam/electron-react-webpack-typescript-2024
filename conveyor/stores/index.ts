import { registerDemoStores } from '../demo'

/** Register all cross-window stores on the main process. Call once at startup. */
export function registerStores() {
  return {
    ...registerDemoStores(), // playground — remove to strip
  }
}
