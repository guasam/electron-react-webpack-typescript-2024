import { dialog } from 'electron'
import { readFile, stat } from 'node:fs/promises'
import { basename } from 'node:path'
import { z } from 'zod'
import { defineModule, procedure } from '../../init'

const MAX_PREVIEW = 100_000

/** Native file access — a typed procedure that opens the OS file picker and reads the chosen file. */
export const filesModule = defineModule('files', {
  open: procedure()
    .output(
      z
        .object({
          name: z.string(),
          path: z.string(),
          size: z.number(),
          content: z.string(),
          truncated: z.boolean(),
        })
        .nullable()
    )
    .handle(async ({ ctx }) => {
      const result = ctx.window
        ? await dialog.showOpenDialog(ctx.window, { properties: ['openFile'] })
        : await dialog.showOpenDialog({ properties: ['openFile'] })
      const path = result.filePaths[0]
      if (result.canceled || !path) return null

      const info = await stat(path)
      const buf = await readFile(path)
      return {
        name: basename(path),
        path,
        size: info.size,
        content: buf.subarray(0, MAX_PREVIEW).toString('utf-8'),
        truncated: info.size > MAX_PREVIEW,
      }
    }),
})
