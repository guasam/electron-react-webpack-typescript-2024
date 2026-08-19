export interface Snippet {
  file: string
  code: string
  output: string
}

/** Focused, illustrative source behind each capability, shown in the code drawer. */
export const SNIPPETS: Record<string, Snippet> = {
  overview: {
    file: 'conveyor/router.ts',
    code: `export const router = createRouter({
  window: windowModule,
  web: webModule,
  ...demoModules,          // the playground's features
}, { createContext })

// the renderer infers its whole typed client from just:
export type AppRouter = typeof router`,
    output: 'one typed surface · zero channel strings',
  },
  stream: {
    file: 'conveyor/demo/modules/stream.ts',
    code: `respond: procedure()
  .input(z.string())
  .stream(async function* ({ input, signal }) {
    for (const token of reply(input)) {
      if (signal.aborted) return       // cancellation, built in
      yield token
    }
  })

// renderer: consume like any async iterable
for await (const token of conveyor.stream.respond(prompt)) {
  append(token)
}`,
    output: 'streaming · tokens flowing',
  },
  files: {
    file: 'conveyor/demo/modules/files.ts',
    code: `open: procedure().handle(async ({ ctx }) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(ctx.window, {
    properties: ['openFile'],
    filters: [{ name: 'Text', extensions: ['txt', 'md', 'json'] }],
  })
  if (canceled) return null
  return { name: basename(filePaths[0]), content: await readFile(filePaths[0]) }
})

const file = await conveyor.files.open()   // fully typed`,
    output: 'read ~/notes.md · 4.2 KB',
  },
  events: {
    file: 'conveyor/demo/modules/notify.ts',
    code: `onNotify: event(z.string()),

broadcast: procedure().input(z.string()).handle(({ input }) => {
  createEmitter(notifyModule, windows.broadcast).onNotify(input)
})

// renderer: every window subscribes once
useConveyorEvent((c) => c.notify.onNotify, (msg) => toast(msg))`,
    output: 'broadcast · every window notified',
  },
  system: {
    file: 'conveyor/demo/modules/system.ts',
    code: `info: procedure().handle(() => ({
  cpuCount: os.cpus().length,
  totalMem: os.totalmem(),
  freeMem: os.freemem(),
}))

// renderer: cached + auto-refreshing via TanStack Query
const info = useConveyorQuery(['system', 'info'],
  (c) => c.system.info(), { refetchInterval: 1500 })`,
    output: 'sampled every 1.5s',
  },
  store: {
    file: 'conveyor/demo/stores/shared.ts',
    code: `export const sharedStore = defineStore('shared', {
  state: { notes: [] as string[] },
  actions: { add: (s, note: string) => { s.notes.push(note) } },
})

// renderer: feels local, synced across every window
const notes = useConveyorStore(sharedStore, (s) => s.notes)
const { add } = useConveyorActions(sharedStore)`,
    output: 'store synced across windows',
  },
  secure: {
    file: 'conveyor/demo/modules/secure.ts',
    code: `const requireUnlocked = middleware(({ next }) => {
  if (!unlocked) throw new Error('Locked')
  return next()
})

readSecret: procedure()
  .use(timed)              // wrap: log duration
  .use(requireUnlocked)    // guard: block unless unlocked
  .handle(({ ctx }) => ({ secret, bootedAt: ctx.appStartedAt }))`,
    output: 'guard passed · secret served',
  },
}
