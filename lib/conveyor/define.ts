/**
 * Authoring primitives — pure, no electron/react/zustand runtime. Safe to import in ANY
 * process. This is what you use to *define* IPC surface (modules, procedures, events, stores).
 *
 *   import { defineModule, procedure, event, defineStore } from '@/lib/conveyor/define'
 */
export { defineModule } from './module'
export { procedure } from './procedure'
export { event } from './event'
export { defineStore } from './store'

export type { HandlerContext, ProcedureDef, EventDef, Module, Router, ConveyorClient, EventEmitters, Unsubscribe } from './types'
export type { StoreDef, StoreActions, StoreActionsClient, ConveyorStore } from './store'
