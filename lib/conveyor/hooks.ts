import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import type { ConveyorClient, Router, Unsubscribe } from './types'

type QueryOpts<T> = Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
type MutationOpts<TData, TVars> = Omit<UseMutationOptions<TData, Error, TVars>, 'mutationFn'>

/** Anything the client exposes as a subscribable event member. */
interface Subscribable<P> {
  subscribe: (listener: (payload: P) => void) => Unsubscribe
}

/**
 * Bind the conveyor React hooks to a typed client instance. Returns fully-typed
 * `useConveyorQuery` / `useConveyorMutation` / `useConveyorEvent` — thin wrappers over
 * TanStack Query and a subscription effect.
 *
 * @example
 * export const conveyor = createConveyorClient<AppRouter>()
 * export const { useConveyorQuery, useConveyorMutation, useConveyorEvent } = createConveyorHooks(conveyor)
 */
export function createConveyorHooks<TRouter extends Router>(client: ConveyorClient<TRouter>) {
  type Client = ConveyorClient<TRouter>

  /** Fetch data from a procedure with caching/loading/error via TanStack Query. */
  function useConveyorQuery<T>(
    key: readonly unknown[],
    selector: (c: Client) => Promise<T>,
    options?: QueryOpts<T>
  ): UseQueryResult<T, Error> {
    return useQuery<T, Error>({
      queryKey: ['conveyor', ...key],
      queryFn: () => selector(client),
      retry: 1,
      ...options,
    })
  }

  /** Run a procedure as a mutation (invalidate/refetch queries in `onSuccess`, etc.). */
  function useConveyorMutation<TData, TVars = void>(
    mutator: (c: Client, vars: TVars) => Promise<TData>,
    options?: MutationOpts<TData, TVars>
  ): UseMutationResult<TData, Error, TVars> {
    return useMutation<TData, Error, TVars>({
      mutationFn: (vars) => mutator(client, vars),
      ...options,
    })
  }

  /** Subscribe to a main→renderer push event for the lifetime of the component. */
  function useConveyorEvent<P>(selector: (c: Client) => Subscribable<P>, listener: (payload: P) => void): void {
    const listenerRef = useRef(listener)
    listenerRef.current = listener

    useEffect(() => {
      const unsubscribe = selector(client).subscribe((payload) => listenerRef.current(payload))
      return unsubscribe
      // The event target is stable across renders; re-subscribing per render is neither
      // wanted nor safe, so we intentionally run this once.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  }

  return { useConveyorQuery, useConveyorMutation, useConveyorEvent }
}
