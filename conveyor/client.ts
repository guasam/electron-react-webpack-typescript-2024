import { QueryClient } from '@tanstack/react-query'
import { createConveyorReactClient } from 'electron-conveyor/react'
import type { AppRouter } from './router'

/** The app's TanStack Query client — created here so conveyor's typed `invalidate()` can use it. */
export const queryClient = new QueryClient()

/**
 * The typed IPC client. Every member is callable (`await conveyor.system.info()`) and carries its
 * hooks: `conveyor.system.info.useQuery()`, `conveyor.web.openUrl.useMutation()`,
 * `conveyor.window.onFocusChange.useEvent(cb)`, `conveyor.stream.respond.useStream({...})` —
 * query keys derive from the call path, so they are never written by hand.
 */
export const conveyor = createConveyorReactClient<AppRouter>({ queryClient })
