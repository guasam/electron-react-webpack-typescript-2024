import { registerStore } from 'electron-conveyor/main'
import { counterStore } from './counter'

/** Register all cross-window stores on the main process. Call once at startup. */
export function registerStores() {
  return {
    counter: registerStore(counterStore),
  }
}
