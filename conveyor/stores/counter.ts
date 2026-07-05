import { defineStore } from '@/lib/conveyor/define'

/** Demo cross-window store. Pure reducers — safe to import in both main and renderer. */
export const counterStore = defineStore('counter', {
  state: { count: 0, updatedBy: 'init' as string },
  actions: {
    increment: (s, by: number = 1) => {
      s.count += by
      s.updatedBy = 'increment'
    },
    decrement: (s, by: number = 1) => {
      s.count -= by
      s.updatedBy = 'decrement'
    },
    reset: (s) => {
      s.count = 0
      s.updatedBy = 'reset'
    },
  },
})
