import { describe, expect, it } from 'vitest'
import { CurrencyManager } from '../src/economy/CurrencyManager'

describe('CurrencyManager', () => {
  it('initializes with the given balance', () => {
    const currency = new CurrencyManager(500)
    expect(currency.getBalance()).toBe(500)
  })

  it('adds coins correctly', () => {
    const currency = new CurrencyManager(100)
    expect(currency.add(50)).toBe(150)
    expect(currency.getBalance()).toBe(150)
  })

  it('spends coins when sufficient funds exist', () => {
    const currency = new CurrencyManager(100)
    expect(currency.spend(40)).toBe(true)
    expect(currency.getBalance()).toBe(60)
  })

  it('rejects spending with insufficient funds and retains balance', () => {
    const currency = new CurrencyManager(50)
    expect(currency.canAfford(60)).toBe(false)
    expect(currency.spend(60)).toBe(false)
    expect(currency.getBalance()).toBe(50)
  })

  it('prevents negative amount errors', () => {
    const currency = new CurrencyManager(100)
    expect(() => currency.add(-10)).toThrow('Coin amount must be non-negative')
    expect(() => currency.spend(-10)).toThrow('Coin amount must be non-negative')
    expect(currency.canAfford(-5)).toBe(false)
  })
})
