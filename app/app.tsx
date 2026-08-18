import { WindowFrame } from './shell'
import './styles/app.css'

/**
 * App root — the core shell. The playground mounts inside `WindowFrame` in Phase 3; strip it and
 * this is your clean starting point (themed titlebar + conveyor wired, nothing else).
 */
export default function App() {
  return (
    <WindowFrame title="Electron React App">
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">App shell ready — playground mounts here.</p>
      </div>
    </WindowFrame>
  )
}
