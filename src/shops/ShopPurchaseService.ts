import { ClothingRegistry } from '../data/clothes'
import type { PlayerState } from '../state/PlayerState'
import type { ShoppingCartManager } from './ShoppingCartManager'

export type ClothingPurchaseResult = 'purchased' | 'owned' | 'insufficient' | 'invalid'
export type CheckoutResult = 'purchased' | 'empty' | 'insufficient'

export class ShopPurchaseService {
  private readonly player: PlayerState
  constructor(player: PlayerState) { this.player = player }

  buyClothing(itemId: string): ClothingPurchaseResult {
    const item = ClothingRegistry.get(itemId)
    if (!item?.available) return 'invalid'
    if (this.player.ownsClothing(itemId)) return 'owned'
    if (!this.player.currency.spend(item.price)) return 'insufficient'
    this.player.addOwnedClothing(itemId)
    this.player.save(true)
    return 'purchased'
  }

  checkout(cart: ShoppingCartManager): CheckoutResult {
    if (cart.isEmpty()) return 'empty'
    const total = cart.total()
    if (!this.player.currency.spend(total)) return 'insufficient'
    for (const line of cart.lines()) this.player.inventory.add(line.itemId, line.quantity)
    cart.clear()
    this.player.data.progress.firstCheckout = true
    this.player.save(true)
    return 'purchased'
  }
}
