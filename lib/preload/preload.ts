import { exposeConveyor } from '@/lib/conveyor/preload'

// Expose the minimal conveyor bridge (invoke + subscribe) to the renderer.
// The typed client Proxy is built renderer-side over this.
exposeConveyor()
