import { describe, expect, it } from 'vitest'
import { SaveManager, type StorageLike } from '../src/save/SaveManager'
import { DEFAULT_SAVE, SAVE_VERSION } from '../src/save/SaveSchema'

function memoryStorage(): StorageLike {
  const values = new Map<string, string>()
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value) } }
}

describe('SaveManager', () => {
  it('creates, serializes, and deserializes a default save', () => {
    const manager = new SaveManager(memoryStorage())
    const created = manager.createDefault()
    expect(created.saveVersion).toBe(SAVE_VERSION)
    expect(manager.deserialize(manager.serialize(created))).toEqual(created)
  })

  it('saves and loads without losing state', () => {
    const manager = new SaveManager(memoryStorage())
    const save = structuredClone(DEFAULT_SAVE)
    save.character.stats.hunger = 94
    save.inventory.apple_01 = 3
    manager.save(save)
    expect(manager.load().character.stats.hunger).toBe(94)
    expect(manager.load().inventory.apple_01).toBe(3)
  })

  it('migrates the original version and rejects unknown versions', () => {
    const manager = new SaveManager(memoryStorage())
    const old = JSON.stringify({ saveVersion: 1, starCoins: 50, currentLocation: 'home', character: { x: 25, y: 30, pose: 'sitting', zoneId: 'chair' } })
    expect(manager.deserialize(old)?.character.state).toBe('sitting')
    expect(manager.deserialize(JSON.stringify({ saveVersion: 99 }))).toBeUndefined()
  })
})
