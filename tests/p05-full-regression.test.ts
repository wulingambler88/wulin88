import { describe, expect, it } from 'vitest'
import { LOCATION_DEFINITIONS, LocationRegistry, type LocationId } from '../src/data/locations'
import { CLOTHING_DEFINITIONS } from '../src/data/clothes'
import { migrateSave, isGameSave, SAVE_VERSION } from '../src/save/SaveSchema'
import { SaveManager, type StorageLike } from '../src/save/SaveManager'
import { RECIPE_DEFINITIONS } from '../src/data/recipes'
import { QUIZ_QUESTIONS, PUZZLES, MEMORY_CARDS, BRAIN_BADGES } from '../src/data/minigames'

function memoryStorage(initialData?: Record<string, string>): StorageLike {
  const values = new Map<string, string>(Object.entries(initialData ?? {}))
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value) },
  }
}

describe('P05 Full Regression Acceptance Suite', () => {
  describe('Locations & World Contracts', () => {
    it('has all 9 city locations properly configured with valid sceneKeys and metadata', () => {
      const locationKeys: LocationId[] = [
        'home',
        'clothing_boutique',
        'supermarket',
        'pet_shop',
        'school',
        'park',
        'cafe',
        'salon',
        'toy_shop',
      ]

      expect(LOCATION_DEFINITIONS.length).toBe(9)

      for (const locId of locationKeys) {
        const loc = LocationRegistry.get(locId)
        expect(loc).toBeDefined()
        expect(loc!.id).toBe(locId)
        expect(loc!.name.length).toBeGreaterThan(0)
        expect(loc!.shortName.length).toBeGreaterThan(0)
        expect(loc!.sceneKey).toBeDefined()
        expect(loc!.sceneKey!.length).toBeGreaterThan(0)
        expect(loc!.icon.length).toBeGreaterThan(0)
        expect(loc!.color).toBeDefined()
      }
    })

    it('contains valid scene keys matching all Phaser scene implementations', () => {
      const expectedScenes = new Set([
        'HomeScene',
        'ClothingShopScene',
        'SupermarketScene',
        'PetShopScene',
        'ParkScene',
        'CafeScene',
        'SalonScene',
        'ToyShopScene',
        'SchoolScene',
      ])

      for (const loc of LOCATION_DEFINITIONS) {
        expect(expectedScenes.has(loc.sceneKey!)).toBe(true)
      }
    })
  })

  describe('Catalog & Economy Consistency', () => {
    it('contains all 36 distinct clothing items with valid layers, prices, and non-empty names', () => {
      expect(CLOTHING_DEFINITIONS.length).toBe(36)

      const validCategories = new Set(['dress', 'top', 'bottom', 'shoes', 'hat', 'accessory'])
      const ids = new Set<string>()

      for (const item of CLOTHING_DEFINITIONS) {
        expect(ids.has(item.id)).toBe(false)
        ids.add(item.id)
        expect(validCategories.has(item.layer)).toBe(true)
        expect(item.name.trim().length).toBeGreaterThan(0)
        expect(item.price).toBeGreaterThanOrEqual(0)
      }
    })

    it('contains valid minigames and puzzle catalogs with questions and badges', () => {
      expect(QUIZ_QUESTIONS.length).toBeGreaterThan(0)
      for (const question of QUIZ_QUESTIONS) {
        expect(question.id.length).toBeGreaterThan(0)
        expect(question.question.length).toBeGreaterThan(0)
        expect(question.options.length).toBe(3)
        expect(question.correctIndex).toBeGreaterThanOrEqual(0)
        expect(question.correctIndex).toBeLessThan(3)
      }

      expect(PUZZLES.length).toBeGreaterThan(0)
      expect(MEMORY_CARDS.length).toBeGreaterThan(0)
      expect(BRAIN_BADGES.length).toBeGreaterThan(0)
    })

    it('contains valid cooking recipes with valid cookware, results, and ingredients', () => {
      expect(RECIPE_DEFINITIONS.length).toBeGreaterThan(0)
      for (const recipe of RECIPE_DEFINITIONS) {
        expect(recipe.id.length).toBeGreaterThan(0)
        expect(recipe.name.length).toBeGreaterThan(0)
        expect(recipe.ingredients.length).toBeGreaterThan(0)
        expect(recipe.resultItemId.length).toBeGreaterThan(0)
        expect(['stove', 'blender'].includes(recipe.cookware)).toBe(true)
        expect(recipe.icon.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Save Backwards Compatibility & Migration Integrity', () => {
    it('seamlessly migrates legacy save with custom purple twin-bun avatar and preserves appearance', () => {
      const legacySave = {
        saveVersion: 4,
        layoutVersion: 1,
        starCoins: 777,
        currentLocation: 'home',
        currentRoom: 0,
        character: {
          x: 400,
          y: 430,
          state: 'standing',
          customization: {
            skinColor: 0xffd1b3,
            hairStyle: 'twin_buns',
            hairColor: 0xb57edc, // purple hair
            eyeColor: 0x4a90e2,
            blushColor: 0xff9ec7,
          },
          equipped: {
            top: 'top_strawberry',
            bottom: 'bottom_mint',
            dress: null,
            hat: 'hat_beret',
            shoes: 'shoes_mint',
            accessory: null,
          },
          stats: { happiness: 100, energy: 100, hunger: 100, fun: 100 },
        },
        inventory: {
          strawberry: 5,
          croissant: 2,
        },
        ownedClothing: ['top_strawberry', 'bottom_mint', 'hat_beret', 'shoes_mint'],
        unlockedLocations: { home: true, clothing_boutique: true, supermarket: true },
        progress: {},
        roomItems: [],
        furniture: [],
        settings: { soundEnabled: true, musicEnabled: true },
        pets: [],
        minigames: { supermarketScanner: 0, parkSandbox: 0 },
      }

      const migrated = migrateSave(legacySave)
      expect(migrated).toBeDefined()
      expect(migrated!.saveVersion).toBe(SAVE_VERSION)
      expect(isGameSave(migrated)).toBe(true)
      expect(migrated!.starCoins).toBe(777)
      expect(migrated!.character.customization.hairStyle).toBe('twin_buns')
      expect(migrated!.character.customization.hairColor).toBe(0xb57edc)
      expect(migrated!.character.customization.skinColor).toBe(0xffd1b3)
      expect(migrated!.character.equipped.top).toBe('top_strawberry')
      expect(migrated!.character.equipped.bottom).toBe('bottom_mint')
      expect(migrated!.character.equipped.hat).toBe('hat_beret')
      expect(migrated!.inventory.strawberry).toBe(5)
      expect(migrated!.inventory.croissant).toBe(2)
    })

    it('does not corrupt save or erase user data when SaveManager saves and reloads', () => {
      const storage = memoryStorage()
      const manager = new SaveManager(storage)

      const initialSave = manager.load()
      expect(initialSave).toBeDefined()

      // Mutate player state
      initialSave.starCoins = 1250
      initialSave.character.customization.hairColor = 0xff69b4
      initialSave.inventory.bubble_tea = 3

      manager.save(initialSave)

      // Reload in fresh manager
      const reloadedManager = new SaveManager(storage)
      const loaded = reloadedManager.load()

      expect(loaded.starCoins).toBe(1250)
      expect(loaded.character.customization.hairColor).toBe(0xff69b4)
      expect(loaded.inventory.bubble_tea).toBe(3)
      expect(loaded.saveVersion).toBe(SAVE_VERSION)
    })
  })
})
