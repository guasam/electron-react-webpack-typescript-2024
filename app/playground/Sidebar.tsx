import { cn } from '@/lib/utils'
import { PAGES } from './registry'

export function Sidebar({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <nav className="flex w-56 shrink-0 flex-col border-r border-border bg-muted/20 p-3">
      <div className="px-2.5 pb-3 text-sm font-semibold tracking-tight">
        Conveyor <span className="font-normal text-muted-foreground">playground</span>
      </div>
      <div className="flex flex-col gap-0.5">
        {PAGES.map((p) => {
          const Icon = p.icon
          const isActive = active === p.id
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors',
                isActive
                  ? 'bg-accent font-medium text-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {p.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
