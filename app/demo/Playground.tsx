import { useState } from 'react'
import { useConveyorEvent } from '@/conveyor/client'
import { PAGES } from './registry'
import { Sidebar } from './Sidebar'
import { Toaster, useToasts } from './components/toast'

/**
 * The playground - a sidebar-nav tour of every conveyor primitive, each a live demo plus its code.
 * Strippable: delete this `app/demo/` folder and the `<Playground/>` in App.tsx.
 */
export function Playground() {
  const [active, setActive] = useState('overview')
  const Page = (PAGES.find((p) => p.id === active) ?? PAGES[0]).component

  // Any broadcast lands as a toast in every window, whatever page it's on.
  useConveyorEvent(
    (c) => c.notify.onNotify,
    (message) => useToasts.getState().show(message)
  )

  return (
    <div className="flex h-full">
      <Sidebar active={active} onSelect={setActive} />
      <div className="min-w-0 flex-1 overflow-auto">
        <Page onNavigate={setActive} />
      </div>
      <Toaster />
    </div>
  )
}
