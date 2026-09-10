import Phaser from 'phaser'
import { treasureManager } from '../treasure/TreasureManager'
import { audioManager } from '../audio/AudioManager'
import { Character } from '../characters/Character'
import { NPCBase } from '../characters/NPCBase'
import { LOCATION_DEFINITIONS, LocationRegistry, type LocationDefinition, type LocationId } from '../data/locations'
import { locationManager } from '../navigation/LocationManager'
import { playerState } from '../state/PlayerState'
import { DayNightManager } from '../environment/DayNightManager'
import { SpeechBubble } from '../ui/SpeechBubble'
import { setHelper, showToast } from '../ui/UIManager'
import { confirmModal } from '../ui/ConfirmModal'

const FRAMES: Partial<Record<LocationId, number>> = { pet_shop: 0, school: 1, park: 2, clothing_boutique: 3, home: 4, supermarket: 5, toy_shop: 6, cafe: 7, salon: 8 }

export class TownScene extends Phaser.Scene {
  private leaving = false
  private dayNight!: DayNightManager
  private avatar!: Character
  private buildings = new Map<LocationId, Phaser.GameObjects.Container>()
  private debugElapsed = 0
  constructor() { super('TownScene') }
  init(): void { this.leaving = false; this.buildings.clear(); locationManager.resetLock() }

