import { app } from 'electron'
import os from 'node:os'
import { z } from 'zod'
import { defineModule, procedure } from '../../init'

/** System integration - a typed query reading real main-process info for a live monitor. */
export const systemModule = defineModule('system', {
  info: procedure()
    .output(
      z.object({
        version: z.string(),
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
        version: app.getVersion(),
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
})
