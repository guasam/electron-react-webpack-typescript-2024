import { useState } from 'react'
import { Megaphone, PanelLeftOpen } from 'lucide-react'
import { conveyor } from '@/conveyor/client'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card } from '@/app/components/ui/card'
import { PageShell } from '../components/PageShell'
import { CodeBlock } from '../components/CodeBlock'

const CODE = `// main - a typed event, fanned out to windows via the window manager
onNotify: event(z.string()),
broadcast: procedure().input(z.string()).handle(({ input }) => {
  createEmitter(notifyModule, windows.broadcast).onNotify(input)
}),

// renderer - subscribe once; every window shows the message
useConveyorEvent((c) => c.notify.onNotify, (msg) => toast(msg))`

export function EventsPage() {
  const [message, setMessage] = useState('Hello from another window')

  const send = () => {
    if (message.trim()) conveyor.notify.broadcast(message.trim())
  }

  return (
    <PageShell
      badge="Events · event()"
      title="Broadcast across windows"
      description="Main pushes typed events to the renderer. Send a broadcast and every open window shows a toast, whatever page it's on. Open a second window to watch the fan-out."
    >
      <Card className="gap-0 p-4">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type a message to broadcast..."
          />
          <Button onClick={send}>
            <Megaphone className="size-4" /> Send to all windows
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => conveyor.windows.open()}>
            <PanelLeftOpen className="size-4" /> Open 2nd window
          </Button>
          <span className="text-xs text-muted-foreground">
            then broadcast from either one; a toast appears in both.
          </span>
        </div>
      </Card>
      <CodeBlock code={CODE} caption="conveyor/demo/modules/notify.ts" />
    </PageShell>
  )
}
