import { useState } from 'react'
import { PAGES } from './registry'
import { Sidebar } from './Sidebar'

/**
 * The playground — a sidebar-nav tour of every conveyor primitive, each a live demo + its code.
 * Strippable: delete this `app/playground/` folder and the `<Playground/>` in App.tsx.
 */
export function Playground() {
  const [active, setActive] = useState('overview')
  const Page = (PAGES.find((p) => p.id === active) ?? PAGES[0]).component

  return (
    <div className="flex h-full">
      <Sidebar active={active} onSelect={setActive} />
      <div className="min-w-0 flex-1 overflow-auto">
        <Page onNavigate={setActive} />
      </div>
    </div>
  )
}
