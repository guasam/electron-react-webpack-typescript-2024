import type { z } from 'zod'
import type { BrowserWindow, IpcMainInvokeEvent, WebContents } from 'electron'

/**
 * Context passed to every procedure handler. Built fresh per invocation from the
 * incoming IPC event, so handlers always act on the *calling* window — no single-window
 * assumption. `window` may be null (e.g. a `<webview>` or offscreen sender).
 */
export interface HandlerContext {
  event: IpcMainInvokeEvent
  sender: WebContents
  window: BrowserWindow | null
}

/** A renderer→main request/response definition (the Zod contract + the handler). */
export interface ProcedureDef<TInput = unknown, TResult = unknown> {
  kind: 'procedure'
  input?: z.ZodType
  output?: z.ZodType
  resolver: (opts: { input: TInput; ctx: HandlerContext }) => TResult
}

/** A main→renderer push definition (typed payload, no handler). */
export interface EventDef<TPayload = unknown> {
  kind: 'event'
  payload: z.ZodType
  /** Phantom: carries the payload type for inference. Never set at runtime. */
  readonly _payload?: TPayload
}

// `any` generics here (not `unknown`) so concrete defs with specific input/result types
// stay assignable to the record type despite resolver-parameter contravariance.
export type AnyDef = ProcedureDef<any, any> | EventDef<any>
export type ModuleRecord = Record<string, AnyDef>

export interface Module<TId extends string = string, TRecord extends ModuleRecord = ModuleRecord> {
  id: TId
  record: TRecord
}

export type AnyModule = Module<string, ModuleRecord>
export type ModuleMap = Record<string, AnyModule>

export interface Router<TModules extends ModuleMap = ModuleMap> {
  modules: TModules
}

export type Unsubscribe = () => void

/* ------------------------------------------------------------------ *
 * Error transport — procedures return a typed envelope so real error
 * detail (message, code, Zod issues) survives the IPC boundary intact.
 * ------------------------------------------------------------------ */

export type ConveyorErrorCode = 'UNKNOWN_PROCEDURE' | 'INVALID_INPUT' | 'INVALID_OUTPUT' | 'HANDLER_ERROR'

export interface ConveyorErrorPayload {
  code: ConveyorErrorCode
  message: string
  /** Zod issues for INVALID_INPUT / INVALID_OUTPUT. */
  issues?: unknown
}

export type ConveyorResult<T> = { ok: true; data: T } | { ok: false; error: ConveyorErrorPayload }

/* ------------------------------------------------------------------ *
 * Client type inference — derives the renderer client purely from the
 * router type. Procedures become async methods; events become { subscribe }.
 * ------------------------------------------------------------------ */

type ClientMember<TDef> =
  TDef extends ProcedureDef<infer I, infer R>
    ? [I] extends [void]
      ? () => Promise<Awaited<R>>
      : (input: I) => Promise<Awaited<R>>
    : TDef extends EventDef<infer P>
      ? { subscribe: (listener: (payload: P) => void) => Unsubscribe }
      : never

type ModuleClient<TRecord extends ModuleRecord> = {
  [K in keyof TRecord]: ClientMember<TRecord[K]>
}

export type ConveyorClient<TRouter extends Router> = {
  [M in keyof TRouter['modules']]: ModuleClient<TRouter['modules'][M]['record']>
}

/* ------------------------------------------------------------------ *
 * Emitter type inference (main side) — the typed push surface for a module.
 * ------------------------------------------------------------------ */

type EventKeysOf<TRecord extends ModuleRecord> = {
  [K in keyof TRecord]: TRecord[K] extends EventDef ? K : never
}[keyof TRecord]

type EventPayloadOf<TDef> = TDef extends EventDef<infer P> ? P : never

export type EventEmitters<TModule extends AnyModule> = {
  [K in EventKeysOf<TModule['record']>]: (payload: EventPayloadOf<TModule['record'][K]>) => void
}
