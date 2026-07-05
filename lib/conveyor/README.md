# Conveyor

Type-safe IPC + cross-window state for Electron, with **one source of truth per feature** and
**end-to-end inference** — no hand-written client, no magic channel strings.

Define a feature in one file; the renderer client type is inferred from it. Adding an IPC call
is one edit, and a typo is a compile error, not a runtime surprise.

## Mental model

| You want… | Use a… | Direction |
| --- | --- | --- |
| Renderer to call main and get a result | `procedure().output(z)` | renderer → main → back |
| Renderer to tell main something (awaitable) | `procedure()` (void) | renderer → main |
| Main to push to the renderer | `event(z)` | main → renderer |
| State shared live across all windows | `defineStore(...)` | main = source of truth |

## Import map (one entry point per process)

```ts
import { defineModule, procedure, event, defineStore } from '@/lib/conveyor/define'   // authoring (pure, any process)
import { createRouter, createEmitter, registerStore } from '@/lib/conveyor/main'       // main only
import { createConveyorClient, createConveyorHooks, useConveyorStore } from '@/lib/conveyor/renderer' // renderer only
import { exposeConveyor } from '@/lib/conveyor/preload'                                 // preload only
```

## Add a procedure

```ts
// conveyor/file.ts
import { defineModule, procedure } from '@/lib/conveyor/define'
import { z } from 'zod'
import { readFile } from 'node:fs/promises'

export const fileModule = defineModule('file', {
  read: procedure()
    .input(z.string())
    .output(z.string())
    .handle(({ input }) => readFile(input, 'utf-8')),
})
```

Register it once:

```ts
// conveyor/router.ts
export const router = createRouter({ app: appModule, window: windowModule, file: fileModule })
export type AppRouter = typeof router   // the ONLY thing the renderer imports from here
```

Use it — fully typed, no client code written:

```ts
const text = await conveyor.file.read('/path')          // string
const { data } = useConveyorQuery(['file', p], (c) => c.file.read(p))
```

`ctx` is available in every handler: `ctx.window` (the *calling* window, may be null), `ctx.sender`,
`ctx.event`. Input is always validated; output is validated in dev only.

## Add an event (main → renderer push)

```ts
// in a module
onProgress: event(z.number()),

// main — wire a source to the emitter, per window
const emit = createEmitter(fileModule, win)
downloader.on('progress', (p) => emit.onProgress(p))
```

```ts
// renderer
useConveyorEvent((c) => c.file.onProgress, (p) => setProgress(p))
```

## Add a cross-window store

```ts
// conveyor/stores/settings.ts  — pure reducers, safe to import anywhere
import { defineStore } from '@/lib/conveyor/define'

export const settingsStore = defineStore('settings', {
  state: { theme: 'dark' as 'light' | 'dark' },
  actions: { setTheme: (s, t: 'light' | 'dark') => { s.theme = t } },
})

// main — register once
registerStore(settingsStore)
```

```ts
// renderer — feels local, synced across every window
const theme = useConveyorStore(settingsStore, (s) => s.theme)   // re-renders only on theme
const { setTheme } = useConveyorActions(settingsStore)          // stable
setTheme('light')                                               // main mutates → broadcasts → all windows
```

## Errors

Failed procedures throw a `ConveyorError` in the renderer with a `code`
(`INVALID_INPUT` | `INVALID_OUTPUT` | `HANDLER_ERROR` | `UNKNOWN_PROCEDURE`) and, for validation
failures, the Zod `issues`:

```ts
try {
  await conveyor.file.read(badPath)
} catch (e) {
  if (e instanceof ConveyorError && e.code === 'INVALID_INPUT') console.log(e.issues)
}
```

## Process boundary — the rules

- The renderer imports **only** `type AppRouter` from `conveyor/router.ts` (type-only → erased at
  build). No main runtime ever enters the renderer bundle.
- Store definitions must be **pure** (reducers only, no `electron`/`node` imports) so both processes
  can share them. Side effects belong in procedures, not store actions.
- Author with `@/lib/conveyor/define`; never import `@/lib/conveyor/main` from renderer code.

## Files

| File | Side | Responsibility |
| --- | --- | --- |
| `define.ts` | any | authoring primitives (`defineModule`/`procedure`/`event`/`defineStore`) |
| `types.ts` | any | shared types + client inference + error envelope |
| `dispatch.ts` | any | pure procedure dispatch (validate → resolve → validate) |
| `main.ts` | main | `createRouter` / `createEmitter` / `registerStore` (electron glue) |
| `store-main.ts` | main | store source of truth + broadcast |
| `client.ts` | renderer | typed Proxy client (unwraps the error envelope) |
| `hooks.ts` | renderer | `useConveyorQuery` / `useConveyorMutation` / `useConveyorEvent` |
| `store-client.ts` | renderer | `useConveyorStore` / `useConveyorActions` |
| `preload.ts` | preload | the two-function bridge (`invoke` + `subscribe`) |
