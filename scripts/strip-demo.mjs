#!/usr/bin/env node
/**
 * Strip the playground from the template, leaving the minimal shell (titlebar, window/web modules,
 * theme) ready for a real app:
 *
 *   npm run strip-demo
 *
 * Deletes `conveyor/demo/` + `app/demo/`, removes every line marked `// @demo`, and replaces
 * `app/app.tsx` with a minimal root. Idempotent; run `npm run lint` afterwards to tidy up.
 */
import { rmSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const log = (msg) => console.log(`  ${msg}`)

// 1. The demo folders.
for (const dir of ['conveyor/demo', 'app/demo']) {
  if (existsSync(join(root, dir))) {
    rmSync(join(root, dir), { recursive: true })
    log(`deleted ${dir}/`)
  }
}

// 2. Every line marked `// @demo` (the demo import + spread + stores in conveyor/router.ts).
for (const file of ['conveyor/router.ts']) {
  const path = join(root, file)
  if (!existsSync(path)) continue
  const before = readFileSync(path, 'utf8')
  const after = before
    .split('\n')
    .filter((line) => !line.includes('// @demo'))
    .join('\n')
  if (after !== before) {
    writeFileSync(path, after)
    log(`cleaned ${file}`)
  }
}

// 3. A minimal app root in place of the playground.
const appTsx = join(root, 'app/app.tsx')
if (readFileSync(appTsx, 'utf8').includes('Playground')) {
  writeFileSync(
    appTsx,
    `import { WindowFrame } from './shell'
import './styles/app.css'

export default function App() {
  return (
    <WindowFrame title="Electron React App">
      <main className="flex h-full items-center justify-center text-muted-foreground">
        Your app starts here.
      </main>
    </WindowFrame>
  )
}
`
  )
  log('reset app/app.tsx')
}

console.log('\nPlayground stripped. Run `npm run lint` and `npm run dev` to verify.')
