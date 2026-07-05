import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createConveyorClient } from './client'
import { ConveyorError } from './errors'
import type { ConveyorBridge } from './client'
import type { Router } from './types'

// Minimal router shape for typing; the client is a Proxy and carries no runtime metadata.
type TestRouter = Router

function mockBridge(invoke: ConveyorBridge['invoke']) {
  const subscribe = vi.fn<ConveyorBridge['subscribe']>(() => () => {})
  ;(globalThis as unknown as { window: { conveyor: ConveyorBridge } }).window = {
    conveyor: { invoke, subscribe },
  }
  return { subscribe }
}

describe('createConveyorClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('marshals a call into invoke(channel, method, ...args) and unwraps { ok }', async () => {
    const invoke = vi.fn(async () => ({ ok: true, data: 'HI' }))
    mockBridge(invoke as unknown as ConveyorBridge['invoke'])

    const client = createConveyorClient<TestRouter>() as never as {
      web: { openUrl: (u: string) => Promise<string> }
    }
    const result = await client.web.openUrl('x')

    expect(result).toBe('HI')
    expect(invoke).toHaveBeenCalledWith('conveyor:web', 'openUrl', 'x')
  })

  it('throws a ConveyorError carrying code + issues on { ok: false }', async () => {
    const invoke = vi.fn(async () => ({
      ok: false,
      error: { code: 'INVALID_INPUT', message: 'bad', issues: [{ path: ['x'] }] },
    }))
    mockBridge(invoke as unknown as ConveyorBridge['invoke'])

    const client = createConveyorClient<TestRouter>() as never as {
      file: { read: (p: string) => Promise<string> }
    }

    await expect(client.file.read('p')).rejects.toMatchObject({
      name: 'ConveyorError',
      code: 'INVALID_INPUT',
      message: 'bad',
    })
    await expect(client.file.read('p')).rejects.toBeInstanceOf(ConveyorError)
  })

  it('caches module + method members for referential stability', () => {
    mockBridge((async () => ({ ok: true, data: null })) as unknown as ConveyorBridge['invoke'])
    const client = createConveyorClient<TestRouter>() as never as Record<string, Record<string, unknown>>
    expect(client.window).toBe(client.window)
    expect(client.window.minimize).toBe(client.window.minimize)
  })

  it('wires .subscribe to the event channel', () => {
    const { subscribe } = mockBridge((async () => ({ ok: true, data: null })) as unknown as ConveyorBridge['invoke'])
    const client = createConveyorClient<TestRouter>() as never as {
      window: { onFocusChange: { subscribe: (cb: (p: boolean) => void) => () => void } }
    }
    const cb = () => {}
    client.window.onFocusChange.subscribe(cb)
    expect(subscribe).toHaveBeenCalledWith('conveyor:event:window:onFocusChange', cb)
  })
})
