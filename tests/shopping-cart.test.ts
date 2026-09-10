import { describe, expect, it } from 'vitest'
import { ShoppingCartManager } from '../src/shops/ShoppingCartManager'

describe('ShoppingCartManager', () => {
  it('adds items and calculates line total and basket total', () => {
    const cart = new ShoppingCartManager()
    expect(cart.add('apple_01', 3)).toBe(true)
    expect(cart.add('milk_01', 1)).toBe(true)
    expect(cart.quantity('apple_01')).toBe(3)
    expect(cart.quantity('milk_01')).toBe(1)
    // apple_01: price 5 * 3 = 15; milk_01: price 12 * 1 = 12 -> total = 27
    expect(cart.total()).toBe(27)
    expect(cart.isEmpty()).toBe(false)
  })

  it('removes items and updates quantity', () => {
    const cart = new ShoppingCartManager()
    cart.add('apple_01', 3)
    expect(cart.remove('apple_01', 1)).toBe(true)
    expect(cart.quantity('apple_01')).toBe(2)
    // apple_01: price 5 * 2 = 10
    expect(cart.total()).toBe(10)
  })

  it('completely removes item when quantity reaches zero', () => {
    const cart = new ShoppingCartManager()
    cart.add('milk_01', 1)
    expect(cart.remove('milk_01', 1)).toBe(true)
    expect(cart.quantity('milk_01')).toBe(0)
    expect(cart.lines()).toEqual([])
    expect(cart.isEmpty()).toBe(true)
  })

  it('rejects removing non-existent or excessive quantity', () => {
    const cart = new ShoppingCartManager()
    expect(cart.remove('apple_01', 1)).toBe(false)
    cart.add('apple_01', 2)
    expect(cart.remove('apple_01', 3)).toBe(false)
    expect(cart.quantity('apple_01')).toBe(2)
  })

  it('clears all items from the cart', () => {
    const cart = new ShoppingCartManager()
    cart.add('apple_01', 2)
    cart.add('cake_01', 1)
    cart.clear()
    expect(cart.isEmpty()).toBe(true)
    expect(cart.total()).toBe(0)
    expect(cart.quantity('apple_01')).toBe(0)
  })

  it('rejects non-supermarket items and non-positive quantities', () => {
    const cart = new ShoppingCartManager()
    expect(cart.add('top_strawberry', 1)).toBe(false)
    expect(cart.add('apple_01', 0)).toBe(false)
    expect(cart.add('apple_01', -2)).toBe(false)
    expect(cart.remove('apple_01', -1)).toBe(false)
  })
})
