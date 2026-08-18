import { defineStore } from 'electron-conveyor/define'

/** A cross-window store: a shared notes list that stays in sync across every open window. */
export const sharedStore = defineStore('shared', {
  state: { notes: [] as string[] },
  actions: {
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
