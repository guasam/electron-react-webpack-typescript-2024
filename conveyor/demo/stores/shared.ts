import { defineStore } from 'electron-conveyor/define'

/** A cross-window store: a shared notes list that stays in sync across every open window. */
export const sharedStore = defineStore('shared', {
  state: { count: 0, notes: [] as string[] },
  actions: {
    increment: (s, by: number = 1) => {
      s.count += by
    },
    decrement: (s, by: number = 1) => {
      s.count -= by
    },
    add: (s, note: string) => {
      const trimmed = note.trim()
      if (trimmed) s.notes.push(trimmed)
    },
    remove: (s, index: number) => {
      s.notes.splice(index, 1)
    },
    clear: (s) => {
      s.notes = []
    },
  },
})
