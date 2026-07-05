import { useEffect, useState } from 'react'
import { conveyor, useConveyorQuery, useConveyorEvent } from '@/app/lib/conveyor'
import { useConveyorStore } from 'electron-conveyor/renderer'
import { counterStore } from '@/conveyor/stores/counter'
import './styles/app.css'

// Per-window tag so the two PoC windows are distinguishable in the console.
const WIN = Math.random().toString(36).slice(2, 6)

/**
 * Conveyor v2 proof-of-concept. Exercises every primitive end-to-end:
 *  - useConveyorQuery  → renderer→main request/response (app.version, window.init)
 *  - procedure calls   → renderer→main actions (window.minimize/close, web.openUrl)
 *  - useConveyorEvent  → main→renderer push (window.onFocusChange / onMaximizeChange)
 */
export default function App() {
  const version = useConveyorQuery(['app', 'version'], (c) => c.app.version())
  const init = useConveyorQuery(['window', 'init'], (c) => c.window.init())

  const counter = useConveyorStore(counterStore)
  useEffect(() => {
    console.log(`[PoC store ${WIN}] count=${counter.count} (${counter.updatedBy})`)
  }, [counter.count, counter.updatedBy])

  const [focused, setFocused] = useState(true)
  const [maximized, setMaximized] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const push = (msg: string) => setLog((l) => [`${msg}`, ...l].slice(0, 8))

  // PoC verification logging (surfaces IPC round-trips in the console).
  useEffect(() => {
    if (version.data) console.log('[PoC] app.version() =>', version.data)
  }, [version.data])
  useEffect(() => {
    if (version.error) console.error('[PoC] app.version() error:', version.error)
  }, [version.error])
  useEffect(() => {
    if (init.data) console.log('[PoC] window.init() =>', JSON.stringify(init.data))
  }, [init.data])
  useEffect(() => {
    if (init.error) console.error('[PoC] window.init() error:', init.error)
  }, [init.error])

  useConveyorEvent(
    (c) => c.window.onFocusChange,
    (isFocused) => {
      setFocused(isFocused)
      push(`event: onFocusChange → ${isFocused}`)
      console.log('[PoC] event onFocusChange =>', isFocused)
    }
  )
  useConveyorEvent(
    (c) => c.window.onMaximizeChange,
    (isMax) => {
      setMaximized(isMax)
      push(`event: onMaximizeChange → ${isMax}`)
      console.log('[PoC] event onMaximizeChange =>', isMax)
    }
  )

  return (
    <div style={S.page}>
      <h1 style={S.h1}>Conveyor v2 — PoC</h1>

      <section style={S.card}>
        <h2 style={S.h2}>Query (renderer → main → back)</h2>
        <div style={S.row}>
          <span style={S.key}>app.version()</span>
          <span style={S.val}>{version.isPending ? '…' : version.error ? `⚠ ${version.error.message}` : version.data}</span>
        </div>
        <div style={S.row}>
          <span style={S.key}>window.init()</span>
          <span style={S.val}>{init.isPending ? '…' : init.error ? `⚠ ${init.error.message}` : JSON.stringify(init.data)}</span>
        </div>
      </section>

      <section style={S.card}>
        <h2 style={S.h2}>Push events (main → renderer)</h2>
        <div style={S.row}>
          <span style={S.key}>focused</span>
          <span style={{ ...S.badge, background: focused ? '#1f7a3d' : '#7a1f1f' }}>{String(focused)}</span>
        </div>
        <div style={S.row}>
          <span style={S.key}>maximized</span>
          <span style={{ ...S.badge, background: maximized ? '#1f7a3d' : '#3a3a3a' }}>{String(maximized)}</span>
        </div>
        <p style={S.hint}>Click another window to blur, then back — the focused badge flips via a push event.</p>
      </section>

      <section style={S.card}>
        <h2 style={S.h2}>Conveyor store (synced across all windows) · win {WIN}</h2>
        <div style={S.row}>
          <span style={S.key}>counter.count</span>
          <span style={{ ...S.badge, background: '#334', fontSize: 16 }}>{counter.count}</span>
        </div>
        <div style={S.btnRow}>
          <button style={S.btn} onClick={() => counter.increment(1)}>+1</button>
          <button style={S.btn} onClick={() => counter.decrement(1)}>-1</button>
          <button style={{ ...S.btn, background: '#555' }} onClick={() => counter.reset()}>reset</button>
        </div>
        <p style={S.hint}>Open two windows — changing the count in one updates the other instantly.</p>
      </section>

      <section style={S.card}>
        <h2 style={S.h2}>Procedure actions (renderer → main)</h2>
        <div style={S.btnRow}>
          <button style={S.btn} onClick={() => conveyor.window.minimize()}>Minimize</button>
          <button style={S.btn} onClick={() => conveyor.window.maximizeToggle()}>Maximize toggle</button>
          <button style={S.btn} onClick={() => conveyor.web.openUrl('https://github.com/guasam/electron-react-app')}>Open repo</button>
          <button style={{ ...S.btn, background: '#7a1f1f' }} onClick={() => conveyor.window.close()}>Close</button>
        </div>
      </section>

      <section style={S.card}>
        <h2 style={S.h2}>Event log</h2>
        <ul style={S.logList}>
          {log.length === 0 && <li style={S.hint}>No events yet.</li>}
          {log.map((line, i) => (
            <li key={i} style={S.logLine}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'system-ui, sans-serif', color: '#e6e6e6', background: '#1c1c1c', minHeight: '100vh', padding: 24, boxSizing: 'border-box' },
  h1: { fontSize: 20, fontWeight: 700, margin: '0 0 16px' },
  h2: { fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: '#9a9a9a', margin: '0 0 10px' },
  card: { background: '#262626', border: '1px solid #333', borderRadius: 10, padding: 16, marginBottom: 14 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 14 },
  key: { color: '#9ecbff', fontFamily: 'monospace' },
  val: { fontFamily: 'monospace', color: '#e6e6e6', maxWidth: '65%', textAlign: 'right', wordBreak: 'break-all' },
  badge: { fontFamily: 'monospace', fontSize: 12, padding: '2px 10px', borderRadius: 999, color: '#fff' },
  btnRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  btn: { background: '#3355dd', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer' },
  hint: { color: '#8a8a8a', fontSize: 12, margin: '8px 0 0' },
  logList: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 },
  logLine: { fontFamily: 'monospace', fontSize: 12, color: '#c9c9c9' },
}
