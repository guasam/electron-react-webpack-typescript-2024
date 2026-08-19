import { ArrowRight } from 'lucide-react'
import { Card } from '@/app/components/ui/card'
import { PageShell } from '../components/PageShell'
import { PAGES, type PageProps } from '../registry'

export function Overview({ onNavigate }: PageProps) {
  const primitives = PAGES.filter((p) => p.group === 'primitives')

  return (
    <PageShell
      badge="electron-conveyor"
      title="Conveyor playground"
      description="Type-safe IPC and cross-window state for Electron, with one source of truth per feature and end-to-end inference. Each page below is a real capability, live, with the code that drives it."
    >
      <div className="grid grid-cols-2 gap-3">
        {primitives.map((p) => {
          const Icon = p.icon
          return (
            <Card
              key={p.id}
              onClick={() => onNavigate(p.id)}
              className="group cursor-pointer flex-row items-center gap-3 p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground/70">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{p.label}</div>
                <div className="truncate text-xs text-muted-foreground">{p.blurb}</div>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Card>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        This whole playground is strippable: delete <code className="text-foreground/70">app/demo</code> and{' '}
        <code className="text-foreground/70">conveyor/demo</code>, remove a few marked lines, and you have a clean
        themed shell to build on.
      </p>
    </PageShell>
  )
}
