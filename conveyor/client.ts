import { createConveyorClient, createConveyorHooks } from 'electron-conveyor/renderer'
import type { ConveyorQueryHook, ConveyorMutationHook, ConveyorEventHook } from 'electron-conveyor/renderer'
// Type-only import — erased at build, so no main-process runtime enters the renderer bundle.
import type { AppRouter } from './router'

/** The typed conveyor client for the renderer. */
export const conveyor = createConveyorClient<AppRouter>()

// Explicit named annotations so these re-exported hooks reference the package's public types
// (portable) instead of inferring/expanding TanStack Query internals across the package boundary.
const hooks = createConveyorHooks(conveyor)
export const useConveyorQuery: ConveyorQueryHook<AppRouter> = hooks.useConveyorQuery
export const useConveyorMutation: ConveyorMutationHook<AppRouter> = hooks.useConveyorMutation
export const useConveyorEvent: ConveyorEventHook<AppRouter> = hooks.useConveyorEvent
