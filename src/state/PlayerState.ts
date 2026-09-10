import type { CharacterSave, GameSave } from '../save/SaveSchema'
import { saveManager } from '../save/SaveManager'
import { CurrencyManager } from '../economy/CurrencyManager'
import { InventoryManager } from '../inventory/InventoryManager'
import type { LocationId } from '../data/locations'

export class PlayerState {
  data: GameSave
  currency: CurrencyManager
  inventory: InventoryManager

  constructor() {
    this.data = saveManager.load()
    this.currency = new CurrencyManager(this.data.starCoins)
    this.inventory = new InventoryManager(this.data.inventory)
  }

  reload(): void { this.replace(saveManager.load()) }
  reset(): void { this.replace(saveManager.reset()) }

  setLocation(location: LocationId): void { this.data.currentLocation = location; this.save() }
  setCharacter(character: CharacterSave): void { this.data.character = character; this.save() }
  ownsClothing(itemId: string): boolean { return this.data.ownedClothing.includes(itemId) }
  addOwnedClothing(itemId: string): boolean {
    if (this.ownsClothing(itemId)) return false
    this.data.ownedClothing.push(itemId)
    this.save()
    return true
  }

  save(immediate = false): void {
    this.data.starCoins = this.currency.getBalance()
    this.data.inventory = this.inventory.snapshot()
    if (immediate) saveManager.save(this.data)
    else saveManager.scheduleSave(this.data)
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('player-state-changed', { detail: { starCoins: this.data.starCoins } }))
  }

  private replace(next: GameSave): void {
    this.data = next
    this.currency = new CurrencyManager(next.starCoins)
    this.inventory = new InventoryManager(next.inventory)
    this.save(true)
  }
}

export const playerState = new PlayerState()
