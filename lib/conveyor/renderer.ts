/**
 * Renderer-only entry point. Everything the renderer needs to consume the conveyor.
 *
 *   import { createConveyorClient, createConveyorHooks, useConveyorStore } from '@/lib/conveyor/renderer'
 */
export { createConveyorClient } from './client'
export type { ConveyorBridge } from './client'
export { createConveyorHooks } from './hooks'
export { useConveyorStore, useConveyorActions } from './store-client'
export { ConveyorError } from './errors'
export type { ConveyorErrorCode, ConveyorErrorPayload } from './types'
