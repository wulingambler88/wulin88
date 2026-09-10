import { ClothingRegistry, type ClothingLayer } from '../data/clothes'

export type EquippedClothing = Record<ClothingLayer, string | null>

export const DEFAULT_OUTFIT: EquippedClothing = {
  top: null,
  bottom: null,
  dress: 'dress_bunny_pinafore',
  hat: 'hat_flower_pearl',
  shoes: 'shoes_ribbon_blue',
  accessory: null,
}

export class ClothingManager {
  private equipped: EquippedClothing

  constructor(initial: EquippedClothing = DEFAULT_OUTFIT) { this.equipped = { ...initial } }

  equip(itemId: string): boolean {
    const item = ClothingRegistry.get(itemId)
    if (!item) return false
    this.equipped[item.layer] = itemId
    if (item.layer === 'dress') {
      this.equipped.top = null
      this.equipped.bottom = null
    } else if (item.layer === 'top' || item.layer === 'bottom') {
      this.equipped.dress = null
    }
    return true
  }

  snapshot(): EquippedClothing { return { ...this.equipped } }
  restore(outfit: EquippedClothing): void { this.equipped = { ...outfit } }
}
