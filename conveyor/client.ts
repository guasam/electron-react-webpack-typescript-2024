import { createConveyorClient, createConveyorHooks } from 'electron-conveyor/renderer'
import type { AppRouter } from './router'
import type {
  ConveyorQueryHook,
  ConveyorMutationHook,
  ConveyorEventHook,
  ConveyorStreamHook,
} from 'electron-conveyor/renderer'

export const conveyor = createConveyorClient<AppRouter>()

// Explicit named annotations so these re-exported hooks reference the package's public types
const hooks = createConveyorHooks(conveyor)
export const useConveyorQuery: ConveyorQueryHook<AppRouter> = hooks.useConveyorQuery
export const useConveyorMutation: ConveyorMutationHook<AppRouter> = hooks.useConveyorMutation
export const useConveyorEvent: ConveyorEventHook<AppRouter> = hooks.useConveyorEvent
export const useConveyorStream: ConveyorStreamHook<AppRouter> = hooks.useConveyorStream
