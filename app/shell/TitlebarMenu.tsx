import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { MENUS } from './menu'

/** A lightweight File/Edit/View menu for the custom titlebar. Click to open, hover to switch. */
export function TitlebarMenu() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click or Escape while open.
  useEffect(() => {
    if (openIndex === null) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenIndex(null)
    }
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpenIndex(null)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onEsc)
    }
  }, [openIndex])

  return (
    <div ref={ref} className="flex items-center [-webkit-app-region:no-drag]">
      {MENUS.map((menu, i) => (
        <div key={menu.label} className="relative">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            onMouseEnter={() => openIndex !== null && setOpenIndex(i)}
            className={cn(
              'rounded px-2 py-1 text-[13px] transition-colors',
              openIndex === i
                ? 'bg-accent text-foreground'
                : 'text-foreground/70 hover:bg-accent/60 hover:text-foreground'
            )}
          >
            {menu.label}
          </button>
          {openIndex === i && (
            <div className="animate-in fade-in slide-in-from-top-1 absolute top-full left-0 z-50 mt-1 min-w-60 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg">
              {menu.items.map((item, j) =>
                item.separator ? (
                  <div key={j} className="my-1 h-px bg-border" />
                ) : (
                  <button
                    key={j}
                    onClick={() => {
                      item.action?.()
                      setOpenIndex(null)
                    }}
                    className="flex w-full items-center justify-between gap-8 rounded-sm px-2.5 py-1.5 text-[13px] whitespace-nowrap transition-colors hover:bg-accent"
                  >
                    <span>{item.label}</span>
                    {item.shortcut && <span className="text-xs text-muted-foreground">{item.shortcut}</span>}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
