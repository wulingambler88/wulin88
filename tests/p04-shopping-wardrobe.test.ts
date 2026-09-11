import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CharacterCreatorModal, HAIR_STYLES, HAIR_COLORS, SKIN_TONES, EYE_COLORS } from '../src/ui/CharacterCreatorModal'
import { CLOTHING_DEFINITIONS, ClothingRegistry } from '../src/data/clothes'
import { ITEM_DEFINITIONS } from '../src/data/items'
import { ShoppingCartManager } from '../src/shops/ShoppingCartManager'
import { ShopPurchaseService } from '../src/shops/ShopPurchaseService'
import { CurrencyManager } from '../src/economy/CurrencyManager'
import { playerState } from '../src/state/PlayerState'
import type { AvatarCustomization } from '../src/save/SaveSchema'

class FakeElement {
  tagName: string
  className = ''
  hidden = false
  style: Record<string, string> = {}
  dataset: Record<string, string> = {}
  attributes: Record<string, string> = {}
  children: FakeElement[] = []
  parentElement: FakeElement | null = null
  listeners: Record<string, ((event?: unknown) => void)[]> = {}
  private _innerHTML = ''

  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase()
  }

  get innerHTML(): string {
    return this._innerHTML
  }

  set innerHTML(html: string) {
    this._innerHTML = html
    this.parseChildren(html)
  }

  get textContent(): string {
    return this._innerHTML.replace(/<[^>]*>/g, '')
  }

  set textContent(text: string) {
    this._innerHTML = text
    this.children = []
  }

  classList = {
    classes: new Set<string>(),
    add: (...names: string[]) => names.forEach((n) => this.classList.classes.add(n)),
    remove: (...names: string[]) => names.forEach((n) => this.classList.classes.delete(n)),
    toggle: (name: string, force?: boolean) => {
      const has = this.classList.classes.has(name)
      const next = force !== undefined ? force : !has
      if (next) this.classList.classes.add(name)
      else this.classList.classes.delete(name)
      return next
    },
    contains: (name: string) => this.classList.classes.has(name),
  }

  setAttribute(name: string, value: string): void {
    this.attributes[name] = value
    if (name.startsWith('data-')) {
      const camel = name.slice(5).replace(/-([a-z])/g, (_, l: string) => l.toUpperCase())
      this.dataset[camel] = value
    }
  }

  getAttribute(name: string): string | null {
    return this.attributes[name] ?? null
  }

  appendChild(child: FakeElement): FakeElement {
    this.children.push(child)
    child.parentElement = this
    return child
  }

  addEventListener(type: string, listener: (e?: unknown) => void): void {
    if (!this.listeners[type]) this.listeners[type] = []
    this.listeners[type].push(listener)
  }

  click(): void {
    this.listeners['click']?.forEach((fn) => fn({ target: this, currentTarget: this }))
  }

  focus(): void {}

  querySelector<T = FakeElement>(sel: string): T | null {
    return (this.querySelectorAll(sel)[0] as unknown as T) ?? null
  }

  querySelectorAll<T = FakeElement>(sel: string): T[] {
    const results: FakeElement[] = []
    const match = (el: FakeElement): boolean => {
      if (sel.startsWith('#')) return el.getAttribute('id') === sel.slice(1)
      if (sel.startsWith('.')) return el.classList.contains(sel.slice(1)) || el.className.includes(sel.slice(1))
      if (sel === 'button') return el.tagName === 'BUTTON'

      const attrMatch = sel.match(/^\[([a-z0-9-]+)(?:="([^"]*)")?\]$/i)
      if (attrMatch) {
        const attrName = attrMatch[1]!
        const attrVal = attrMatch[2]
        const val = el.getAttribute(attrName)
        if (attrVal !== undefined) return val === attrVal
        return val !== null
      }
      return false
    }

    const traverse = (node: FakeElement): void => {
      for (const child of node.children) {
        if (match(child)) results.push(child)
        traverse(child)
      }
    }
    traverse(this)
    return results as unknown as T[]
  }

  private parseChildren(html: string): void {
    this.children = []
    let i = 0
    while (i < html.length) {
      const startTagOpen = html.indexOf('<', i)
      if (startTagOpen === -1) break
      if (html.startsWith('<!--', startTagOpen)) {
        const commentEnd = html.indexOf('-->', startTagOpen)
        i = commentEnd === -1 ? html.length : commentEnd + 3
        continue
      }
      if (html[startTagOpen + 1] === '/') {
        const closeEnd = html.indexOf('>', startTagOpen)
        i = closeEnd === -1 ? html.length : closeEnd + 1
        continue
      }
      const tagOpenEnd = html.indexOf('>', startTagOpen)
      if (tagOpenEnd === -1) break

      const tagContent = html.slice(startTagOpen + 1, tagOpenEnd).trim()
      const isSelfClosing = tagContent.endsWith('/')
      const cleanTagContent = isSelfClosing ? tagContent.slice(0, -1).trim() : tagContent
      const spaceIdx = cleanTagContent.search(/\s/)
      const tagName = spaceIdx === -1 ? cleanTagContent : cleanTagContent.slice(0, spaceIdx)
      const attrsStr = spaceIdx === -1 ? '' : cleanTagContent.slice(spaceIdx + 1)

      const child = new FakeElement(tagName)
      const attrRegex = /([a-z0-9-]+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/gi
      let a: RegExpExecArray | null
      while ((a = attrRegex.exec(attrsStr)) !== null) {
        const name = a[1]!
        const val = a[2] ?? a[3] ?? a[4] ?? ''
        child.setAttribute(name, val)
        if (name === 'class') {
          child.className = val
          val.split(/\s+/).forEach((c) => child.classList.add(c))
        }
      }

      if (isSelfClosing || ['img', 'br', 'hr', 'input'].includes(tagName.toLowerCase())) {
        this.appendChild(child)
        i = tagOpenEnd + 1
        continue
      }

      const closeTag = `</${tagName}>`
      let depth = 1
      let searchPos = tagOpenEnd + 1
      let childEnd = -1

      while (depth > 0 && searchPos < html.length) {
        const nextOpen = html.toLowerCase().indexOf(`<${tagName.toLowerCase()}`, searchPos)
        const nextClose = html.toLowerCase().indexOf(closeTag.toLowerCase(), searchPos)
        if (nextClose === -1) break

        if (nextOpen !== -1 && nextOpen < nextClose) {
          const charAfter = html[nextOpen + tagName.length + 1]
          if (charAfter === ' ' || charAfter === '>' || charAfter === '/') {
            depth++
          }
          searchPos = nextOpen + tagName.length + 1
        } else {
          depth--
          if (depth === 0) {
            childEnd = nextClose
            break
          }
          searchPos = nextClose + closeTag.length
        }
      }

      if (childEnd !== -1) {
        const innerContent = html.slice(tagOpenEnd + 1, childEnd)
        child.innerHTML = innerContent
        this.appendChild(child)
        i = childEnd + closeTag.length
      } else {
        this.appendChild(child)
        i = tagOpenEnd + 1
      }
    }
  }
}

// Setup fake DOM globals if running in pure node environment
const fakeBody = new FakeElement('body')
if (typeof document === 'undefined') {
  ;(globalThis as unknown as Record<string, unknown>).document = {
    createElement: (tag: string) => new FakeElement(tag),
    body: fakeBody,
    querySelector: (sel: string) => fakeBody.querySelector(sel),
    querySelectorAll: (sel: string) => fakeBody.querySelectorAll(sel),
  }
}
if (typeof window === 'undefined') {
  ;(globalThis as unknown as Record<string, unknown>).window = {
    addEventListener: () => {},
    clearTimeout: () => {},
    setTimeout: () => 0,
    dispatchEvent: () => true,
  }
}

describe('Phase 4: Wardrobe & Store Shopping UI', () => {
  beforeEach(() => {
    fakeBody.children = []
    playerState.reset()
    playerState.currency = new CurrencyManager(200)
    playerState.save(true)
  })

  describe('CharacterCreatorModal', () => {
    it('initializes with player state customization and renders all style groups', () => {
      const onApply = vi.fn()
      const modal = new CharacterCreatorModal(onApply)

      expect(HAIR_STYLES.length).toBe(5)
      expect(HAIR_COLORS.length).toBe(6)
      expect(SKIN_TONES.length).toBe(4)
      expect(EYE_COLORS.length).toBe(5)

      modal.open()
      const sheet = fakeBody.querySelector('.creator-modal-sheet')
      expect(sheet).not.toBeNull()

      const saveBtn = fakeBody.querySelector<FakeElement>('#creator-save')
      const cancelBtn = fakeBody.querySelector<FakeElement>('#creator-cancel')
      expect(saveBtn).not.toBeNull()
      expect(cancelBtn).not.toBeNull()

      modal.close(false)
    })

    it('previews live changes without immediately mutating saved playerState', () => {
      const initialHairStyle = playerState.data.character.customization.hairStyle
      const appliedList: AvatarCustomization[] = []
      const onApply = vi.fn((custom: AvatarCustomization) => {
        appliedList.push({ ...custom })
      })

      const modal = new CharacterCreatorModal(onApply)
      modal.open()

      const bobBtn = fakeBody.querySelector<FakeElement>('[data-style="bob"]')
      expect(bobBtn).not.toBeNull()
      bobBtn?.click()

      // Live apply must have fired with bob
      expect(appliedList.length).toBeGreaterThan(0)
      expect(appliedList[appliedList.length - 1]!.hairStyle).toBe('bob')

      // playerState should NOT be modified yet before clicking save
      expect(playerState.data.character.customization.hairStyle).toBe(initialHairStyle)

      modal.close(false)
    })

    it('cancelling restores original customization and reverts live preview', () => {
      const originalCustom = { ...playerState.data.character.customization }
      const appliedList: AvatarCustomization[] = []
      const onApply = vi.fn((custom: AvatarCustomization) => {
        appliedList.push({ ...custom })
      })

      const modal = new CharacterCreatorModal(onApply)
      modal.open()

      // Change to pixie
      const pixieBtn = fakeBody.querySelector<FakeElement>('[data-style="pixie"]')
      pixieBtn?.click()
      expect(appliedList[appliedList.length - 1]!.hairStyle).toBe('pixie')

      // Click cancel button
      const cancelBtn = fakeBody.querySelector<FakeElement>('#creator-cancel')
      cancelBtn?.click()

      // Should have restored original
      expect(appliedList[appliedList.length - 1]!.hairStyle).toBe(originalCustom.hairStyle)
      expect(playerState.data.character.customization.hairStyle).toBe(originalCustom.hairStyle)
    })

    it('saving commits look to playerState and persists', () => {
      const onApply = vi.fn()
      const modal = new CharacterCreatorModal(onApply)
      modal.open()

      // Select lavender hair color (0xb89fe8 = 12099560)
      const lavenderBtn = fakeBody.querySelector<FakeElement>('[data-hair-color="12099560"]')
      lavenderBtn?.click()

      // Select twin buns
      const bunsBtn = fakeBody.querySelector<FakeElement>('[data-style="twin_buns"]')
      bunsBtn?.click()

      const saveBtn = fakeBody.querySelector<FakeElement>('#creator-save')
      saveBtn?.click()

      expect(playerState.data.character.customization.hairColor).toBe(12099560)
      expect(playerState.data.character.customization.hairStyle).toBe('twin_buns')
    })
  })

  describe('Wardrobe & Categories', () => {
    const filters = ['all', 'dress', 'top', 'bottom', 'shoes', 'hat', 'accessory']

    it('covers all 7 wardrobe category filters', () => {
      expect(filters).toEqual(['all', 'dress', 'top', 'bottom', 'shoes', 'hat', 'accessory'])
      filters.forEach((filter) => {
        if (filter === 'all') {
          expect(CLOTHING_DEFINITIONS.length).toBeGreaterThan(0)
        } else {
          const matching = CLOTHING_DEFINITIONS.filter((item) => item.layer === filter)
          expect(matching.length).toBeGreaterThan(0)
        }
      })
    })

    it('correctly filters owned clothes and identifies empty category state', () => {
      // Default owned items
      const owned = playerState.data.ownedClothing
      expect(owned.length).toBeGreaterThan(0)

      filters.forEach((filter) => {
        const ownedInCategory = CLOTHING_DEFINITIONS.filter((item) => {
          const isOwned = owned.includes(item.id)
          const matches = filter === 'all' || item.layer === filter
          return isOwned && matches
        })

        if (filter === 'accessory') {
          // Default save has 0 owned accessories -> triggers empty state!
          expect(ownedInCategory.length).toBe(0)
        } else {
          expect(ownedInCategory.length).toBeGreaterThan(0)
        }
      })
    })

    it('equipping owned items updates equipped clothes without corruption', () => {
      const topItem = 'top_strawberry'
      expect(playerState.ownsClothing(topItem)).toBe(true)
      const def = ClothingRegistry.get(topItem)!
      playerState.data.character.equipped[def.layer] = topItem
      playerState.save(true)

      expect(playerState.data.character.equipped.top).toBe(topItem)
    })
  })

  describe('Boutique Catalogue & Purchase Flow', () => {
    it('has complete valid items in boutique with prices and layers', () => {
      const boutiqueItems = CLOTHING_DEFINITIONS.filter((item) => item.shop === 'clothing_boutique')
      expect(boutiqueItems.length).toBeGreaterThan(20)

      boutiqueItems.forEach((item) => {
        expect(item.id).toBeTruthy()
        expect(item.name).toBeTruthy()
        expect(item.price).toBeGreaterThanOrEqual(0)
        expect(['top', 'bottom', 'dress', 'hat', 'shoes', 'accessory']).toContain(item.layer)
      })
    })

    it('purchase service completes purchase, updates coins and owned list', () => {
      const service = new ShopPurchaseService(playerState)
      playerState.currency = new CurrencyManager(100)

      const targetItem = 'dress_lavender_ruffle' // Price: 80
      expect(playerState.ownsClothing(targetItem)).toBe(false)

      const result = service.buyClothing(targetItem)
      expect(result).toBe('purchased')
      expect(playerState.ownsClothing(targetItem)).toBe(true)
      expect(playerState.currency.getBalance()).toBe(20) // 100 - 80 = 20
    })

    it('rejects purchase when star coins are insufficient', () => {
      const service = new ShopPurchaseService(playerState)
      playerState.currency = new CurrencyManager(10)

      const targetItem = 'dress_yellow_sunshine' // Price: 70
      const result = service.buyClothing(targetItem)
      expect(result).toBe('insufficient')
      expect(playerState.ownsClothing(targetItem)).toBe(false)
      expect(playerState.currency.getBalance()).toBe(10)
    })
  })

  describe('Supermarket Basket & Checkout Flow', () => {
    it('provides complete market products with prices and icons', () => {
      const products = ITEM_DEFINITIONS.filter((item) => item.shop === 'supermarket')
      expect(products.length).toBe(15)

      products.forEach((p) => {
        expect(p.id).toBeTruthy()
        expect(p.name).toBeTruthy()
        expect(p.icon).toBeTruthy()
        expect(p.price).toBeGreaterThan(0)
      })
    })

    it('manages cart lines, totals, and basket empty status', () => {
      const cart = new ShoppingCartManager()
      expect(cart.isEmpty()).toBe(true)
      expect(cart.total()).toBe(0)

      cart.add('apple_01', 2) // 5 * 2 = 10
      cart.add('milk_01', 1)  // 12 * 1 = 12
      expect(cart.isEmpty()).toBe(false)
      expect(cart.total()).toBe(22)
      expect(cart.lines().length).toBe(2)

      cart.remove('apple_01', 1)
      expect(cart.total()).toBe(17)

      cart.clear()
      expect(cart.isEmpty()).toBe(true)
      expect(cart.total()).toBe(0)
      expect(cart.lines().length).toBe(0)
    })

    it('completes checkout, deducts coins, adds to player inventory, and clears basket', () => {
      const cart = new ShoppingCartManager()
      const service = new ShopPurchaseService(playerState)
      playerState.currency = new CurrencyManager(50)

      const initialBanana = playerState.inventory.quantity('banana_01')
      const initialBread = playerState.inventory.quantity('bread_01')

      cart.add('banana_01', 2) // 4 * 2 = 8
      cart.add('bread_01', 1)  // 14 * 1 = 14
      // Total = 22

      const result = service.checkout(cart)
      expect(result).toBe('purchased')
      expect(playerState.currency.getBalance()).toBe(28) // 50 - 22 = 28
      expect(playerState.inventory.quantity('banana_01')).toBe(initialBanana + 2)
      expect(playerState.inventory.quantity('bread_01')).toBe(initialBread + 1)
      expect(cart.isEmpty()).toBe(true)
    })

    it('cancelling or clearing cart leaves currency and inventory intact', () => {
      const cart = new ShoppingCartManager()
      playerState.currency = new CurrencyManager(50)
      const initialInvSnapshot = playerState.inventory.snapshot()

      cart.add('cake_01', 2)
      expect(cart.total()).toBe(50)

      // User clears basket
      cart.clear()
      expect(cart.isEmpty()).toBe(true)
      expect(playerState.currency.getBalance()).toBe(50)
      expect(playerState.inventory.snapshot()).toEqual(initialInvSnapshot)
    })
  })
})
