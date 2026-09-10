import { describe, expect, it } from 'vitest'
import { LocationManager } from '../src/navigation/LocationManager'

describe('LocationManager', () => {
  const manager = new LocationManager()

  it('recognizes all town locations when unlocked in save', () => {
    const allUnlocked = {
      town: true,
      home: true,
      clothing_boutique: true,
      supermarket: true,
      pet_shop: true,
      school: true,
      park: true,
      cafe: true,
      salon: true,
      toy_shop: true,
    }
    expect(manager.isAvailable('home', allUnlocked)).toBe(true)
    expect(manager.isAvailable('clothing_boutique', allUnlocked)).toBe(true)
    expect(manager.isAvailable('supermarket', allUnlocked)).toBe(true)
    expect(manager.isAvailable('pet_shop', allUnlocked)).toBe(true)
    expect(manager.isAvailable('park', allUnlocked)).toBe(true)
    expect(manager.isAvailable('cafe', allUnlocked)).toBe(true)
    expect(manager.isAvailable('salon', allUnlocked)).toBe(true)
    expect(manager.isAvailable('toy_shop', allUnlocked)).toBe(true)
    expect(manager.isAvailable('school', allUnlocked)).toBe(true)
  })

  it('rejects locked locations', () => {
    const partiallyUnlocked = { town: true, home: true, clothing_boutique: false, supermarket: false, pet_shop: false }
    expect(manager.isAvailable('clothing_boutique', partiallyUnlocked)).toBe(false)
    expect(manager.isAvailable('supermarket', partiallyUnlocked)).toBe(false)
    expect(manager.isAvailable('pet_shop', partiallyUnlocked)).toBe(false)
  })

  it('returns definition for valid locations and undefined for unknown', () => {
    expect(manager.get('home')?.name).toBe('Home')
    expect(manager.get('clothing_boutique')?.sceneKey).toBe('ClothingShopScene')
    expect(manager.get('supermarket')?.sceneKey).toBe('SupermarketScene')
    expect(manager.get('invalid_location' as unknown as import('../src/data/locations').LocationId)).toBeUndefined()
  })
})

