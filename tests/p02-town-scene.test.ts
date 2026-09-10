import { describe, it, expect, vi } from 'vitest'
import { LOCATION_DEFINITIONS, LocationRegistry, type LocationId } from '../src/data/locations'
import { DayNightManager } from '../src/environment/DayNightManager'

vi.mock('phaser', () => {
  class MockGameObject {
    setScrollFactor = vi.fn().mockReturnThis()
    setDepth = vi.fn().mockReturnThis()
    setFillStyle = vi.fn().mockReturnThis()
    setAlpha = vi.fn().mockReturnThis()
    destroy = vi.fn()
  }
  return {
    default: {
      Scene: class {},
      GameObjects: {
        Rectangle: MockGameObject,
        Text: MockGameObject,
      },
    },
  }
})

describe('P02: Town Scene Composition & Locations', () => {
  it('defines all 9 core town destinations with unlocked status and valid scenes', () => {
    const requiredIds: LocationId[] = [
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
    for (const id of requiredIds) {
      const loc = LOCATION_DEFINITIONS.find((l) => l.id === id)
      expect(loc).toBeDefined()
      expect(loc?.status).toBe('unlocked')
      expect(loc?.shortName).toBeTruthy()
      expect(loc?.sceneKey).toBeTruthy()
      expect(LocationRegistry.has(id)).toBe(true)
    }
  })

  it('keeps boutique and supermarket badges safely elevated above bottom-row building roofs', () => {
    const boutique = LOCATION_DEFINITIONS.find((l) => l.id === 'clothing_boutique')!
    const market = LOCATION_DEFINITIONS.find((l) => l.id === 'supermarket')!
    const toyShop = LOCATION_DEFINITIONS.find((l) => l.id === 'toy_shop')!
    const salon = LOCATION_DEFINITIONS.find((l) => l.id === 'salon')!

    // The BADGE_CONFIG elevates boutique and market badges to roof y=-16
    const boutiqueBadgeGlobalY = boutique.y - 16
    const marketBadgeGlobalY = market.y - 16

    // Roof placement ensures badges are far above bottom-row building roofs (y ~ 295-320)
    expect(boutiqueBadgeGlobalY).toBeLessThan(275)
    expect(marketBadgeGlobalY).toBeLessThan(275)

    expect(toyShop.y).toBeGreaterThan(boutique.y + 80)
    expect(salon.y).toBeGreaterThan(market.y + 80)
  })

  it('cycles time of day through day -> sunset -> night -> day', () => {
    const mockScene = {
      add: {
        rectangle: vi.fn().mockReturnValue({
          setScrollFactor: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
          setFillStyle: vi.fn().mockReturnThis(),
          setAlpha: vi.fn().mockReturnThis(),
        }),
        text: vi.fn().mockReturnValue({
          setScrollFactor: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
        }),
      },
      tweens: {
        add: vi.fn(),
      },
    }

    const dnm = new DayNightManager(mockScene as any, 'day')
    expect(dnm.getTime()).toBe('day')

    expect(dnm.cycle()).toBe('sunset')
    expect(dnm.getTime()).toBe('sunset')

    expect(dnm.cycle()).toBe('night')
    expect(dnm.getTime()).toBe('night')

    expect(dnm.cycle()).toBe('day')
    expect(dnm.getTime()).toBe('day')
  })
})
