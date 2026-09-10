import { getItemDefinition } from '../data/items'

export type InventoryState = Record<string, number>

export class InventoryManager {
  private quantities: InventoryState

  constructor(initial: InventoryState = {}) { this.quantities = { ...initial } }

  add(itemId: string, amount = 1): number {
    const definition = getItemDefinition(itemId)
    if (!definition || amount <= 0) return this.quantity(itemId)
    const next = Math.min(definition.maxStack, this.quantity(itemId) + amount)
    this.quantities[itemId] = next
    return next
  }

  remove(itemId: string, amount = 1): boolean {
    if (amount <= 0 || this.quantity(itemId) < amount) return false
    const next = this.quantity(itemId) - amount
    if (next === 0) delete this.quantities[itemId]
    else this.quantities[itemId] = next
    return true
  }

  quantity(itemId: string): number { return this.quantities[itemId] ?? 0 }
  has(itemId: string, amount = 1): boolean { return this.quantity(itemId) >= amount }
  snapshot(): InventoryState { return { ...this.quantities } }
}
