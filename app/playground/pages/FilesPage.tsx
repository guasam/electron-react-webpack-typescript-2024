import { useState } from 'react'
import { FolderOpen } from 'lucide-react'
import { conveyor } from '@/conveyor/client'
import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { PageShell } from '../components/PageShell'
import { CodeBlock } from '../components/CodeBlock'
import { formatBytes } from '../components/format'

type FileResult = Awaited<ReturnType<typeof conveyor.files.open>>

const CODE = `open: procedure()
  .handle(async ({ ctx }) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(ctx.window, {
      properties: ['openFile'],
    })
    if (canceled) return null
    return { name: basename(filePaths[0]), content: await readFile(filePaths[0], 'utf-8') }
  })

// renderer — fully typed, no channel strings
const file = await conveyor.files.open()`

export function FilesPage() {
  const [file, setFile] = useState<FileResult>(null)
  const [loading, setLoading] = useState(false)

  const open = async () => {
    setLoading(true)
    try {
      setFile(await conveyor.files.open())
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell
      badge="Procedure · .handle()"
      title="Native file access"
      description="A typed renderer→main procedure that opens the OS file picker and reads the chosen file — native integration with no channel strings and no manual preload wiring."
    >
      <Card className="gap-0 p-4">
        <Button onClick={open} disabled={loading} className="w-fit">
          <FolderOpen className="size-4" /> {loading ? 'Opening…' : 'Open a file…'}
        </Button>
        {file && (
          <div className="mt-4 space-y-2">
            <div className="text-sm">
              <span className="font-medium">{file.name}</span>
              <span className="text-muted-foreground">
                {' · '}
                {formatBytes(file.size)}
                {file.truncated && ' · preview truncated'}
              </span>
            </div>
            <pre className="max-h-72 overflow-auto rounded-lg bg-muted/40 p-3 text-xs leading-relaxed">
              {file.content || '(empty file)'}
            </pre>
          </div>
        )}
      </Card>
      <CodeBlock code={CODE} caption="conveyor/demo/modules/files.ts" />
    </PageShell>
  )
}
