import { treasureManager } from '../treasure/TreasureManager'
import Phaser from 'phaser'
import { Character } from '../characters/Character'
import { NPCBase } from '../characters/NPCBase'
import { PropRenderer } from '../items/PropRenderer'
import { audioManager } from '../audio/AudioManager'
import { locationManager } from '../navigation/LocationManager'
import { playerState } from '../state/PlayerState'
import { setHelper, showToast } from '../ui/UIManager'

const OUTLINE = 0x663d63
const OUTLINE_LIGHT = 0x78504b

export class CafeScene extends Phaser.Scene {
  private character!: Character
  private baristaNPC!: NPCBase
  private debugElapsed = 0

  constructor() { super('CafeScene') }

  create(): void {
    locationManager.resetLock()
    playerState.setLocation('cafe')
    this.drawCafe()
    this.drawBarista()
    this.drawBrewStation()
    this.drawBakeryDisplay()
    this.drawBooths()

    this.character = new Character(this, { ...playerState.data.character, x: 500, y: 430, state: 'standing' })
    this.input.setDraggable(this.character, false)
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (!over.length && pointer.y > 330) {
        this.character.walkTo(Phaser.Math.Clamp(pointer.x, 80, 880), Phaser.Math.Clamp(pointer.y, 380, 460))
      }
    })

    treasureManager.spawnClueIfPresent(this, 'cafe')
    this.bindActions()
    this.game.events.emit('ui:context', 'venue')
    this.game.events.emit('ui:stats', { ...this.character.stats })
    setHelper('Tap the espresso machine or bakery case to order, or relax in a booth')
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
      zone: 'cafe',
      inventory: JSON.stringify(playerState.inventory.snapshot()),
      scene: 'Cafe',
      currency: playerState.currency.getBalance(),
      cartTotal: 0,
    })
  }

  private drawCafe(): void {
    const g = this.add.graphics()
    this.add.image(780, 300, 'world-furniture', 11).setDisplaySize(210, 178)

    // 1. Warm Cream & Brick Wallpaper
    g.fillStyle(0xfff6ec).fillRect(0, 0, 960, 370)
    // Wood wainscoting paneling
    g.fillStyle(0xe8cfb7).fillRect(0, 310, 960, 60)
    g.lineStyle(2, OUTLINE_LIGHT, 0.4).lineBetween(0, 310, 960, 310)

    // Parquet Wood Floor Planks
    g.fillStyle(0xd9b38c).fillRect(0, 370, 960, 170)
    g.lineStyle(1.5, 0xbf9368, 0.55)
    for (let y = 370; y < 540; y += 34) {
      g.lineBetween(0, y, 960, y)
    }

    // 2. French Window with Sunlit Town View
    const wx = 520
    const wy = 65
    g.fillStyle(0xffffff).fillRoundedRect(wx, wy, 150, 130, 16)
    g.lineStyle(2.5, OUTLINE).strokeRoundedRect(wx, wy, 150, 130, 16)
    g.fillStyle(0xcdebf7).fillRoundedRect(wx + 8, wy + 8, 134, 114, 10)
    // Mountain/tree silhouette in window
    g.fillStyle(0x9ee3b4, 0.6).fillCircle(wx + 45, wy + 115, 30).fillCircle(wx + 95, wy + 115, 40)
    g.fillStyle(0xfff0ad).fillCircle(wx + 110, wy + 35, 14)
    // Soft sunbeam triangle
    g.fillStyle(0xfffae0, 0.2).fillTriangle(wx + 75, wy + 30, wx - 60, wy + 260, wx + 220, wy + 260)

    // 3. Main Bakery & Service Counter
    g.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(70, 305, 350, 135, 16)
    g.fillStyle(0xba8148).fillRoundedRect(75, 300, 340, 130, 16).lineStyle(2.5, OUTLINE).strokeRoundedRect(75, 300, 340, 130, 16)
    // Marble Countertop Surface
    g.fillStyle(0xffffff).fillRoundedRect(65, 286, 360, 26, 10).lineStyle(2.5, OUTLINE).strokeRoundedRect(65, 286, 360, 26, 10)

    // 4. Blackboard Chalkboard Menu on Wall
    g.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(105, 75, 180, 135, 12)
    g.fillStyle(0x4a3424).fillRoundedRect(110, 70, 170, 130, 10).lineStyle(2.5, OUTLINE).strokeRoundedRect(110, 70, 170, 130, 10)
    g.fillStyle(0x2b2d42).fillRoundedRect(118, 78, 154, 114, 6)

    this.add.text(195, 95, '☕ CAFÉ MENU', {
      fontFamily: 'Trebuchet MS',
      fontSize: '13px',
      color: '#ffea78',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.add.text(195, 122, 'Star Latte • ⭐ 12', { fontFamily: 'Trebuchet MS', fontSize: '11px', color: '#ffffff' }).setOrigin(0.5)
    this.add.text(195, 144, 'Fruit Tea • ⭐ 10', { fontFamily: 'Trebuchet MS', fontSize: '11px', color: '#ffffff' }).setOrigin(0.5)
    this.add.text(195, 166, 'Croissant • ⭐ 18', { fontFamily: 'Trebuchet MS', fontSize: '11px', color: '#ffffff' }).setOrigin(0.5)

    // 5. Hanging Copper Pendant Lamps
    for (const lx of [220, 600, 800]) {
      g.lineStyle(2, OUTLINE).lineBetween(lx, 0, lx, 30)
      g.fillStyle(0xd97736).fillTriangle(lx - 16, 42, lx + 16, 42, lx, 30).lineStyle(1.5, OUTLINE).strokeTriangle(lx - 16, 42, lx + 16, 42, lx, 30)
      g.fillStyle(0xffd166).fillCircle(lx, 44, 5)
      const glow = this.add.graphics().fillStyle(0xfffae0, 0.08).fillTriangle(lx, 44, lx - 40, 180, lx + 40, 180)
      this.tweens.add({ targets: glow, alpha: 0.16, duration: 2200 + Math.random() * 600, yoyo: true, repeat: -1 })
    }

    // Title banner
    const banner = this.add.graphics()
    banner.fillStyle(0xffffff, 0.94).fillRoundedRect(30, 14, 320, 48, 14)
    banner.lineStyle(2, 0xefc6b3).strokeRoundedRect(30, 14, 320, 48, 14)
    this.add.text(45, 24, '☕ Honeycomb Bakery & Café', {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#6e4458',
      fontStyle: 'bold',
    })
    this.add.text(45, 44, 'Artisan espresso, hot pastries & cozy seats', {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#8b687f',
    })
  }

  private drawBarista(): void {
    // Barista Leo NPC
    this.baristaNPC = new NPCBase(this, 190, 255, {
      id: 'leo',
      name: 'Leo',
      role: 'Barista',
      spriteKey: 'resident-cafe',
      skinColor: 0xffdfc5,
      hairStyle: 'short_tidy',
      hairColor: 0x4a3424,
      eyeColor: 0x3d3544,
      outfitColor: 0x8a5832,
      apronColor: 0x3d312a,
      accessory: 'cap',
      icon: '☕',
      dialogues: [
        'Welcome to Honeycomb! The fresh beans are grinding right now!',
        'Tap the copper espresso machine to brew your own Star Latte!',
        'Pair your drink with a buttery croissant from the glass case!',
        'Sit back and relax in our sunny window booth! 🥐',
      ],
    })
    this.baristaNPC.setScale(0.85).setDepth(200)
  }

  private drawBrewStation(): void {
    // Illustrated Espresso Machine on Counter
    const station = this.add.container(325, 255).setDepth(300)
    const g = this.add.graphics()

    // Copper body
    g.fillStyle(0xb87333).fillRoundedRect(-26, -38, 52, 54, 8)
    g.lineStyle(2, OUTLINE).strokeRoundedRect(-26, -38, 52, 54, 8)
    // Pressure gauge & dials
    g.fillStyle(0xffffff).fillCircle(0, -24, 7).lineStyle(1.5, OUTLINE).strokeCircle(0, -24, 7)
    g.lineStyle(1.5, 0xd90429).lineBetween(0, -24, 3, -28) // Gauge needle
    // Chrome portafilter spouts
    g.fillStyle(0xcccccc).fillRoundedRect(-14, 0, 28, 8, 2)
    // Ceramic Latte Mug on drip tray
    PropRenderer.drawProp(g, 'cafe_latte_01', 0, 10, 0.6)

    station.add(g)
    station.setSize(64, 64).setInteractive({ useHandCursor: true })

    station.on('pointerdown', () => {
      const price = 12
      if (!playerState.currency.spend(price)) {
        showToast(`Need ${price} ⭐ for a Star Latte!`)
        audioManager.play('button')
        return
      }
      audioManager.play('pop')
      // Steam animation puffs
      for (let i = 0; i < 4; i++) {
        const steam = this.add.text(station.x + (i - 1.5) * 8, station.y - 40, '~', {
          fontFamily: 'Trebuchet MS',
          fontSize: '20px',
          color: '#ffffff',
        }).setDepth(4500)
        this.tweens.add({
          targets: steam,
          y: steam.y - 35,
          alpha: 0,
          scale: 1.3,
          duration: 700,
          delay: i * 80,
          onComplete: () => steam.destroy(),
        })
      }

      this.character?.updateStat('hunger', 10)
      this.character?.updateStat('energy', 15)
      playerState.data.character = this.character.toSave()
      playerState.save(true)
      showToast(`Enjoyed a steaming Star Latte! -${price} ⭐ +Energy ⚡`)
      this.baristaNPC?.playTapGreeting()
      this.character?.playCelebrate()
    })
  }

  private drawBakeryDisplay(): void {
    // Glass Dome Pastry Case on Counter
    const bx = 110
    const by = 265
    const caseContainer = this.add.container(bx, by).setDepth(300)
    const g = this.add.graphics()

    // Wood base
    g.fillStyle(0xa67c52).fillRoundedRect(-28, 12, 56, 10, 4).lineStyle(1.5, OUTLINE).strokeRoundedRect(-28, 12, 56, 10, 4)
    // Glass Dome
    g.fillStyle(0xcae9ff, 0.5).fillCircle(0, 0, 24).lineStyle(2, 0xffffff, 0.8).strokeCircle(0, 0, 24)
    // Illustrated Croissant inside
    PropRenderer.drawProp(g, 'cafe_croissant_01', 0, 2, 0.65)

    caseContainer.add(g)
    caseContainer.setSize(60, 50).setInteractive({ useHandCursor: true })

    caseContainer.on('pointerdown', () => {
      if (playerState.currency.spend(18)) {
        this.character?.updateStat('hunger', 25)
        this.character?.updateStat('happiness', 15)
        playerState.data.character = this.character.toSave()
        playerState.save(true)
        audioManager.play('purchase')
        showToast('Enjoyed a warm croissant! -18 ⭐ +Hunger 🥐')
        this.character?.playCelebrate()
      } else {
        showToast('Need 18 ⭐ for a fresh croissant!')
        audioManager.play('button')
      }
    })
  }

  private drawBooths(): void {
    // 2 Cozy Dining Tables with chairs & illustrated food
    const tables = [
      { tx: 560, ty: 410, cx1: 505, cx2: 615 },
      { tx: 800, ty: 410, cx1: 745, cx2: 855 },
    ]

    tables.forEach((t, i) => {
      const g = this.add.graphics()

      // Left Chair
      g.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(t.cx1 - 22, t.ty - 6, 44, 48, 8)
      g.fillStyle(0xffafcc).fillRoundedRect(t.cx1 - 20, t.ty - 8, 40, 44, 8).lineStyle(2, OUTLINE).strokeRoundedRect(t.cx1 - 20, t.ty - 8, 40, 44, 8)
      const leftChair = this.add.rectangle(t.cx1, t.ty + 10, 50, 50, 0xffffff, 0.001).setInteractive({ useHandCursor: true })
      leftChair.on('pointerdown', () => {
        if (!this.character.setDurableState('sitting')) { showToast('Qian Hui is busy right now!') ; return }
        this.character.setPosition(t.cx1, t.ty + 10)
        this.character.setExpression('happy')
        this.character.updateStat('energy', 15)
        this.character.updateStat('happiness', 10)
        playerState.data.character = this.character.toSave()
        playerState.save(true)
        audioManager.play('drop')
        showToast(`Relaxing in booth #${i + 1}! ☕ +Energy ⚡`)
      })

      // Table & Base
      g.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(t.tx - 36, t.ty - 4, 72, 54, 10)
      g.fillStyle(0xfde2b3).fillRoundedRect(t.tx - 34, t.ty - 6, 68, 50, 8).lineStyle(2.5, OUTLINE).strokeRoundedRect(t.tx - 34, t.ty - 6, 68, 50, 8)
      // Ceramic plate with illustrated croissant or cake
      g.fillStyle(0xffffff).fillCircle(t.tx, t.ty + 6, 16).lineStyle(1.5, OUTLINE).strokeCircle(t.tx, t.ty + 6, 16)
      PropRenderer.drawProp(g, i === 0 ? 'cafe_croissant_01' : 'cake_01', t.tx, t.ty + 4, 0.5)

      // Right Chair
      g.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(t.cx2 - 22, t.ty - 6, 44, 48, 8)
      g.fillStyle(0xffafcc).fillRoundedRect(t.cx2 - 20, t.ty - 8, 40, 44, 8).lineStyle(2, OUTLINE).strokeRoundedRect(t.cx2 - 20, t.ty - 8, 40, 44, 8)
      const rightChair = this.add.rectangle(t.cx2, t.ty + 10, 50, 50, 0xffffff, 0.001).setInteractive({ useHandCursor: true })
      rightChair.on('pointerdown', () => {
        if (!this.character.setDurableState('sitting')) { showToast('Qian Hui is busy right now!') ; return }
        this.character.setPosition(t.cx2, t.ty + 10)
        this.character.setExpression('happy')
        this.character.updateStat('energy', 15)
        this.character.updateStat('happiness', 10)
        playerState.data.character = this.character.toSave()
        playerState.save(true)
        audioManager.play('drop')
        showToast('Such a cozy window view! 🧁 +Energy ⚡')
      })
    })
  }

  private bindActions(): void {
    const map = (): void => { locationManager.navigate(this, 'town', playerState.data.unlockedLocations) }
    const home = (): void => { locationManager.navigate(this, 'home', playerState.data.unlockedLocations) }
    this.game.events.on('ui:map', map).on('ui:home', home)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('ui:map', map).off('ui:home', home)
    })
  }
}
