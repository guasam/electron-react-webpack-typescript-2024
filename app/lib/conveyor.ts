import { createConveyorClient, createConveyorHooks } from 'electron-conveyor/renderer'
// Type-only import — erased at build, so no main-process runtime enters the renderer bundle.
import type { AppRouter } from '@/conveyor/router'

/** The typed conveyor client for the renderer. */
export const conveyor = createConveyorClient<AppRouter>()

/** Fully-typed React hooks bound to the client. */
export const { useConveyorQuery, useConveyorMutation, useConveyorEvent } = createConveyorHooks(conveyor)