  create(): void {
    playerState.setLocation('town')
    this.add.image(480, 270, 'world-terrain').setDisplaySize(960, 540)
    this.dayNight = new DayNightManager(this, 'day')
    for (const location of LOCATION_DEFINITIONS) this.createBuilding(location)
    this.drawLife()
    treasureManager.spawnClueIfPresent(this, 'town')
    this.avatar = new Character(this, { ...playerState.data.character, x: 456, y: 345, state: 'standing' })
    this.avatar.setScale(0.5).setDepth(500 + 345 + 10)
    this.input.setDraggable(this.avatar, false)
    this.avatar.on('pointerdown', () => { this.avatar.react('playing', 900); this.burst(this.avatar.x, this.avatar.y - 30) })
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (over.length || this.leaving || pointer.y < 280 || pointer.y > 450) return
      this.avatar.walkTo(Phaser.Math.Clamp(pointer.x, 370, 590), Phaser.Math.Clamp(pointer.y - 20, 310, 410))
    })
    const reset = (): void => {
      confirmModal.ask({
        title: 'Start over?',
        message: 'Reset all town and home progress? This cannot be undone.',
        confirmLabel: 'Reset',
        onConfirm: () => { playerState.reset(); this.scene.restart(); showToast('New game ready!') },
      })
    }
    const map = (): void => showToast('Welcome to your little city!')
    const home = (): void => this.visitLocation(LocationRegistry.get('home')!)
    const visit = (id: LocationId): void => { const location = LocationRegistry.get(id); if (location) this.visitLocation(location) }
    const timeCycle = (): void => { this.dayNight.cycle() }
    this.game.events.on('ui:map', map).on('ui:home', home).on('ui:reset', reset).on('ui:location', visit).on('ui:time-cycle', timeCycle)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('ui:map', map).off('ui:home', home).off('ui:reset', reset).off('ui:location', visit).off('ui:time-cycle', timeCycle)
      this.buildings.clear()
    })
    this.game.events.emit('ui:context', 'town')
    setHelper('Your little city • tap a place or explore the garden')
    this.cameras.main.resetFX(); this.cameras.main.fadeIn(250, 255, 248, 233)
  }

  update(_time: number, delta: number): void {
    this.debugElapsed += delta
    if (this.debugElapsed < 400) return
    this.debugElapsed = 0
    this.game.events.emit('debug:update', { fps: Math.round(this.game.loop.actualFps), scene: 'Town', x: this.avatar.x, y: this.avatar.y, state: this.avatar.stateMachine.value, currency: playerState.currency.getBalance() })
  }

  private createBuilding(location: LocationDefinition): void {
    const building = this.add.container(location.x, location.y).setDepth(500 + location.y)
    const size = location.id === 'home' ? 168 : location.y < 200 ? 148 : 158
    const art = this.add.image(0, -9, 'world-buildings', FRAMES[location.id] ?? 4).setDisplaySize(size, size)

    const BADGE_ICONS: Partial<Record<LocationId, string>> = {
      pet_shop: '🐾',
      school: '🔔',
      park: '🎠',
      clothing_boutique: '👗',
      home: '💖',
      supermarket: '🛒',
      toy_shop: '🧸',
      cafe: '☕',
      salon: '✂️'
    }

    const badgeY = location.id === 'home' ? -18 : 60
    const badgeW = location.id === 'clothing_boutique' ? 124 : 112
    const label = this.add.graphics()
    // Soft shadow
    label.fillStyle(0x78504b, 0.2).fillRoundedRect(-badgeW / 2, badgeY + 2, badgeW, 26, 13)
    // Cream pill
    label.fillStyle(0xfffdf7).fillRoundedRect(-badgeW / 2, badgeY, badgeW, 26, 13)
      .lineStyle(2, 0xf2c4ce).strokeRoundedRect(-badgeW / 2, badgeY, badgeW, 26, 13)

    const icon = BADGE_ICONS[location.id] ?? '★'
    const text = this.add.text(0, badgeY + 13, `${icon} ${location.shortName}`, {
      fontFamily: 'Nunito, Trebuchet MS, sans-serif',
      fontSize: '13px',
      color: '#6e4458',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    const hit = this.add.rectangle(0, 0, 114, 108, 0xffffff, 0).setInteractive({ useHandCursor: true })
    hit.on('pointerdown', () => this.visitLocation(location))
    building.add([art, label, text, hit]); this.buildings.set(location.id, building)
  }

  private visitLocation(location: LocationDefinition): void {
    if (this.leaving) return
    if (!locationManager.isAvailable(location.id, playerState.data.unlockedLocations)) { showToast(location.name + ' • Coming Soon'); return }
    this.leaving = true
    audioManager.play('chime')
    const building = this.buildings.get(location.id)
    if (building) this.tweens.add({ targets: building, scaleX: 1.04, scaleY: 0.96, duration: 100, yoyo: true })
    if (!locationManager.navigate(this, location.id, playerState.data.unlockedLocations)) {
      this.leaving = false
    }
  }

  private burst(x: number, y: number): void {
    audioManager.play('chime')
    for (let i = 0; i < 7; i++) {
      const star = this.add.star(x, y, 5, 2, 5, i % 2 ? 0xffdd76 : 0xff9cba).setDepth(3000)
      this.tweens.add({ targets: star, x: x + (i - 3) * 12, y: y - 24 - (i % 3) * 9, alpha: 0, duration: 650, onComplete: () => star.destroy() })
    }
  }

  private drawLife(): void {
    // 1. Qian Hui's Companion White Kitten (standing happily beside Qian Hui)
    const kitten = this.add.container(494, 355).setDepth(500 + 355 + 10)
    const kg = this.add.graphics()
    kg.fillStyle(0x78504b, 0.22).fillEllipse(0, 10, 20, 6)
    kitten.add(kg)
    if (this.textures.exists('mimi-kitten')) {
      const kImg = this.add.image(0, 0, 'mimi-kitten').setDisplaySize(28, 32)
      kitten.add(kImg)
    } else {
      kg.fillStyle(0xfffdf7).fillRoundedRect(-10, -5, 20, 17, 7)
      kg.lineStyle(1.8, 0x663d63).strokeRoundedRect(-10, -5, 20, 17, 7)
      kg.fillStyle(0xfffdf7).fillEllipse(0, -13, 22, 17)
      kg.lineStyle(1.8, 0x663d63).strokeEllipse(0, -13, 22, 17)
      kg.fillStyle(0x4b2a38).fillCircle(-5, -13, 1.8).fillCircle(5, -13, 1.8)
      kg.fillStyle(0xffffff).fillCircle(-4.5, -14, 0.6).fillCircle(5.5, -14, 0.6)
      kg.fillStyle(0xffa3b8, 0.7).fillCircle(-8, -10, 1.8).fillCircle(8, -10, 1.8)
      kg.fillStyle(0xff8fc4).fillCircle(0, -10, 0.9)
    }
    kitten.setSize(34, 38).setInteractive({ useHandCursor: true })
    if (!playerState.data.settings.reducedMotion) {
      this.tweens.add({ targets: kitten, y: 423, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
    }
    kitten.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event.stopPropagation()
      audioManager.play('chew')
      this.burst(kitten.x, kitten.y - 15)
      this.tweens.add({ targets: kitten, y: 412, duration: 120, yoyo: true, repeat: 1 })
      new SpeechBubble(this, kitten.x, kitten.y - 36, 'Meow! 🐾', '', 1400)
    })

    // 2. Wooden Boardwalk Pier extending from path into pond
    const pier = this.add.container(512, 440).setDepth(220)
    const pg = this.add.graphics()
    pg.fillStyle(0x194556, 0.32).fillRect(-36, 18, 72, 32)
    for (const px of [-34, 32]) {
      pg.fillStyle(0x734832).fillRoundedRect(px, -2, 6, 40, 2).lineStyle(1.5, 0x48291c).strokeRoundedRect(px, -2, 6, 40, 2)
    }
    for (let py = 0; py < 36; py += 7) {
      pg.fillStyle(py % 14 === 0 ? 0xbe8b64 : 0xb47f57).fillRoundedRect(-38, py, 76, 6, 2)
        .lineStyle(1.2, 0x6e462d).strokeRoundedRect(-38, py, 76, 6, 2)
    }
    pier.add(pg)

    // 3. Cute Yellow Rubber Ducky floating on the pond
    const duck = this.add.container(546, 486).setDepth(260)
    const dg = this.add.graphics()
    dg.lineStyle(2, 0xffffff, 0.6).strokeEllipse(0, 9, 30, 9)
    dg.fillStyle(0xffdc47).fillEllipse(0, 3, 20, 13).lineStyle(1.5, 0x7a5223).strokeEllipse(0, 3, 20, 13)
    dg.fillStyle(0xffdc47).fillTriangle(-9, 3, -13, -2, -5, 1)
    dg.fillStyle(0xffdc47).fillCircle(5, -4, 8).lineStyle(1.5, 0x7a5223).strokeCircle(5, -4, 8)
    dg.fillStyle(0x3a2518).fillCircle(7, -6, 1.5)
    dg.fillStyle(0xffffff).fillCircle(7.5, -6.5, 0.5)
    dg.fillStyle(0xff7728).fillRoundedRect(12, -4, 8, 5, 2).lineStyle(1, 0x7a5223).strokeRoundedRect(12, -4, 8, 5, 2)
    dg.fillStyle(0xffcc2b).fillEllipse(-1, 3, 10, 5)
    duck.add(dg)
    duck.setSize(34, 28).setInteractive({ useHandCursor: true })
    if (!playerState.data.settings.reducedMotion) {
      this.tweens.add({ targets: duck, y: 483, angle: 3, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
    }
    duck.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event.stopPropagation()
      audioManager.play('water')
      this.burst(duck.x, duck.y - 12)
      new SpeechBubble(this, duck.x, duck.y - 28, 'Quack! 🦆', '', 1200)
      this.tweens.add({ targets: duck, scaleY: 0.85, duration: 100, yoyo: true })
    })

    // 4. Illustrated Story Signboards
    // Left Garden Signpost: "Create Your Own Story! ♥"
    const leftSign = this.add.container(98, 412).setDepth(2000)
    const lsg = this.add.graphics()
    lsg.fillStyle(0x8c5b3e).fillRect(-20, 16, 7, 26).fillRect(13, 16, 7, 26)
      .lineStyle(1.5, 0x543220).strokeRect(-20, 16, 7, 26).strokeRect(13, 16, 7, 26)
    lsg.fillStyle(0xa66f4b).fillRoundedRect(-52, -26, 104, 52, 12)
      .lineStyle(2, 0x543220).strokeRoundedRect(-52, -26, 104, 52, 12)
      .fillStyle(0xfff7e6).fillRoundedRect(-46, -21, 92, 42, 8)
    leftSign.add(lsg)
    const leftText = this.add.text(0, 0, 'Create\nYour Own\nStory! ♥', {
      fontFamily: 'Trebuchet MS', fontSize: '11px', color: '#683e2c', fontStyle: 'bold', align: 'center', lineSpacing: 2
    }).setOrigin(0.5)
    leftSign.add(leftText).setSize(104, 60).setInteractive({ useHandCursor: true })
    leftSign.on('pointerdown', () => {
      audioManager.play('chime')
      this.burst(leftSign.x, leftSign.y - 20)
      this.tweens.add({ targets: leftSign, angle: 4, duration: 100, yoyo: true, repeat: 1 })
      this.game.events.emit('ui:open-treasure-journal', 'cases')
    })

    // Right Garden Signpost: "Various Places Lots of Fun! ♥"
    const rightSign = this.add.container(900, 290).setDepth(1000)
    const rsg = this.add.graphics()
    rsg.fillStyle(0x8c5b3e).fillRect(-4, 18, 8, 28).lineStyle(1.5, 0x543220).strokeRect(-4, 18, 8, 28)
    rsg.fillStyle(0xa66f4b).fillRoundedRect(-50, -25, 100, 50, 12)
      .lineStyle(2, 0x543220).strokeRoundedRect(-50, -25, 100, 50, 12)
      .fillStyle(0xfff7e6).fillRoundedRect(-44, -20, 88, 40, 8)
    rightSign.add(rsg)
    const rightText = this.add.text(0, 0, 'Various\nPlaces\nLots of Fun! ♥', {
      fontFamily: 'Trebuchet MS', fontSize: '11px', color: '#683e2c', fontStyle: 'bold', align: 'center', lineSpacing: 2
    }).setOrigin(0.5)
    rightSign.add(rightText).setSize(100, 55).setInteractive({ useHandCursor: true })
    rightSign.on('pointerdown', () => {
      audioManager.play('chime')
      this.burst(rightSign.x, rightSign.y - 20)
      this.tweens.add({ targets: rightSign, angle: -4, duration: 100, yoyo: true, repeat: 1 })
      showToast('Explore all the cozy shops and places in town! 🌸')
    })

    // 5. Unique Venue-Specific Resident NPCs (matching Master Reference media_1788567849271.jpg)
    const residents = [
      { x: 476, y: 180, scale: 0.31, spriteKey: 'resident-school', name: 'Kenji', role: 'Student', line: 'School is so fun!', icon: '📚' },
      { x: 356, y: 318, scale: 0.35, spriteKey: 'resident-boutique', name: 'Clara', role: 'Fashionista', line: 'Love these dresses!', icon: '👗' },
      { x: 770, y: 318, scale: 0.35, spriteKey: 'resident-market', name: 'Oliver', role: 'Grocer', line: 'Fresh fruit today!', icon: '🍎' },
      { x: 832, y: 390, scale: 0.38, spriteKey: 'resident-salon', name: 'Maya', role: 'Stylist', line: 'A stylish new look!', icon: '✂️' },
      { x: 172, y: 390, scale: 0.38, spriteKey: 'resident-toyshop', name: 'Sparky', role: 'Playmate', line: 'Beep beep! Toy cars!', icon: '🧸' },
      { x: 268, y: 178, scale: 0.31, spriteKey: 'resident-petshop', name: 'Daisy', role: 'Caregiver', line: 'Puppies are the best!', icon: '🐾' },
    ]

    residents.forEach((r) => {
      const npc = new NPCBase(this, r.x, r.y, {
        id: 'resident_' + r.name.toLowerCase(),
        name: r.name,
        role: r.role,
        spriteKey: r.spriteKey,
        dialogues: [r.line],
        icon: r.icon,
        showBadge: false,
      })
      npc.setScale(r.scale).setDepth(500 + r.y + 10)
    })

    // Fountain
    const fountain = this.add.container(560, 385).setDepth(1050)
    const bowl = this.add.graphics().fillStyle(0x846c6b, .15).fillEllipse(0, 20, 60, 15)
      .fillStyle(0xffefd7).fillEllipse(0, 12, 55, 21).lineStyle(2, 0xd7ad8b).strokeEllipse(0, 12, 55, 21)
      .fillStyle(0x74dbe8).fillEllipse(0, 9, 46, 13).fillStyle(0xfffbec).fillRoundedRect(-4, -20, 8, 29, 4)
    fountain.add(bowl).setSize(66, 60).setInteractive({ useHandCursor: true })
    fountain.on('pointerdown', () => {
      audioManager.play('water')
      for (let i = 0; i < 8; i++) {
        const drop = this.add.ellipse(560, 363, 3, 6, 0xcaffff).setDepth(1300)
        this.tweens.add({ targets: drop, x: 535 + i * 7, y: 394, alpha: 0, duration: 550 + i * 40, onComplete: () => drop.destroy() })
      }
    })

    // Water ripples & lotus pads
    for (const x of [280, 673]) {
      const ripple = this.add.ellipse(x, 484, 40, 7).setStrokeStyle(2, 0xffffff, .65).setDepth(100)
      if (!playerState.data.settings.reducedMotion) this.tweens.add({ targets: ripple, scaleX: 1.8, alpha: .12, duration: 2400, yoyo: true, repeat: -1 })
      this.add.zone(x, 485, 100, 40).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.burst(x, 483))
    }

    // Lotus flowers in water
    for (const [lx, ly] of [[390, 492], [630, 494]]) {
      const pad = this.add.graphics().fillStyle(0x4ca07d).fillEllipse(lx, ly, 22, 10)
      pad.fillStyle(0xffa8d3).fillCircle(lx - 2, ly - 3, 4).fillCircle(lx + 2, ly - 3, 4).fillCircle(lx, ly - 5, 4)
      pad.fillStyle(0xffdd77).fillCircle(lx, ly - 3, 2.5).setDepth(150)
    }

    // Interactive garden flowers
    for (const [x, y] of [[343, 357], [609, 343], [79, 317], [893, 325]]) {
      const plant = this.add.container(x, y).setDepth(1000)
      const g = this.add.graphics().lineStyle(3, 0x6a9b5a).lineBetween(0, 0, 0, -17)
      g.fillStyle(0x83bd69).fillEllipse(-5, -9, 13, 6).fillEllipse(6, -13, 12, 6)
      g.fillStyle(0xffb8ca).fillCircle(-4, -20, 5).fillCircle(4, -20, 5).fillCircle(0, -25, 5).fillCircle(0, -15, 5).fillStyle(0xffdd77).fillCircle(0, -20, 4)
      plant.add(g).setSize(36, 44).setInteractive({ useHandCursor: true })
      plant.on('pointerdown', () => { this.tweens.add({ targets: plant, angle: 12, duration: 140, yoyo: true, repeat: 1 }); this.burst(x, y - 25) })
    }

    // Interactive street lamp
    const glow = this.add.circle(631, 420, 22, 0xffdf88, .22).setDepth(1000)
    this.add.graphics().lineStyle(5, 0x78617d).lineBetween(631, 444, 631, 411).fillStyle(0xffe298).fillRoundedRect(624, 402, 14, 15, 4).setDepth(1100)
    this.add.zone(631, 420, 44, 55).setInteractive({ useHandCursor: true }).on('pointerdown', () => { glow.setVisible(!glow.visible); audioManager.play('switch') })

    // Moving, tappable car
    const car = this.add.container(-40, 330).setDepth(1300)
    car.add(this.add.graphics().fillStyle(0x71bcdf).fillRoundedRect(-20, -10, 40, 20, 8).fillRoundedRect(-12, -22, 25, 20, 7).fillStyle(0xe1f8ff).fillRoundedRect(-8, -18, 17, 10, 3).fillStyle(0x705e6e).fillCircle(-12, 11, 6).fillCircle(12, 11, 6))
    car.setSize(48, 44).setInteractive({ useHandCursor: true }).on('pointerdown', () => { audioManager.play('honk'); this.burst(car.x, car.y - 20) })
    if (!playerState.data.settings.reducedMotion) this.tweens.add({ targets: car, x: 1000, duration: 23000, repeat: -1, delay: 4000 })
  }
}
