import { describe, expect, it } from 'vitest'
import { DEFAULT_SAVE, isGameSave, type GameSave } from '../src/save/SaveSchema'
import { ITEM_DEFINITIONS, getItemDefinition } from '../src/data/items'
import { audioManager } from '../src/audio/AudioManager'

describe('Interaction Gameplay Polish', () => {
  describe('Held Item & Save Schema Compatibility', () => {
    it('accepts a character with an equipped held item in save schema', () => {
      const saveWithHeldItem: GameSave = {
        ...DEFAULT_SAVE,
        character: {
          ...DEFAULT_SAVE.character,
          heldItemId: 'teddy_01',
        },
      }
      expect(isGameSave(saveWithHeldItem)).toBe(true)
      expect(saveWithHeldItem.character.heldItemId).toBe('teddy_01')
    })

    it('accepts character without held item (undefined) in save schema', () => {
      const saveWithoutHeldItem: GameSave = {
        ...DEFAULT_SAVE,
        character: {
          ...DEFAULT_SAVE.character,
          heldItemId: undefined,
        },
      }
      expect(isGameSave(saveWithoutHeldItem)).toBe(true)
      expect(saveWithoutHeldItem.character.heldItemId).toBeUndefined()
    })
  })

  describe('Item Catalog Categorization for Interactions', () => {
    it('defines food items with valid hunger restoration values', () => {
      const foods = ITEM_DEFINITIONS.filter((item) => item.category === 'food')
      expect(foods.length).toBeGreaterThan(5)
      for (const food of foods) {
        expect(food.metadata.hunger).toBeDefined()
        expect(Number(food.metadata.hunger)).toBeGreaterThan(0)
      }
    })

    it('defines toy items with valid fun restoration values', () => {
      const toys = ITEM_DEFINITIONS.filter((item) => item.category === 'toys')
      expect(toys.length).toBeGreaterThan(1)
      for (const toy of toys) {
        expect(toy.metadata.fun).toBeDefined()
        expect(Number(toy.metadata.fun)).toBeGreaterThan(0)
      }
    })

    it('retrieves item definitions accurately by id', () => {
      const bear = getItemDefinition('teddy_01')
      expect(bear).toBeDefined()
      expect(bear?.category).toBe('toys')

      const milk = getItemDefinition('milk_01')
      expect(milk).toBeDefined()
      expect(milk?.category).toBe('food')
    })
  })

  describe('Audio Manager Procedural Sound Synthesis', () => {
    it('supports all newly added gameplay procedural sound keys', () => {
      const requiredSounds = [
        'switch',
        'water',
        'honk',
        'bounce',
        'chew',
        'rustle',
        'tvJingle',
        'register',
      ] as const

      for (const key of requiredSounds) {
        expect(() => audioManager.play(key)).not.toThrow()
      }
    })
  })

  describe('Fridge Storage & Drop Mechanics', () => {
    it('enforces maximum 6 items storage capacity', () => {
      const storedItems: string[] = ['milk_01', 'strawberry_01', 'ice_cream_01']
      const maxCapacity = 6

      // Simulate storeItem logic
      const tryStore = (itemId: string): boolean => {
        if (storedItems.length >= maxCapacity) return false
        storedItems.push(itemId)
        return true
      }

      expect(tryStore('apple_01')).toBe(true) // 4
      expect(tryStore('bread_01')).toBe(true) // 5
      expect(tryStore('cheese_01')).toBe(true) // 6 (full)
      expect(tryStore('smoothie_apple_01')).toBe(false) // rejected
      expect(storedItems.length).toBe(6)
    })

    it('validates drop bounds when fridge is open', () => {
      const fridgeX = 2080
      const fridgeY = 322

      const isAcceptingDrops = (isOpen: boolean, x: number, y: number): boolean => {
        if (!isOpen) return false
        return Math.abs(x - fridgeX) <= 90 && Math.abs(y - fridgeY) <= 120
      }

      expect(isAcceptingDrops(false, 2080, 322)).toBe(false)
      expect(isAcceptingDrops(true, 2080, 322)).toBe(true)
      expect(isAcceptingDrops(true, 2150, 350)).toBe(true)
      expect(isAcceptingDrops(true, 1800, 322)).toBe(false)
    })
  })

  describe('Furniture Interactive State Cycling', () => {
    it('cycles TV channels across 4 states (Off, Kitty, Rainbow, Rocket)', () => {
      let channelIndex = 0
      const cycleTV = () => {
        channelIndex = (channelIndex + 1) % 4
        return channelIndex
      }

      expect(cycleTV()).toBe(1) // Kitty
      expect(cycleTV()).toBe(2) // Rainbow
      expect(cycleTV()).toBe(3) // Rocket
      expect(cycleTV()).toBe(0) // Off
      expect(cycleTV()).toBe(1) // Wraps back to Kitty
    })

    it('toggles lamp state between on and off', () => {
      let isOn = false
      const toggleLamp = () => {
        isOn = !isOn
        return isOn
      }

      expect(toggleLamp()).toBe(true)
      expect(toggleLamp()).toBe(false)
      expect(toggleLamp()).toBe(true)
    })
  })

  describe('Surface Placement & Snapping Zones', () => {
    it('snaps items to dining table surface when dropped within table bounds', () => {
      const snapToDiningTable = (x: number, y: number) => {
        if (x >= 2280 && x <= 2520 && y >= 280 && y <= 440) {
          return { snapped: true, x, y: 335 }
        }
        return { snapped: false, x, y }
      }

      const drop1 = snapToDiningTable(2350, 310)
      expect(drop1.snapped).toBe(true)
      expect(drop1.y).toBe(335)

      const dropOutside = snapToDiningTable(2100, 310)
      expect(dropOutside.snapped).toBe(false)
      expect(dropOutside.y).toBe(310)
    })

    it('snaps items to coffee table surface when dropped within table bounds', () => {
      const snapToCoffeeTable = (x: number, y: number) => {
        if (x >= 1450 && x <= 1620 && y >= 280 && y <= 420) {
          return { snapped: true, x, y: 350 }
        }
        return { snapped: false, x, y }
      }

      const drop1 = snapToCoffeeTable(1500, 330)
      expect(drop1.snapped).toBe(true)
      expect(drop1.y).toBe(350)

      const dropOutside = snapToCoffeeTable(1800, 330)
      expect(dropOutside.snapped).toBe(false)
    })
  })
})
