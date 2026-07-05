import { describe, it, expect } from 'vitest'
import { defineStore } from './store'

const counter = defineStore('counter', {
  state: { count: 0, updatedBy: 'init' as string },
  actions: {
    increment: (s, by: number = 1) => {
      s.count += by
      s.updatedBy = 'increment'
    },
    reset: (s) => {
      s.count = 0
      s.updatedBy = 'reset'
    },
  },
})

describe('defineStore', () => {
  it('captures id, initial state, and actions', () => {
    expect(counter.id).toBe('counter')
    expect(counter.initialState).toEqual({ count: 0, updatedBy: 'init' })
    expect(Object.keys(counter.actions)).toEqual(['increment', 'reset'])
  })

  it('reducers mutate the draft (pure, deterministic)', () => {
    const state = structuredClone(counter.initialState)
    counter.actions.increment(state, 5)
    expect(state).toEqual({ count: 5, updatedBy: 'increment' })
    counter.actions.reset(state)
    expect(state).toEqual({ count: 0, updatedBy: 'reset' })
  })

  it('does not mutate the definition initialState', () => {
    const state = structuredClone(counter.initialState)
    counter.actions.increment(state, 3)
    expect(counter.initialState.count).toBe(0)
  })
})
