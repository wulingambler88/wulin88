import { describe, expect, it } from 'vitest'
import { SaveManager, type StorageLike } from '../src/save/SaveManager'
import { migrateSave, isGameSave, SAVE_VERSION, DEFAULT_SAVE } from '../src/save/SaveSchema'

function memoryStorage(initialData?: Record<string, string>): StorageLike {
  const values = new Map<string, string>(Object.entries(initialData ?? {}))
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value) },
  }
}

describe('Save Migration', () => {
  it('migrates a Prompt 2 V1 save retaining character, position, pose, starCoins and adding default new fields', () => {
    const v1Raw = {
      saveVersion: 1,
      starCoins: 350,
      currentLocation: 'home',
      character: {
        x: 120,
        y: 410,
        pose: 'sitting',
        zoneId: 'chair',
      },
    }

    const migrated = migrateSave(v1Raw)
    expect(migrated).toBeDefined()
    expect(migrated!.saveVersion).toBe(SAVE_VERSION)
    expect(migrated!.character.x).toBe(120)
    expect(migrated!.character.y).toBe(410)
    expect(migrated!.character.state).toBe('sitting')
    expect(migrated!.starCoins).toBe(350)
    expect(migrated!.unlockedLocations.clothing_boutique).toBe(true)
    expect(migrated!.unlockedLocations.supermarket).toBe(true)
    expect(migrated!.progress).toBeDefined()
    expect(isGameSave(migrated)).toBe(true)
  })

  it('migrates a V2 save retaining character and furniture adjustments', () => {
    const v2Raw = {
      saveVersion: 2,
      starCoins: 420,
      currentLocation: 'home',
      currentRoom: 1,
      character: {
        x: 620,
        y: 430,
        state: 'standing',
        equipped: { top: 'top_strawberry', bottom: 'bottom_mint', dress: null, hat: null, shoes: null, accessory: null },
        stats: { happiness: 85, energy: 90, hunger: 75, fun: 80 },
      },
      inventory: { apple_01: 2, teddy_01: 1 },
      furniture: [{ instanceId: 'chair_main', definitionId: 'chair_main', x: 355, y: 365, rotation: 0 }],
      settings: { muted: true, showAnchors: false },
    }

    const migrated = migrateSave(v2Raw)
    expect(migrated).toBeDefined()
    expect(migrated!.saveVersion).toBe(SAVE_VERSION)
    expect(migrated!.starCoins).toBe(420)
    expect(migrated!.inventory.apple_01).toBe(2)
    expect(migrated!.settings.muted).toBe(true)
    expect(isGameSave(migrated)).toBe(true)
  })

  it('migrates a V3 save preserving custom starCoins, inventory quantities, and clothing', () => {
    const v3Raw = {
      ...DEFAULT_SAVE,
      saveVersion: 3,
      starCoins: 275,
      inventory: { apple_01: 5, milk_01: 3, cake_01: 2 },
      ownedClothing: ['top_strawberry', 'bottom_mint', 'top_cloud_blue'],
      character: {
        ...DEFAULT_SAVE.character,
        equipped: { ...DEFAULT_SAVE.character.equipped, top: 'top_cloud_blue' },
      },
    }

    const migrated = migrateSave(v3Raw)
    expect(migrated).toBeDefined()
    expect(migrated!.saveVersion).toBe(SAVE_VERSION)
    expect(migrated!.starCoins).toBe(275)
    expect(migrated!.inventory.apple_01).toBe(5)
    expect(migrated!.inventory.milk_01).toBe(3)
    expect(migrated!.inventory.cake_01).toBe(2)
    expect(migrated!.ownedClothing).toContain('top_cloud_blue')
    expect(migrated!.character.equipped.top).toBe('top_cloud_blue')
    expect(isGameSave(migrated)).toBe(true)
  })

  it('migrates a V4 save to V5 with pets, customization, and all town locations', () => {
    const v4Raw = {
      ...DEFAULT_SAVE,
      saveVersion: 4,
      starCoins: 650,
      inventory: { pet_food_01: 4 },
      unlockedLocations: {
        town: true,
        home: true,
        clothing_boutique: true,
        supermarket: true,
      },
    }

    const migrated = migrateSave(v4Raw)
    expect(migrated).toBeDefined()
    expect(migrated!.saveVersion).toBe(5)
    expect(migrated!.starCoins).toBe(650)
    expect(migrated!.pets).toEqual([])
    expect(migrated!.character.customization).toBeDefined()
    expect(migrated!.character.customization?.hairStyle).toBe('long_waves')
    expect(migrated!.unlockedLocations.pet_shop).toBe(true)
    expect(migrated!.unlockedLocations.school).toBe(true)
    expect(migrated!.unlockedLocations.park).toBe(true)
    expect(migrated!.unlockedLocations.cafe).toBe(true)
    expect(migrated!.unlockedLocations.salon).toBe(true)
    expect(migrated!.unlockedLocations.toy_shop).toBe(true)
    expect(isGameSave(migrated)).toBe(true)
  })

  it('SaveManager loads legacy save and persists migrated version', () => {
    const v1Json = JSON.stringify({
      saveVersion: 1,
      starCoins: 180,
      currentLocation: 'home',
      character: { x: 500, y: 400, pose: 'sleeping', zoneId: 'bed' },
    })

    const storage = memoryStorage({ 'qian-hui-avatar-city.save': v1Json })
    const manager = new SaveManager(storage)
    const loaded = manager.load()

    expect(loaded.saveVersion).toBe(SAVE_VERSION)
    expect(loaded.starCoins).toBe(180)
    expect(loaded.character.state).toBe('sleeping')

    // Verify storage was upgraded to latest save version
    const upgradedRaw = JSON.parse(storage.getItem('qian-hui-avatar-city.save')!)
    expect(upgradedRaw.saveVersion).toBe(SAVE_VERSION)
  })

  it('rejects unrecognized save versions or null data', () => {
    expect(migrateSave(null)).toBeUndefined()
    expect(migrateSave({ saveVersion: 99 })).toBeUndefined()
    expect(migrateSave('invalid string')).toBeUndefined()
  })

  it('fills the default fridge for V5 saves and preserves custom fridge contents', () => {
    const withoutFridge = { ...DEFAULT_SAVE } as Record<string, unknown>
    delete withoutFridge.fridge
    expect(migrateSave(withoutFridge)?.fridge).toEqual(['milk_01', 'strawberry_01', 'ice_cream_01'])
    expect(migrateSave({ ...DEFAULT_SAVE, fridge: ['cake_01'] })?.fridge).toEqual(['cake_01'])
  })
})
