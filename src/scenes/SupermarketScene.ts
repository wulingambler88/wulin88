import { treasureManager } from '../treasure/TreasureManager'
import Phaser from 'phaser'
import { Character } from '../characters/Character'
import { NPCBase } from '../characters/NPCBase'
import { PropRenderer } from '../items/PropRenderer'
import { ITEM_DEFINITIONS } from '../data/items'
import { audioManager } from '../audio/AudioManager'
import { locationManager } from '../navigation/LocationManager'
import { ShopPurchaseService } from '../shops/ShopPurchaseService'
import { ShoppingCartManager } from '../shops/ShoppingCartManager'
import { playerState } from '../state/PlayerState'
import { setHelper, showToast } from '../ui/UIManager'
import { confirmModal } from '../ui/ConfirmModal'

const PRODUCTS = ITEM_DEFINITIONS.filter((item) => item.shop === 'supermarket')
const OUTLINE = 0x663d63
const OUTLINE_LIGHT = 0x78504b

export class SupermarketScene extends Phaser.Scene {
  private readonly cart = new ShoppingCartManager()
  private purchase!: ShopPurchaseService
  private character!: Character
  private cashierNPC!: NPCBase
  private debugElapsed = 0

  constructor() { super('SupermarketScene') }

  create(): void {
    locationManager.resetLock()
    playerState.setLocation('supermarket')
    this.purchase = new ShopPurchaseService(playerState)
    this.drawMarket()
    this.drawProducts()
    this.drawCashier()
    this.drawScannerStation()

    this.character = new Character(this, { ...playerState.data.character, x: 500, y: 430, state: 'standing' })
    this.input.setDraggable(this.character, false)
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (!over.length && pointer.y > 370) {
        this.character.walkTo(Phaser.Math.Clamp(pointer.x, 80, 680), Phaser.Math.Clamp(pointer.y, 400, 450))
      }
    })

    treasureManager.spawnClueIfPresent(this, 'supermarket')
    this.bindActions()
    this.game.events.emit('ui:context', 'supermarket')
    this.game.events.emit('ui:stats', { ...this.character.stats })
    this.game.events.emit('market:products', PRODUCTS)
    this.emitCart()
    setHelper('Tap fresh products to pop them into your shopping basket!')
    this.cameras.main.fadeIn(320, 255, 248, 233)
  }

  update(_time: number, delta: number): void {
    this.debugElapsed += delta
    if (this.debugElapsed < 400) return
    this.debugElapsed = 0
    this.game.events.emit('debug:update', {
      fps: Math.round(this.game.loop.actualFps),
      selected: 'none',
      x: Math.round(this.character.x),
      y: Math.round(this.character.y),
      state: this.character.stateMachine.value,
      zone: 'supermarket',
      inventory: JSON.stringify(playerState.inventory.snapshot()),
      scene: 'Supermarket',
      currency: playerState.currency.getBalance(),
      cartTotal: this.cart.total(),
    })
  }

  private drawMarket(): void {
    const g = this.add.graphics()

    // 1. Soft Warm Cream Wall & Pastel Checker Floor
    g.fillStyle(0xfef8ed).fillRect(0, 0, 960, 370)
    // Wood wainscoting paneling
    g.fillStyle(0xecd5bd).fillRect(0, 310, 960, 60)
    g.lineStyle(2, OUTLINE_LIGHT, 0.4).lineBetween(0, 310, 960, 310)

    // Mint & Cream Checker Floor with subtle perspective
    g.fillStyle(0xd5ede1).fillRect(0, 370, 960, 170)
    g.fillStyle(0xffffff, 0.4)
    for (let x = 0; x < 960; x += 60) {
      for (let y = 370; y < 540; y += 42) {
        if ((x / 60 + Math.floor((y - 370) / 42)) % 2 === 0) {
          g.fillRect(x, y, 60, 42)
        }
      }
    }

    // 2. Illustrated Wooden Grocery Shelves (Main Wall Unit)
    // Shelf Backboard
    g.fillStyle(0xdfba91).fillRoundedRect(50, 90, 490, 250, 16)
    g.lineStyle(2.5, OUTLINE).strokeRoundedRect(50, 90, 490, 250, 16)

    // 3 Tier Shelves with soft depth
    for (let row = 0; row < 3; row++) {
      const sy = 160 + row * 76
      // Shelf board
      g.fillStyle(0xfff3e3).fillRoundedRect(42, sy, 506, 16, 6)
      g.lineStyle(2, OUTLINE).strokeRoundedRect(42, sy, 506, 16, 6)
      // Shelf shadow underneath
      g.fillStyle(0x000000, 0.08).fillRect(44, sy + 16, 502, 6)
    }

    // 3. Illustrated Chilled Beverage Refrigerator
    const rx = 565
    const ry = 95
    // Fridge Frame
    g.fillStyle(0xb5e2fa).fillRoundedRect(rx, ry, 175, 245, 16)
    g.lineStyle(2.5, OUTLINE).strokeRoundedRect(rx, ry, 175, 245, 16)
    // Glass Door Panels
    g.fillStyle(0xffffff, 0.7).fillRoundedRect(rx + 10, ry + 12, 155, 105, 10).strokeRoundedRect(rx + 10, ry + 12, 155, 105, 10)
    g.fillStyle(0xffffff, 0.7).fillRoundedRect(rx + 10, ry + 125, 155, 105, 10).strokeRoundedRect(rx + 10, ry + 125, 155, 105, 10)
    // Glass Reflection Slanted Sheen
    g.fillStyle(0xffffff, 0.45)
      .fillTriangle(rx + 20, ry + 15, rx + 65, ry + 15, rx + 30, ry + 110)
      .fillTriangle(rx + 20, ry + 130, rx + 65, ry + 130, rx + 30, ry + 225)
    // "CHILLED" Badge
    this.add.text(rx + 88, ry + 22, '❄️ CHILLED', {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#023e8a',
      fontStyle: 'bold',
      backgroundColor: '#ffffffcc',
      padding: { x: 6, y: 2 },
    }).setOrigin(0.5)

    // 4. Illustrated Produce Stand
    const produce = this.add.image(652, 268, 'world-furniture', 10).setDisplaySize(205, 250).setInteractive({ useHandCursor: true })
    produce.on('pointerdown', () => this.game.events.emit('world:browse-market'))

    // 5. Title & Store Bunting Banner
    const banner = this.add.graphics()
    banner.fillStyle(0xffffff, 0.94).fillRoundedRect(30, 18, 320, 52, 16)
    banner.lineStyle(2, 0xf2c4ce).strokeRoundedRect(30, 18, 320, 52, 16)
    this.add.text(48, 30, '🛒 Sunny Basket Market', {
      fontFamily: 'Trebuchet MS',
      fontSize: '22px',
      color: '#6e4458',
      fontStyle: 'bold',
    })
    this.add.text(48, 52, 'Fresh organic fruits, bakery & snacks', {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#8b687f',
    })

    // Pendant Lamps
    for (const lx of [200, 420, 650]) {
      g.lineStyle(1.8, OUTLINE).lineBetween(lx, 0, lx, 32)
      g.fillStyle(0xffd166).fillCircle(lx, 36, 10).lineStyle(1.5, OUTLINE).strokeCircle(lx, 36, 10)
      // Light glow cone
      const glow = this.add.graphics().fillStyle(0xfffae0, 0.08).fillTriangle(lx, 36, lx - 45, 160, lx + 45, 160)
      this.tweens.add({ targets: glow, alpha: 0.15, duration: 2000 + Math.random() * 500, yoyo: true, repeat: -1 })
    }
  }

  private drawProducts(): void {
    PRODUCTS.forEach((item, index) => {
      const column = index % 5
      const row = Math.floor(index / 5)
      const px = 100 + column * 92
      const py = 140 + row * 76

      const productContainer = this.add.container(px, py)

      // Illustrated Prop via PropRenderer
      const propG = this.add.graphics()
      PropRenderer.drawProp(propG, item.id, 0, -4, 0.88)

      // Price Tag Pill underneath
      const tagG = this.add.graphics()
      tagG.fillStyle(0xffffff, 0.92).fillRoundedRect(-22, 14, 44, 16, 6)
      tagG.lineStyle(1.2, 0xefc6b3).strokeRoundedRect(-22, 14, 44, 16, 6)
      const priceText = this.add.text(0, 22, `⭐${item.price ?? 5}`, {
        fontFamily: 'Trebuchet MS',
        fontSize: '10px',
        color: '#754c72',
        fontStyle: 'bold',
      }).setOrigin(0.5)

      productContainer.add([propG, tagG, priceText])
      productContainer.setSize(60, 60).setInteractive({ useHandCursor: true })

      productContainer.on('pointerdown', () => {
        this.addProduct(item.id)
        // Little flying copy toward basket
        const fly = this.add.graphics().setPosition(px, py).setDepth(4500)
        PropRenderer.drawProp(fly, item.id, 0, 0, 0.7)
        this.tweens.add({
          targets: fly,
          x: 840,
          y: 360,
          scale: 0.3,
          alpha: 0.2,
          duration: 340,
          ease: 'Cubic.easeIn',
          onComplete: () => fly.destroy(),
        })
      })

      productContainer.on('pointerover', () => {
        this.tweens.add({ targets: productContainer, scale: 1.14, duration: 100 })
      })
      productContainer.on('pointerout', () => {
        this.tweens.add({ targets: productContainer, scale: 1, duration: 100 })
      })
    })
  }

  private drawCashier(): void {
    // Illustrated Oliver Cashier NPC
    this.cashierNPC = new NPCBase(this, 755, 310, {
      id: 'oliver',
      name: 'Oliver',
      role: 'Cashier',
      spriteKey: 'resident-market',
      skinColor: 0xffdfc5,
      hairStyle: 'short_tidy',
      hairColor: 0x486985,
      eyeColor: 0x3d3544,
      outfitColor: 0xffd166,
      apronColor: 0x52b788,
      accessory: 'cap',
      icon: '🛒',
      dialogues: [
        'Fresh sweet apples and bananas just arrived today!',
        'Beep! That will make a delicious, healthy snack!',
        'Tap any shelf to pack goodies into your shopping basket!',
        'Star Coins make the world go round! Thank you!',
      ],
    })
    this.cashierNPC.setScale(0.85).setDepth(200)
  }

  private drawScannerStation(): void {
    // Checkout Counter Furniture
    const cg = this.add.graphics()
    cg.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(715, 335, 230, 130, 16)
    cg.fillStyle(0xfce5cd).fillRoundedRect(720, 330, 220, 125, 16).lineStyle(2.5, OUTLINE).strokeRoundedRect(720, 330, 220, 125, 16)
    cg.fillStyle(0xffffff).fillRoundedRect(710, 318, 240, 26, 10).lineStyle(2.5, OUTLINE).strokeRoundedRect(710, 318, 240, 26, 10)

    const station = this.add.container(850, 280).setDepth(300)
    const g = this.add.graphics()

    // Cash Register base & monitor
    g.fillStyle(0x754c72).fillRoundedRect(-28, -34, 56, 44, 8)
    g.lineStyle(2, OUTLINE).strokeRoundedRect(-28, -34, 56, 44, 8)
    g.fillStyle(0x2a2a3a).fillRoundedRect(-22, -28, 44, 24, 4) // Screen
    g.fillStyle(0xffd8a8).fillRoundedRect(-36, 10, 72, 20, 6).lineStyle(1.8, OUTLINE).strokeRoundedRect(-36, 10, 72, 20, 6) // Keypad

    const screenText = this.add.text(0, -16, 'READY', {
      fontFamily: 'Courier New',
      fontSize: '10px',
      color: '#00ff88',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // Laser scanning pad on the counter
    const pad = this.add.rectangle(-65, 30, 45, 14, 0x333333).setStrokeStyle(2, 0xffffff)
    const laserBeam = this.add.rectangle(-65, 30, 41, 3, 0xff0055).setAlpha(0.7)
    this.tweens.add({ targets: laserBeam, alpha: 0.2, duration: 400, yoyo: true, repeat: -1 })

    station.add([g, screenText, pad, laserBeam]).setSize(140, 80).setInteractive({ useHandCursor: true })

    station.on('pointerdown', () => {
      audioManager.play('pop')
      screenText.setText('BEEP!').setColor('#ffea00')
      laserBeam.setAlpha(1).setScale(1.2)
      this.tweens.add({ targets: laserBeam, scaleX: 1, scaleY: 1, alpha: 0.7, duration: 180 })

      // Tip reward
      const tip = 3
      playerState.currency.add(tip)
      playerState.data.minigames = playerState.data.minigames ?? {}
      playerState.data.minigames.supermarketScanner = (playerState.data.minigames.supermarketScanner ?? 0) + 1
      playerState.save(true)

      // Receipt effect
      const receipt = this.add.text(station.x, station.y - 45, `🧾 +${tip} ⭐`, {
        fontFamily: 'Trebuchet MS',
        fontSize: '14px',
        color: '#754c72',
        fontStyle: 'bold',
        backgroundColor: '#fff1ad',
        padding: { x: 5, y: 2 },
      }).setOrigin(0.5).setDepth(4000)

      this.tweens.add({
        targets: receipt,
        y: receipt.y - 30,
        alpha: 0,
        duration: 900,
        onComplete: () => {
          receipt.destroy()
          screenText.setText('READY').setColor('#00ff88')
        },
      })

      showToast(`*BEEP!* Scanned product! +${tip} ⭐ cashier tip!`)
    })
  }

  private bindActions(): void {
    const add = (itemId: string): void => this.addProduct(itemId)
    const remove = (itemId: string): void => {
      if (this.cart.remove(itemId)) {
        this.emitCart()
        audioManager.play('button')
      }
    }
    const clear = (): void => {
      this.cart.clear()
      this.emitCart()
    }
    const checkout = (): void => {
      const total = this.cart.total()
      const result = this.purchase.checkout(this.cart)
      if (result === 'empty') {
        showToast('Your basket is empty')
        return
      }
      if (result === 'insufficient') {
        showToast('You need more ⭐')
        this.game.events.emit('market:insufficient')
        return
      }
      audioManager.play('purchase')
      showToast(`Groceries packed! -${total} ⭐`)
      this.cashierNPC?.playTapGreeting()
      this.character?.playCelebrate()
      this.emitCart()
    }
    const leave = (destination: 'town' | 'home'): void => {
      const go = (): void => {
        this.cart.clear()
        locationManager.navigate(this, destination, playerState.data.unlockedLocations)
      }
      if (this.cart.isEmpty()) { go(); return }
      confirmModal.ask({
        title: 'Leave the market?',
        message: 'Your basket still has groceries. Leave without buying them?',
        confirmLabel: 'Leave',
        cancelLabel: 'Keep shopping',
        onConfirm: go,
      })
    }
    const map = (): void => leave('town')
    const home = (): void => leave('home')
    this.game.events
      .on('market:add', add)
      .on('market:remove', remove)
      .on('market:clear', clear)
      .on('market:checkout', checkout)
      .on('ui:map', map)
      .on('ui:home', home)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events
        .off('market:add', add)
        .off('market:remove', remove)
        .off('market:clear', clear)
        .off('market:checkout', checkout)
        .off('ui:map', map)
        .off('ui:home', home)
      this.game.events.emit('market:hide')
    })
  }

  private addProduct(itemId: string): void {
    if (!this.cart.add(itemId)) return
    audioManager.play('pickup')
    showToast('Added to basket')
    this.emitCart()
  }

  private emitCart(): void {
    this.game.events.emit('market:cart', {
      lines: this.cart.lines(),
      total: this.cart.total(),
      starCoins: playerState.currency.getBalance(),
    })
  }
}
