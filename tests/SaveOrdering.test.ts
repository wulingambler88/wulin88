import { afterEach, describe, expect, it, vi } from 'vitest'
import { SaveManager } from '../src/save/SaveManager'
describe('save ordering', () => {
  afterEach(() => vi.useRealTimers())
  it('does not overwrite an immediate gift with an older deferred snapshot', () => {
    vi.useFakeTimers()
    let raw: string | null = null
    const manager = new SaveManager({getItem: () => raw, setItem: (_key,value) => {raw=value}})
    const old = manager.createDefault()
    manager.scheduleSave(old)
    const updated = structuredClone(old); updated.starCoins += 25
    manager.save(updated)
    vi.runAllTimers()
    expect(manager.load().starCoins).toBe(updated.starCoins)
  })
})
