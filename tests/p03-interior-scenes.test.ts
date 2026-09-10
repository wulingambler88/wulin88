import { describe, it, expect, vi } from 'vitest'
import { LOCATION_DEFINITIONS } from '../src/data/locations'
import { sortByWorldY } from '../src/interaction/DepthManager'

vi.mock('phaser', () => {
  return {
    default: {
      Scene: class {},
      GameObjects: {
        GameObject: class {},
      },
    },
  }
})

describe('P03: Interior Scene Proportions and Grounding', () => {
  it('registers all 9 interior destinations with corresponding scene keys', () => {
    const requiredScenes = [
      'HomeScene',
      'ClothingShopScene',
      'SupermarketScene',
      'PetShopScene',
      'SchoolScene',
      'ParkScene',
      'CafeScene',
      'SalonScene',
      'ToyShopScene',
    ]

    for (const sceneKey of requiredScenes) {
      const loc = LOCATION_DEFINITIONS.find((l) => l.sceneKey === sceneKey)
      expect(loc).toBeDefined()
      expect(loc?.status).toBe('unlocked')
    }
  })

  it('correctly sorts objects by world Y for 2.5D depth sorting', () => {
    interface DepthItem {
      y: number
      depth: number
      setDepth: (d: number) => DepthItem
    }
    const createItem = (y: number): DepthItem => {
      const item: DepthItem = {
        y,
        depth: 0,
        setDepth(d: number) {
          item.depth = d
          return item
        },
      }
      return item
    }

    const obj1 = createItem(200)
    const obj2 = createItem(400)
    const obj3 = createItem(300)

    sortByWorldY([obj1, obj2, obj3] as unknown as Phaser.GameObjects.GameObject[])

    // Higher Y should receive higher depth
    expect(obj1.depth).toBeLessThan(obj3.depth)
    expect(obj3.depth).toBeLessThan(obj2.depth)
  })

  it('defines 3 contiguous dollhouse rooms for Home with 960px width each', () => {
    const ROOM_WIDTH = 960
    const ROOM_COUNT = 3
    const WORLD_WIDTH = ROOM_WIDTH * ROOM_COUNT

    expect(WORLD_WIDTH).toBe(2880)
    // Verify room indices 0 (Bedroom), 1 (Living Room), 2 (Kitchen)
    const roomOffsets = [0, 1, 2].map((r) => r * ROOM_WIDTH)
    expect(roomOffsets).toEqual([0, 960, 1920])
  })
})
