export class CurrencyManager {
  private balance: number

  constructor(initialBalance = 0) { this.balance = Math.max(0, Math.floor(initialBalance)) }

  getBalance(): number { return this.balance }
  canAfford(amount: number): boolean { return Number.isFinite(amount) && amount >= 0 && this.balance >= Math.floor(amount) }

  add(amount: number): number {
    if (!Number.isFinite(amount) || amount < 0) throw new Error('Coin amount must be non-negative')
    this.balance += Math.floor(amount)
    return this.balance
  }

  spend(amount: number): boolean {
    if (!Number.isFinite(amount) || amount < 0) throw new Error('Coin amount must be non-negative')
    const whole = Math.floor(amount)
    if (!this.canAfford(whole)) return false
    this.balance -= whole
    return true
  }
}
