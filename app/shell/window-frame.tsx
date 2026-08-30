import { useEffect, useLayoutEffect, type ReactNode } from 'react'
import { conveyor } from '@/conveyor/client'
import { Titlebar } from './titlebar'
import { useWindowStore } from './window-store'
import { useThemeStore } from './theme-store'

/**
 * The app shell: themed titlebar + a scrollable content region. Hydrates window state from
 * `window.init()`, keeps focus/maximize live via the window module's push events, and applies the
 * light/dark theme. Wrap the app's content in this.
 */
export function WindowFrame({ title, children }: { title?: string; children: ReactNode }) {
  const setInit = useWindowStore((s) => s.setInit)
  const setFocused = useWindowStore((s) => s.setFocused)
  const setMaximized = useWindowStore((s) => s.setMaximized)
  const theme = useThemeStore((s) => s.theme)

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    conveyor.window
      .init()
      .then((i) => setInit({ platform: i.platform, minimizable: i.minimizable, maximizable: i.maximizable }))
  }, [setInit])

  conveyor.window.onFocusChange.useEvent(setFocused)
  conveyor.window.onMaximizeChange.useEvent(setMaximized)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Titlebar title={title} />
      <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
