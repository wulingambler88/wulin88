import { getItemDefinition } from '../data/items'

export interface CartLine { itemId: string; quantity: number; unitPrice: number; total: number }

export class ShoppingCartManager {
  private quantities: Record<string, number> = {}

  add(itemId: string, amount = 1): boolean {
    const item = getItemDefinition(itemId)
    if (!item || item.shop !== 'supermarket' || amount <= 0) return false
    this.quantities[itemId] = Math.min(item.maxStack, this.quantity(itemId) + Math.floor(amount))
    return true
  }

  remove(itemId: string, amount = 1): boolean {
    if (amount <= 0 || this.quantity(itemId) < amount) return false
    const next = this.quantity(itemId) - Math.floor(amount)
    if (next <= 0) delete this.quantities[itemId]
    else this.quantities[itemId] = next
    return true
  }

  quantity(itemId: string): number { return this.quantities[itemId] ?? 0 }
  lines(): CartLine[] {
    return Object.entries(this.quantities).flatMap(([itemId, quantity]) => {
      const item = getItemDefinition(itemId)
      return item ? [{ itemId, quantity, unitPrice: item.price ?? 0, total: quantity * (item.price ?? 0) }] : []
    })
  }
  total(): number { return this.lines().reduce((sum, line) => sum + line.total, 0) }
  isEmpty(): boolean { return this.lines().length === 0 }
  clear(): void { this.quantities = {} }
  snapshot(): Record<string, number> { return { ...this.quantities } }
}
