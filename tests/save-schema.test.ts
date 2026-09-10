import { describe, expect, it } from 'vitest'
import { DEFAULT_SAVE, isGameSave } from '../src/save/SaveSchema'

describe('save schema', () => {
  it('accepts the current default save', () => expect(isGameSave(DEFAULT_SAVE)).toBe(true))
  it('rejects an unknown save version', () => expect(isGameSave({ ...DEFAULT_SAVE, saveVersion: 99 })).toBe(false))
  it('rejects invalid character states', () => expect(isGameSave({ ...DEFAULT_SAVE, character: { ...DEFAULT_SAVE.character, state: 'flying' } })).toBe(false))
  it('stocks the starter fridge in the default save', () => expect(DEFAULT_SAVE.fridge).toEqual(['milk_01', 'strawberry_01', 'ice_cream_01']))
})
