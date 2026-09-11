import Phaser from 'phaser'
import { Character } from '../characters/Character'
import { NPCBase } from '../characters/NPCBase'
import type { EquippedClothing } from '../characters/ClothingManager'
import { CLOTHING_DEFINITIONS, ClothingRegistry } from '../data/clothes'
import { audioManager } from '../audio/AudioManager'
import { locationManager } from '../navigation/LocationManager'
import { ShopPurchaseService } from '../shops/ShopPurchaseService'
import { playerState } from '../state/PlayerState'
import { SpeechBubble } from '../ui/SpeechBubble'
import { setHelper, showToast } from '../ui/UIManager'

export class ClothingShopScene extends Phaser.Scene {
  private character!: Character
  private previewBase?: EquippedClothing
  private selectedId?: string
  private purchase!: ShopPurchaseService

  constructor() { super('ClothingShopScene') }

  create(): void {
    locationManager.resetLock()
    playerState.setLocation('clothing_boutique')
    playerState.data.progress.firstBoutiqueVisit = true
    this.purchase = new ShopPurchaseService(playerState)
    this.drawBoutique()
    this.character = new Character(this, { ...playerState.data.character, x: 610, y: 420, state: 'standing' })
    this.character.setDepth(1000)
    this.input.setDraggable(this.character, false)
    this.drawShopkeeper()
    this.bindActions()
    this.game.events.emit('ui:context', 'boutique')
    this.game.events.emit('ui:stats', { ...this.character.stats })
    this.game.events.emit('shop:catalog', CLOTHING_DEFINITIONS)
    this.emitShopState()
    setHelper('Tap an outfit to try it on')
    this.cameras.main.fadeIn(320, 255, 248, 233)
  }

  private debugElapsed = 0

  update(_time: number, delta: number): void {
    this.debugElapsed += delta
    if (this.debugElapsed < 400) return
    this.debugElapsed = 0
    this.game.events.emit('debug:update', {
      fps: Math.round(this.game.loop.actualFps),
      selected: this.selectedId ?? 'none',
      x: 610,
      y: 420,
      state: 'standing',
      zone: 'boutique',
      inventory: JSON.stringify(playerState.inventory.snapshot()),
      scene: 'Boutique',
      currency: playerState.currency.getBalance(),
      cartTotal: 0,
    })
  }

  private drawBoutique(): void {
    this.add.image(480, 175, 'world-rooms', 'wall-0').setDisplaySize(960, 350)
    this.add.image(480, 445, 'world-rooms', 'floor-0').setDisplaySize(960, 190)
    this.add.text(34, 24, 'Cloudberry Boutique', { fontFamily: 'Trebuchet MS', fontSize: '28px', color: '#79524f', fontStyle: 'bold', backgroundColor: '#fff8e9ee', padding: { x: 14, y: 8 } })
    const rack = this.add.image(270, 255, 'boutique-rack').setDisplaySize(280, 290).setInteractive({ useHandCursor: true })
    rack.on('pointerdown', () => { audioManager.play('wardrobe'); this.game.events.emit('world:browse-outfits') })
    const mirror = this.add.image(526, 247, 'world-furniture', 9).setDisplaySize(155, 292).setInteractive({ useHandCursor: true })
    mirror.on('pointerdown', () => this.character.walkTo(535, 402, () => { this.character.react('playing', 900); this.sparkles() }))
    this.add.image(800, 390, 'world-furniture', 4).setDisplaySize(140, 155).setDepth(400)
    this.add.image(880, 390, 'world-furniture', 7).setDisplaySize(92, 148).setDepth(400)
    rack.setDepth(300)
    mirror.setDepth(300)
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (!over.length && pointer.y > 355) this.character.walkTo(Phaser.Math.Clamp(pointer.x, 160, 800), Phaser.Math.Clamp(pointer.y, 375, 440))
    })
  }

  private drawShopkeeper(): void {
    const npc = new NPCBase(this, 100, 345, {
      id: 'clara_boutique',
      name: 'Clara',
      role: 'Stylist',
      spriteKey: 'resident-boutique',
      dialogues: [
        'Try something cute! 👗',
        'You look fabulous! ✨',
        'Welcome to Cloudberry! 🌸',
        'That outfit is gorgeous! 💖',
        'Hand-tailored with love! 🎀',
      ],
      icon: '👗',
    })
    npc.setScale(0.72).setDepth(1100)
    new SpeechBubble(this, 120, 240, 'Try something cute!', '👗', 3000)
  }

  private bindActions(): void {
    const preview = (itemId: string): void => {
      if (!ClothingRegistry.has(itemId)) return
      if (!this.previewBase) this.previewBase = this.character.outfit()
      this.selectedId = itemId
      this.character.equip(itemId)
      this.emitShopState()
      audioManager.play('wardrobe')
    }
    const cancel = (): void => {
      if (this.previewBase) this.character.restoreOutfit(this.previewBase)
      this.previewBase = undefined
      this.selectedId = undefined
      this.emitShopState()
      showToast('Back to your original look')
    }
    const buy = (): void => {
      if (!this.selectedId) return
      if (playerState.ownsClothing(this.selectedId)) {
        playerState.data.character.equipped = this.character.outfit()
        playerState.save(true)
        this.previewBase = this.character.outfit()
        showToast('Outfit on!')
        this.emitShopState()
        return
      }
      const result = this.purchase.buyClothing(this.selectedId)
      if (result === 'insufficient') { showToast('Need more ⭐'); this.emitShopState(); return }
      if (result !== 'purchased') return
      playerState.data.character.equipped = this.character.outfit()
      this.character.updateStat('happiness', 15)
      this.character.updateStat('fun', 10)
      playerState.data.character = this.character.toSave()
      playerState.save(true)
      this.previewBase = this.character.outfit()
      audioManager.play('purchase')
      showToast('New Outfit! +Happiness!')
      this.sparkles()
      this.emitShopState()
    }
    const map = (): void => { cancel(); locationManager.navigate(this, 'town', playerState.data.unlockedLocations) }
    const home = (): void => { cancel(); locationManager.navigate(this, 'home', playerState.data.unlockedLocations) }
    this.game.events.on('shop:preview', preview).on('shop:cancel', cancel).on('shop:buy', buy).on('ui:map', map).on('ui:home', home)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('shop:preview', preview).off('shop:cancel', cancel).off('shop:buy', buy).off('ui:map', map).off('ui:home', home)
      this.game.events.emit('shop:hide')
    })
  }

  private emitShopState(): void {
    this.game.events.emit('shop:state', { selectedId: this.selectedId, owned: [...playerState.data.ownedClothing], starCoins: playerState.currency.getBalance() })
  }

  private sparkles(): void {
    for (let index = 0; index < 7; index += 1) {
      const star = this.add.text(this.character.x, this.character.y - 70, '★', { fontSize: '24px', color: index % 2 ? '#ff8fc4' : '#ffd96f' }).setDepth(4900)
      this.tweens.add({ targets: star, x: star.x + (index - 3) * 24, y: star.y - 75, alpha: 0, duration: 800, onComplete: () => star.destroy() })
    }
  }
}
