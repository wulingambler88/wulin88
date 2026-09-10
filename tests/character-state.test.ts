import { describe, expect, it } from 'vitest'
import { CharacterState } from '../src/characters/CharacterState'

describe('CharacterState', () => {
  it('supports sitting and sleeping transitions', () => {
    const state = new CharacterState()
    expect(state.transition('sitting')).toBe(true)
    expect(state.value).toBe('sitting')
    expect(state.transition('sleeping')).toBe(true)
    expect(state.value).toBe('sleeping')
  })

  it('locks fully while eating until the reaction finishes', () => {
    const state = new CharacterState()
    expect(state.transition('eating')).toBe(true)
    expect(state.transition('playing')).toBe(false)
    expect(state.transition('standing')).toBe(false)
    expect(state.transition('sitting')).toBe(false)
    expect(state.isBusy).toBe(true)
    expect(state.value).toBe('eating')
    state.finishReaction()
    expect(state.value).toBe('standing')
    expect(state.isBusy).toBe(false)
  })
})
