import { useState } from 'react'
import { Moon, Sun, Plug, BatteryCharging } from 'lucide-react'
import { useConveyorEvent } from '@/conveyor/client'
import { Card } from '@/app/components/ui/card'
import { PageShell } from '../components/PageShell'
import { CodeBlock } from '../components/CodeBlock'

const CODE = `// main — declare the channel, then push when the OS changes
onThemeChange: event(z.enum(['light', 'dark'])),
nativeTheme.on('updated', () =>
  emit.onThemeChange(nativeTheme.shouldUseDarkColors ? 'dark' : 'light'))

// renderer — subscribe for the component's lifetime
useConveyorEvent((c) => c.system.onThemeChange, (theme) => setOsTheme(theme))`

export function EventsPage() {
  const [osTheme, setOsTheme] = useState<'light' | 'dark' | null>(null)
  const [power, setPower] = useState<'ac' | 'battery' | null>(null)
  const [log, setLog] = useState<string[]>([])
  const push = (msg: string) => setLog((l) => [msg, ...l].slice(0, 8))

  useConveyorEvent(
    (c) => c.system.onThemeChange,
    (t) => {
      setOsTheme(t)
      push(`OS appearance → ${t}`)
    }
  )
  useConveyorEvent(
    (c) => c.system.onPowerChange,
    (p) => {
      setPower(p)
      push(`power → ${p === 'ac' ? 'plugged in' : 'on battery'}`)
    }
  )

  return (
    <PageShell
      badge="Events · event()"
      title="Live system events"
      description="main→renderer push over typed channels. Change your OS appearance (light/dark) or plug/unplug power, and the app reacts in real time — no polling."
    >
      <div className="grid grid-cols-2 gap-4">
        <Signal
          label="OS appearance"
          value={osTheme ?? 'waiting…'}
          icon={osTheme === 'dark' ? <Moon className="size-5" /> : <Sun className="size-5" />}
        />
        <Signal
          label="Power source"
          value={power ? (power === 'ac' ? 'plugged in' : 'on battery') : 'waiting…'}
          icon={power === 'battery' ? <BatteryCharging className="size-5" /> : <Plug className="size-5" />}
        />
      </div>
      <Card className="gap-0 p-4">
        <div className="mb-2 text-xs font-medium text-muted-foreground">Event log</div>
        <ul className="space-y-1 font-mono text-xs text-foreground/80">
          {log.length === 0 ? (
            <li className="text-muted-foreground">Toggle your OS theme to see an event arrive…</li>
          ) : (
            log.map((line, i) => <li key={i}>{line}</li>)
          )}
        </ul>
      </Card>
      <CodeBlock code={CODE} caption="conveyor/demo/modules/system.ts" />
    </PageShell>
  )
}

function Signal({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="flex-row items-center gap-3 p-4">
      <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground/70">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium capitalize">{value}</div>
      </div>
    </Card>
  )
}
