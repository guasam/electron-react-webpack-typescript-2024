import { nativeTheme, powerMonitor, type BrowserWindow } from 'electron'
import os from 'node:os'
import { z } from 'zod'
import { defineModule, procedure, event } from '../../init'
import { createEmitter } from 'electron-conveyor/main'

/**
 * System integration — a `info` query for a live monitor, plus main→renderer push events for real OS
 * signals (appearance + power). Wire the events per window with `setupSystemEvents`.
 */
export const systemModule = defineModule('system', {
  info: procedure()
    .output(
      z.object({
        platform: z.string(),
        arch: z.string(),
        release: z.string(),
        cpuModel: z.string(),
        cpuCount: z.number(),
        totalMem: z.number(),
        freeMem: z.number(),
        loadAvg: z.array(z.number()),
        uptime: z.number(),
      })
    )
    .handle(() => {
      const cpus = os.cpus()
      return {
        platform: process.platform,
        arch: process.arch,
        release: os.release(),
        cpuModel: cpus[0]?.model ?? 'unknown',
        cpuCount: cpus.length,
        totalMem: os.totalmem(),
        freeMem: os.freemem(),
        loadAvg: os.loadavg(),
        uptime: os.uptime(),
      }
    }),

  // main → renderer push: the OS appearance and power state changing under the app.
  onThemeChange: event(z.enum(['light', 'dark'])),
  onPowerChange: event(z.enum(['ac', 'battery'])),
})

/** Wire this window to the OS appearance + power events. Call once per window. */
export function setupSystemEvents(win: BrowserWindow): void {
  const emit = createEmitter(systemModule, win)

  const emitTheme = () => emit.onThemeChange(nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
  nativeTheme.on('updated', emitTheme)

  const emitPower = () => {
    try {
      emit.onPowerChange(powerMonitor.isOnBatteryPower() ? 'battery' : 'ac')
    } catch {
      // isOnBatteryPower can throw on systems without a battery — ignore.
    }
  }
  powerMonitor.on('on-ac', emitPower)
  powerMonitor.on('on-battery', emitPower)
}
