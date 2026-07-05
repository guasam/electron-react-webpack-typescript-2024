import { createStore, type StoreApi } from 'zustand/vanilla'
import { useStore } from 'zustand'
import type { ConveyorStore, StoreActions, StoreActionsClient, StoreDef } from './store'

// One mirror + one bound-action map per store id, shared by all components in this window.
const mirrors = new Map<string, StoreApi<object>>()
const actionMaps = new Map<string, Record<string, (...args: unknown[]) => void>>()

function getMirror(def: StoreDef<string, object, StoreActions<object>>): StoreApi<object> {
  const existing = mirrors.get(def.id)
  if (existing) return existing

  const channel = `conveyor:store:${def.id}`
  const store = createStore<object>(() => structuredClone(def.initialState))

  // Hydrate from the source of truth, then stay in sync via broadcast patches.
  window.conveyor.invoke(channel, '__get__').then((s) => store.setState(s as object, true))
  window.conveyor.subscribe(`${channel}:changed`, (s) => store.setState(s as object, true))

  mirrors.set(def.id, store)
  return store
}

function getActions(def: StoreDef<string, object, StoreActions<object>>) {
  const existing = actionMaps.get(def.id)
  if (existing) return existing

  const channel = `conveyor:store:${def.id}`
  const bound: Record<string, (...args: unknown[]) => void> = {}
  for (const name of Object.keys(def.actions)) {
    bound[name] = (...args: unknown[]) => void window.conveyor.invoke(channel, name, { args })
  }
  actionMaps.set(def.id, bound)
  return bound
}

type AnyStoreDef = StoreDef<string, object, StoreActions<object>>

/**
 * Subscribe to a cross-window store. Source of truth lives in main; every window stays in
 * sync automatically.
 *
 * - Without a selector → live state merged with bound actions (convenient; re-renders on any change).
 * - With a selector → just that slice (re-renders only when the slice changes — the ergonomic default for real UIs).
 *
 * @example
 * const counter = useConveyorStore(counterStore)          // { count, updatedBy, increment, ... }
 * const count   = useConveyorStore(counterStore, s => s.count)   // number, re-renders only on count
 * const { increment } = useConveyorActions(counterStore)         // stable, never causes re-render
 */
export function useConveyorStore<TId extends string, S extends object, A extends StoreActions<S>>(
  def: StoreDef<TId, S, A>
): ConveyorStore<S, A>
export function useConveyorStore<TId extends string, S extends object, A extends StoreActions<S>, T>(
  def: StoreDef<TId, S, A>,
  selector: (state: S) => T
): T
export function useConveyorStore(def: AnyStoreDef, selector?: (state: object) => unknown): unknown {
  const store = getMirror(def)
  const selected = useStore(store, selector ?? ((s) => s))
  if (selector) return selected
  return { ...(selected as object), ...getActions(def) }
}

/** Bound actions for a store — stable references, so reading them never triggers a re-render. */
export function useConveyorActions<TId extends string, S extends object, A extends StoreActions<S>>(
  def: StoreDef<TId, S, A>
): StoreActionsClient<S, A> {
  return getActions(def as unknown as AnyStoreDef) as StoreActionsClient<S, A>
}
