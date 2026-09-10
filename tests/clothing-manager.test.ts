import { describe, expect, it } from 'vitest'
import { ClothingManager } from '../src/characters/ClothingManager'

describe('ClothingManager', () => {
  it('equips and replaces clothing on the same layer', () => {
    const clothing = new ClothingManager()
    expect(clothing.equip('top_sunshine')).toBe(true)
    expect(clothing.equip('top_mint')).toBe(true)
    expect(clothing.snapshot().top).toBe('top_mint')
  })

  it('clears separates when a dress is equipped', () => {
    const clothing = new ClothingManager()
    clothing.equip('dress_star')
    expect(clothing.snapshot()).toMatchObject({ dress: 'dress_star', top: null, bottom: null })
  })

  it('rejects an invalid clothing id', () => expect(new ClothingManager().equip('not_real')).toBe(false))
})
