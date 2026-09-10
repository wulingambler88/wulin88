import { describe, expect, it } from 'vitest'
import { InventoryManager } from '../src/inventory/InventoryManager'

describe('InventoryManager', () => {
  it('adds, removes, and stacks items', () => {
    const inventory = new InventoryManager()
    expect(inventory.add('apple_01', 2)).toBe(2)
    expect(inventory.add('apple_01', 3)).toBe(5)
    expect(inventory.remove('apple_01', 2)).toBe(true)
    expect(inventory.quantity('apple_01')).toBe(3)
  })

  it('caps stacks and rejects insufficient quantity', () => {
    const inventory = new InventoryManager({ apple_01: 9 })
    expect(inventory.add('apple_01', 5)).toBe(10)
    expect(inventory.remove('apple_01', 11)).toBe(false)
    expect(inventory.quantity('apple_01')).toBe(10)
  })
})
