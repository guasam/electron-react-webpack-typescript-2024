import { useState } from 'react'
import { Plus, X, PanelLeftOpen } from 'lucide-react'
import { useConveyorStore, useConveyorActions } from 'electron-conveyor/renderer'
import { conveyor } from '@/conveyor/client'
import { sharedStore } from '@/conveyor/demo/stores/shared'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card } from '@/app/components/ui/card'
import { PageShell } from '../components/PageShell'

export function StorePage() {
  const notes = useConveyorStore(sharedStore, (s) => s.notes)
  const { add, remove, clear } = useConveyorActions(sharedStore)
  const [text, setText] = useState('')

  const submit = () => {
    const note = text.trim()
    if (!note) return
    add(note)
    // Nudge the other windows so they notice even on a different page.
    conveyor.notify.toOthers(`New note added: "${note}"`)
    setText('')
  }

  return (
    <PageShell
      badge="Cross-window store · defineStore"
      title="Shared state across windows"
      description="Main owns the state; every window mirrors it live. Open a second window and watch edits sync both ways instantly."
    >
      <Card className="gap-0 p-4">
        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Add a note..."
          />
          <Button onClick={submit}>
            <Plus className="size-4" /> Add
          </Button>
          <Button variant="outline" onClick={() => conveyor.windows.open()}>
            <PanelLeftOpen className="size-4" /> Open 2nd window
          </Button>
        </div>

        <ul className="mt-4 space-y-1.5">
          {notes.length === 0 ? (
            <li className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
              No notes yet. Add one, then open a second window.
            </li>
          ) : (
            notes.map((note, i) => (
              <li key={i} className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm">
                <span className="flex-1">{note}</span>
                <button
                  onClick={() => remove(i)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Remove"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))
          )}
        </ul>
        {notes.length > 0 && (
          <button onClick={() => clear()} className="mt-3 w-fit text-xs text-muted-foreground hover:text-foreground">
            Clear all
          </button>
        )}
      </Card>
    </PageShell>
  )
}
