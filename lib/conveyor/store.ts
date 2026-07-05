/**
 * Conveyor Store — main-owned reactive state that auto-syncs across every window.
 *
 * The store definition is PURE (no electron, no react) so it is safely shared by both
 * processes: main registers it as the source of truth; each renderer mirrors it. Actions
 * are pure state reducers (mutate the draft) — side effects belong in procedures, not here.
 */

export type StoreActions<S> = Record<string, (state: S, ...args: never[]) => void>

export interface StoreDef<TId extends string, S, A extends StoreActions<S>> {
  id: TId
  initialState: S
  actions: A
}

/** Client-facing action signatures: the `state` parameter is dropped (supplied in main). */
export type StoreActionsClient<S, A extends StoreActions<S>> = {
  [K in keyof A]: A[K] extends (state: S, ...args: infer P) => void ? (...args: P) => void : never
}

/** What `useConveyorStore` returns: live state merged with the bound actions. */
export type ConveyorStore<S, A extends StoreActions<S>> = S & StoreActionsClient<S, A>

export function defineStore<TId extends string, S, A extends StoreActions<S>>(
  id: TId,
  config: { state: S; actions: A }
): StoreDef<TId, S, A> {
  return { id, initialState: config.state, actions: config.actions }
}
