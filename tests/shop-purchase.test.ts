import { describe, expect, it, beforeEach } from 'vitest'
import { ShopPurchaseService } from '../src/shops/ShopPurchaseService'
import { ShoppingCartManager } from '../src/shops/ShoppingCartManager'
import { PlayerState } from '../src/state/PlayerState'

describe('ShopPurchaseService', () => {
  let player: PlayerState
  let service: ShopPurchaseService

  beforeEach(() => {
    player = new PlayerState()
    player.reset()
    // Default starting balance is 500 star coins
    service = new ShopPurchaseService(player)
  })

  it('completes a successful clothing purchase and prevents duplicate purchase', () => {
    // top_cloud_blue price is 36
    expect(player.ownsClothing('top_cloud_blue')).toBe(false)
    const initialCoins = player.currency.getBalance()

    const result = service.buyClothing('top_cloud_blue')
    expect(result).toBe('purchased')
    expect(player.currency.getBalance()).toBe(initialCoins - 36)
    expect(player.ownsClothing('top_cloud_blue')).toBe(true)

    // Attempting to buy again returns 'owned' and leaves balance unchanged
    const secondResult = service.buyClothing('top_cloud_blue')
    expect(secondResult).toBe('owned')
    expect(player.currency.getBalance()).toBe(initialCoins - 36)
  })

  it('blocks clothing purchase when coins are insufficient', () => {
    player.currency.spend(player.currency.getBalance() - 10) // leave 10 coins
    expect(player.currency.getBalance()).toBe(10)

    // top_cloud_blue price is 36, player only has 10
    const result = service.buyClothing('top_cloud_blue')
    expect(result).toBe('insufficient')
    expect(player.currency.getBalance()).toBe(10)
    expect(player.ownsClothing('top_cloud_blue')).toBe(false)
  })

  it('checks out supermarket cart and adds stackable food to inventory', () => {
    const cart = new ShoppingCartManager()
    cart.add('apple_01', 3) // 3 * 5 = 15
    cart.add('milk_01', 1)  // 1 * 12 = 12
    cart.add('cake_01', 1)  // 1 * 25 = 25
    // Total = 52
    cart.remove('apple_01', 1) // Apple x2 -> total = 10 + 12 + 25 = 47

    const initialCoins = player.currency.getBalance()
    const initialApples = player.inventory.quantity('apple_01')
    const initialMilk = player.inventory.quantity('milk_01')
    const initialCake = player.inventory.quantity('cake_01')

    const result = service.checkout(cart)
    expect(result).toBe('purchased')
    expect(player.currency.getBalance()).toBe(initialCoins - 47)
    expect(player.inventory.quantity('apple_01')).toBe(initialApples + 2)
    expect(player.inventory.quantity('milk_01')).toBe(initialMilk + 1)
    expect(player.inventory.quantity('cake_01')).toBe(initialCake + 1)
    expect(cart.isEmpty()).toBe(true)
  })

  it('rejects checkout when cart exceeds player balance', () => {
    const cart = new ShoppingCartManager()
    cart.add('cake_01', 5) // 5 * 25 = 125

    player.currency.spend(player.currency.getBalance() - 50) // leave only 50 coins
    expect(player.currency.getBalance()).toBe(50)

    const result = service.checkout(cart)
    expect(result).toBe('insufficient')
    expect(player.currency.getBalance()).toBe(50)
    expect(cart.isEmpty()).toBe(false)
  })

  it('rejects checkout on an empty cart', () => {
    const cart = new ShoppingCartManager()
    const result = service.checkout(cart)
    expect(result).toBe('empty')
  })
})
