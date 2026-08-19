import { useState } from 'react'
import { Code2 } from 'lucide-react'
import { useConveyorEvent } from '@/conveyor/client'
import { PAGES } from './registry'
import { Sidebar } from './Sidebar'
import { CodeDrawer } from './CodeDrawer'
import { Toaster, useToasts } from './components/toast'

/**
 * The playground: sidebar + capability, with an overlay code drawer for the source behind each one.
 * Strippable: delete this `app/demo/` folder and the `<Playground/>` in App.tsx.
 */
export function Playground() {
  const [active, setActive] = useState('overview')
  const [codeOpen, setCodeOpen] = useState(false)
  const Page = (PAGES.find((p) => p.id === active) ?? PAGES[0]).component

  // Any broadcast lands as a toast in every window, whatever page it's on.
  useConveyorEvent(
    (c) => c.notify.onNotify,
    (message) => useToasts.getState().show(message)
  )

  return (
    <div className="flex h-full min-h-0">
      <Sidebar active={active} onSelect={setActive} />

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <Page onNavigate={setActive} />
        </div>

        {!codeOpen && (
          <button
            onClick={() => setCodeOpen(true)}
            className="absolute right-4 bottom-4 z-20 flex items-center gap-2 rounded-lg border border-border bg-card/95 px-3 py-2 text-[12px] font-medium shadow-lg backdrop-blur transition-colors hover:border-brand"
          >
            <Code2 className="size-4 text-brand" /> View code
          </button>
        )}

        <CodeDrawer capabilityId={active} open={codeOpen} onClose={() => setCodeOpen(false)} />
      </div>

      <Toaster />
    </div>
  )
}
