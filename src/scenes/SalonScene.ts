import Phaser from 'phaser'
import { Character } from '../characters/Character'
import { NPCBase } from '../characters/NPCBase'
import { audioManager } from '../audio/AudioManager'
import { locationManager } from '../navigation/LocationManager'
import { playerState } from '../state/PlayerState'
import { setHelper, showToast } from '../ui/UIManager'
import { treasureManager } from '../treasure/TreasureManager'
import type { AvatarCustomization } from '../save/SaveSchema'

const HAIR_STYLES = ['twin_buns', 'long_waves', 'ponytail', 'bob', 'pixie'] as const
const HAIR_COLORS = [0x8d5a8a, 0xffd95a, 0xff8fc4, 0xb58674, 0x8fdcc8, 0x9b5de5, 0x00bbf9]
const COLOR_NAMES = ['Plum', 'Golden Blonde', 'Pastel Pink', 'Chestnut', 'Mint', 'Lavender', 'Sky Blue']

const OUTLINE = 0x663d63
const OUTLINE_LIGHT = 0x78504b

export class SalonScene extends Phaser.Scene {
  private character!: Character
  private stylistNPC!: NPCBase
  private debugElapsed = 0
  private styleIndex = 0
  private colorIndex = 0
  private mirrorBulbs: Phaser.GameObjects.Arc[] = []
  private styleLabel!: Phaser.GameObjects.Text
  private colorLabel!: Phaser.GameObjects.Text
  private colorSwatch!: Phaser.GameObjects.Arc

  constructor() { super('SalonScene') }

  create(): void {
    locationManager.resetLock()
    playerState.setLocation('salon')
    this.drawSalonEnvironment()
    this.drawWashBasinStation()
    this.drawVanityMirrorAndCounter()
    this.drawStylingChair()
    this.drawStylist()
    this.drawStylingConsole()

    this.character = new Character(this, {
      ...playerState.data.character,
      x: 480,
      y: 410,
      state: 'standing',
    })

    treasureManager.spawnClueIfPresent(this, 'salon')
    this.bindFloorClick()
    this.bindActions()

    this.game.events.emit('ui:context', 'venue')
    this.game.events.emit('ui:stats', { ...this.character.stats })
    setHelper('Sit in the salon chair to try cute new hairstyles & hair colors!')
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
      zone: 'salon',
      inventory: JSON.stringify(playerState.inventory.snapshot()),
      scene: 'Salon',
      currency: playerState.currency.getBalance(),
      cartTotal: 0,
    })
  }

  private drawSalonEnvironment(): void {
    const g = this.add.graphics()

    // 1. Upper Wall - Elegant Damask / Pinstripe Storybook Wallpaper
    g.fillStyle(0xfbf4fa).fillRect(0, 0, 960, 350)

    // Vertical pinstripe texture
    g.fillStyle(0xf3e2f1, 0.45)
    for (let x = 0; x < 960; x += 32) {
      g.fillRect(x, 0, 16, 350)
    }

    // Crown molding at ceiling
    g.fillStyle(0xffffff).fillRect(0, 0, 960, 18)
    g.fillStyle(0xeed6ea).fillRect(0, 18, 960, 4)

    // Wainscoting lower wall trim
    g.fillStyle(0xf6e6f4).fillRect(0, 310, 960, 40)
    g.lineStyle(2, 0xdfbed9).lineBetween(0, 310, 960, 310)
    g.lineStyle(2, 0xd2abc9).lineBetween(0, 350, 960, 350)

    // 2. Lower Floor - Glossy Storybook Checkerboard Tiles
    g.fillStyle(0xeddceb).fillRect(0, 350, 960, 190)
    g.fillStyle(0xfdfafc)
    for (let x = 0; x < 960; x += 48) {
      for (let y = 350; y < 540; y += 48) {
        if ((Math.floor(x / 48) + Math.floor((y - 350) / 48)) % 2 === 0) {
          g.fillRect(x, y, 48, 48)
        }
      }
    }
    // Subtle floor gloss line
    g.fillStyle(0xffffff, 0.25).fillRect(0, 352, 960, 6)

    // Wall Sconces with warm ambient glow
    this.drawWallSconce(130, 90)
    this.drawWallSconce(830, 90)

    // Title Plaque
    const titlePlate = this.add.container(480, 40)
    const tBg = this.add.graphics()
    tBg.fillStyle(0xffffff, 0.94).fillRoundedRect(-170, -20, 340, 40, 14)
    tBg.lineStyle(2, 0xe6bad5).strokeRoundedRect(-170, -20, 340, 40, 14)
    const tText = this.add.text(0, 0, '✨ Sparkle & Snip Salon ✨', {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#6e3c66',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    titlePlate.add([tBg, tText])
  }

  private drawWallSconce(x: number, y: number): void {
    const g = this.add.graphics()
    // Gold bracket
    g.fillStyle(0xd4a373).fillRoundedRect(x - 6, y, 12, 28, 4)
    // Sconce frosted glass shade
    g.fillStyle(0xfff6dd, 0.95).fillTriangle(x - 14, y + 6, x + 14, y + 6, x, y - 20)
    g.lineStyle(1.5, 0xd4a373).strokeTriangle(x - 14, y + 6, x + 14, y + 6, x, y - 20)
    // Warm light halo
    const halo = this.add.arc(x, y - 6, 22, 0, 360, false, 0xfff0b3, 0.35)
    this.tweens.add({
      targets: halo,
      alpha: 0.18,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private drawWashBasinStation(): void {
    const station = this.add.container(105, 275)
    const g = this.add.graphics()

    // Shampoo shelves with illustrated bottles
    g.fillStyle(0xe5c9df).fillRoundedRect(-50, -125, 100, 12, 4)
    g.lineStyle(1.5, OUTLINE).strokeRoundedRect(-50, -125, 100, 12, 4)

    // Bottle 1: Pastel mint shampoo
    g.fillStyle(0xa8dadc).fillRoundedRect(-42, -155, 18, 28, 4).strokeRoundedRect(-42, -155, 18, 28, 4)
    g.fillStyle(0xffffff).fillRect(-38, -160, 10, 5)

    // Bottle 2: Strawberry conditioner
    g.fillStyle(0xffb4d6).fillRoundedRect(-16, -158, 20, 31, 5).strokeRoundedRect(-16, -158, 20, 31, 5)
    g.fillStyle(0xffd166).fillRect(-12, -163, 12, 5)

    // Bottle 3: Honey gloss
    g.fillStyle(0xffd166).fillRoundedRect(12, -152, 18, 25, 4).strokeRoundedRect(12, -152, 18, 25, 4)
    g.fillStyle(0xffffff).fillRect(16, -157, 10, 5)

    // Stacked folded towels
    g.fillStyle(0xf7d1cd).fillRoundedRect(-44, -108, 42, 10, 3)
    g.fillStyle(0xd8e2dc).fillRoundedRect(-44, -118, 42, 10, 3)
    g.fillStyle(0xffe5d9).fillRoundedRect(-44, -98, 42, 10, 3)

    // Ceramic wash basin unit
    g.fillStyle(OUTLINE_LIGHT, 0.2).fillEllipse(0, 84, 94, 20) // shadow
    g.fillStyle(0x403d39).fillRoundedRect(-22, 10, 44, 75, 8) // pedestal
    g.fillStyle(0xffffff).fillRoundedRect(-48, -25, 96, 42, 16) // basin bowl
    g.lineStyle(2, OUTLINE).strokeRoundedRect(-48, -25, 96, 42, 16)
    g.fillStyle(0xcce3de).fillEllipse(0, -10, 74, 24) // basin interior
    // Chrome faucet & hose
    g.lineStyle(3, 0xb0c4de).lineBetween(0, -28, 0, -16)
    g.fillStyle(0xd4d8dd).fillCircle(0, -28, 5)

    // Reclining Wash Seat
    g.fillStyle(0x8a507a).fillRoundedRect(35, 10, 42, 60, 10)
    g.lineStyle(2, OUTLINE).strokeRoundedRect(35, 10, 42, 60, 10)
    g.fillStyle(0x6e3c66).fillRoundedRect(32, 22, 48, 18, 6)

    station.add(g)

    // Interactive Wash Basin trigger
    const basinHit = this.add.rectangle(105, 275, 120, 140, 0xffffff, 0.001).setInteractive({ useHandCursor: true })
    basinHit.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event?.stopPropagation()
      this.playHairWashAnimation()
    })
  }

  private playHairWashAnimation(): void {
    audioManager.play('water')
    showToast('Refreshing shampoo wash & conditioning! 🫧')

    // Create foam bubbles over basin and character
    for (let i = 0; i < 14; i++) {
      const bx = 105 + (Math.random() - 0.5) * 70
      const by = 260 + (Math.random() - 0.5) * 40
      const bubble = this.add.arc(bx, by, 4 + Math.random() * 8, 0, 360, false, 0xffffff, 0.85).setDepth(2000)
      bubble.setStrokeStyle(1.5, 0x8fdcc8)

      this.tweens.add({
        targets: bubble,
        y: by - 40 - Math.random() * 30,
        x: bx + (Math.random() - 0.5) * 30,
        alpha: 0,
        scale: 1.4,
        duration: 700 + Math.random() * 500,
        ease: 'Quad.Out',
        onComplete: () => bubble.destroy(),
      })
    }

    this.character.playCelebrate()
    this.character.setExpression('happy')
    this.character.updateStat('energy', 15)
    this.character.updateStat('happiness', 15)
    playerState.data.character = this.character.toSave()
    playerState.save(true)
  }

  private drawVanityMirrorAndCounter(): void {
    const g = this.add.graphics()
    const mx = 480
    const my = 190

    // Vanity mirror frame shadow
    g.fillStyle(OUTLINE_LIGHT, 0.15).fillRoundedRect(mx - 125, my - 120, 250, 240, 36)

    // Gold / Rose mirror frame
    g.fillStyle(0xfde2e4).fillRoundedRect(mx - 120, my - 116, 240, 230, 32)
    g.lineStyle(3.5, 0xd099ba).strokeRoundedRect(mx - 120, my - 116, 240, 230, 32)

    // Mirror Glass Surface
    g.fillStyle(0xdbeef8, 0.82).fillRoundedRect(mx - 100, my - 96, 200, 190, 22)
    g.lineStyle(2, 0xb8e0f0).strokeRoundedRect(mx - 100, my - 96, 200, 190, 22)

    // Mirror reflection sheen
    g.fillStyle(0xffffff, 0.35)
    g.fillTriangle(mx - 80, my - 90, mx - 50, my - 90, mx - 90, my + 80)
    g.fillTriangle(mx - 35, my - 90, mx - 15, my - 90, mx - 55, my + 80)

    // Hollywood Vanity Bulbs around the mirror frame
    this.mirrorBulbs = []
    const bulbPositions = [
      { x: mx - 108, y: my - 80 },
      { x: mx - 108, y: my - 30 },
      { x: mx - 108, y: my + 20 },
      { x: mx - 108, y: my + 70 },
      { x: mx + 108, y: my - 80 },
      { x: mx + 108, y: my - 30 },
      { x: mx + 108, y: my + 20 },
      { x: mx + 108, y: my + 70 },
      { x: mx - 60, y: my - 106 },
      { x: mx, y: my - 106 },
      { x: mx + 60, y: my - 106 },
    ]

    bulbPositions.forEach((pos, idx) => {
      const bulb = this.add.arc(pos.x, pos.y, 7, 0, 360, false, 0xfff3b0, 0.95)
      bulb.setStrokeStyle(1.5, 0xd4a373)
      this.mirrorBulbs.push(bulb)

      // Staggered gentle pulse
      this.tweens.add({
        targets: bulb,
        scale: 1.15,
        alpha: 0.75,
        duration: 900 + (idx % 3) * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })
    })

    // Vanity Table Counter
    g.fillStyle(0xfff0f6).fillRoundedRect(mx - 140, my + 98, 280, 36, 8)
    g.lineStyle(2.5, OUTLINE).strokeRoundedRect(mx - 140, my + 98, 280, 36, 8)
    g.fillStyle(0xf3c6db).fillRect(mx - 136, my + 104, 272, 6) // edge detail

    // Cosmetic accessories on counter
    // Hair dryer
    g.fillStyle(0xff85a1).fillRoundedRect(mx + 60, my + 86, 26, 14, 4)
    g.fillStyle(0x403d39).fillRect(mx + 70, my + 98, 6, 12)
    // Perfume bottle with atomizer
    g.fillStyle(0xffcbf2).fillRoundedRect(mx - 85, my + 84, 16, 18, 5)
    g.fillStyle(0xd4a373).fillCircle(mx - 85, my + 80, 4)
    // Styling Comb
    g.fillStyle(0xbde0fe).fillRect(mx - 40, my + 96, 24, 6)
  }

  private drawStylingChair(): void {
    const cx = 480
    const cy = 415
    const g = this.add.graphics()

    // Round Chrome Pedestal Base
    g.fillStyle(OUTLINE_LIGHT, 0.2).fillEllipse(cx, cy + 48, 80, 16) // ground shadow
    g.fillStyle(0xc0c6ce).fillEllipse(cx, cy + 42, 68, 14)
    g.lineStyle(2, OUTLINE).strokeEllipse(cx, cy + 42, 68, 14)
    g.fillStyle(0xffffff, 0.5).fillEllipse(cx, cy + 40, 50, 8) // base highlight

    // Chrome Piston Stem & Hydraulic Foot Pedal
    g.fillStyle(0xd8dee6).fillRect(cx - 6, cy + 18, 12, 24)
    g.lineStyle(1.5, OUTLINE).strokeRect(cx - 6, cy + 18, 12, 24)
    g.fillStyle(0x4a4e69).fillRect(cx - 24, cy + 34, 18, 5) // foot pedal

    // Padded Salon Seat Cushion (Rose Velvet)
    g.fillStyle(0xa64d79).fillRoundedRect(cx - 36, cy - 2, 72, 24, 8)
    g.lineStyle(2.5, OUTLINE).strokeRoundedRect(cx - 36, cy - 2, 72, 24, 8)
    g.fillStyle(0xd67ba8).fillRect(cx - 30, cy + 2, 60, 4) // velvet highlight

    // Curved Chair Backrest
    g.fillStyle(0x8a3962).fillRoundedRect(cx - 32, cy - 38, 64, 38, 10)
    g.lineStyle(2.5, OUTLINE).strokeRoundedRect(cx - 32, cy - 38, 64, 38, 10)

    // Chrome Armrests
    g.lineStyle(3, 0xb0c4de)
    g.strokeRoundedRect(cx - 44, cy - 14, 10, 20, 4)
    g.strokeRoundedRect(cx + 34, cy - 14, 10, 20, 4)

    // Interactive Hitbox for Salon Chair
    const chairHit = this.add.rectangle(cx, cy, 90, 85, 0xffffff, 0.001).setInteractive({ useHandCursor: true })
    chairHit.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event?.stopPropagation()
      this.sitInSalonChair()
    })
  }

  private sitInSalonChair(): void {
    audioManager.play('wardrobe')
    if (!this.character.setDurableState('sitting')) { showToast('Qian Hui is busy right now!') ; return }
        this.character.setPosition(480, 410)
    this.character.setExpression('excited')
    this.character.updateStat('happiness', 20)
    this.character.updateStat('fun', 15)
    playerState.data.character = this.character.toSave()
    playerState.save(true)
    showToast('Sitting comfortably! Choose your style & color! ✨ +Happy!')

    // Sparkle reveal
    this.celebrateMakeover()
  }

  private drawStylist(): void {
    this.stylistNPC = new NPCBase(this, 690, 360, {
      id: 'maya',
      name: 'Maya',
      role: 'Salon Stylist',
      spriteKey: 'resident-salon',
      skinColor: 0xffe2d2,
      hairStyle: 'bob',
      hairColor: 0x4a2a44,
      eyeColor: 0x5a3248,
      outfitColor: 0xf582ae,
      apronColor: 0x3d2b3a,
      accessory: 'shears',
      dialogues: [
        'Welcome to Sparkle & Snip! ✨',
        'A fresh cut always brings wonderful luck! 💖',
        'Would you like some shimmer spray or soft waves?',
        'Looking absolutely fabulous today! 🌸',
      ],
      icon: '✂️',
    })
    this.stylistNPC.setDepth(500)
  }

  private drawStylingConsole(): void {
    const panel = this.add.container(175, 435)

    // Wooden / pastel backing panel
    const bg = this.add.graphics()
    bg.fillStyle(0xffffff, 0.94).fillRoundedRect(-140, -50, 280, 100, 16)
    bg.lineStyle(2.5, 0xe2a8cb).strokeRoundedRect(-140, -50, 280, 100, 16)
    panel.add(bg)

    // Current Style button
    const styleBtn = this.add.container(-65, -15)
    const sb = this.add.graphics()
    sb.fillStyle(0xfde2e4).fillRoundedRect(-58, -20, 116, 40, 10)
    sb.lineStyle(2, 0xff85a1).strokeRoundedRect(-58, -20, 116, 40, 10)
    const stTitle = this.add.text(0, -8, '✂️ Style', {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#6e3c66',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    this.styleLabel = this.add.text(0, 7, this.getCurrentStyleName(), {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#a64d79',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    styleBtn.add([sb, stTitle, this.styleLabel])
    styleBtn.setSize(116, 40).setInteractive({ useHandCursor: true })
    styleBtn.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event?.stopPropagation()
      this.cycleHairstyle()
    })

    // Current Color button
    const colorBtn = this.add.container(65, -15)
    const cb = this.add.graphics()
    cb.fillStyle(0xfef0f2).fillRoundedRect(-58, -20, 116, 40, 10)
    cb.lineStyle(2, 0xffb703).strokeRoundedRect(-58, -20, 116, 40, 10)
    const ctTitle = this.add.text(8, -8, '🎨 Hair Dye', {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#6e3c66',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    this.colorSwatch = this.add.arc(-38, -1, 7, 0, 360, false, HAIR_COLORS[this.colorIndex]!, 1)
    this.colorSwatch.setStrokeStyle(1.5, OUTLINE)
    this.colorLabel = this.add.text(8, 7, COLOR_NAMES[this.colorIndex]!, {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#b56576',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    colorBtn.add([cb, ctTitle, this.colorSwatch, this.colorLabel])
    colorBtn.setSize(116, 40).setInteractive({ useHandCursor: true })
    colorBtn.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event?.stopPropagation()
      this.cycleHairColor()
    })

    // Bottom Action: Magic Mirror Reveal Button
    const revealBtn = this.add.container(0, 30)
    const rb = this.add.graphics()
    rb.fillStyle(0xff85a1).fillRoundedRect(-110, -12, 220, 24, 10)
    rb.lineStyle(1.5, 0xffffff).strokeRoundedRect(-110, -12, 220, 24, 10)
    const rbText = this.add.text(0, 0, '✨ Mirror Glamour Reveal ✨', {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    revealBtn.add([rb, rbText])
    revealBtn.setSize(220, 24).setInteractive({ useHandCursor: true })
    revealBtn.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event?.stopPropagation()
      this.celebrateMakeover()
    })

    panel.add([styleBtn, colorBtn, revealBtn])
  }

  private getCurrentStyleName(): string {
    const curr = playerState.data.character.customization?.hairStyle ?? HAIR_STYLES[this.styleIndex]!
    return curr.replace('_', ' ')
  }

  private cycleHairstyle(): void {
    this.styleIndex = (this.styleIndex + 1) % HAIR_STYLES.length
    const nextStyle = HAIR_STYLES[this.styleIndex]!
    this.applyCustomization({ hairStyle: nextStyle })
    this.styleLabel.setText(nextStyle.replace('_', ' '))
    audioManager.play('button')
    showToast(`Style saved: ${nextStyle.replace('_', ' ')}! ✂️`)
  }

  private cycleHairColor(): void {
    this.colorIndex = (this.colorIndex + 1) % HAIR_COLORS.length
    const nextColor = HAIR_COLORS[this.colorIndex]!
    const name = COLOR_NAMES[this.colorIndex]!
    this.applyCustomization({ hairColor: nextColor })
    this.colorSwatch.setFillStyle(nextColor)
    this.colorLabel.setText(name)
    audioManager.play('chime')
    showToast(`Hair color saved: ${name}! 🎨`)
  }

  private applyCustomization(patch: Partial<AvatarCustomization>): void {
    const current = playerState.data.character.customization ?? {
      skinColor: 0xffd7c6,
      hairStyle: 'twin_buns',
      hairColor: 0x8d5a8a,
      eyeColor: 0x6c3f68,
      blushColor: 0xff7e9f,
    }
    const updated: AvatarCustomization = { ...current, ...patch }
    playerState.data.character.customization = updated
    this.character.setCustomization(updated)
    playerState.save(true)

    // Sparkle particles over character
    for (let i = 0; i < 6; i++) {
      const sp = this.add.text(
        this.character.x + (Math.random() - 0.5) * 40,
        this.character.y - 60 - Math.random() * 20,
        '✦',
        { fontSize: '18px', color: '#ffd95a' }
      ).setDepth(2100)

      this.tweens.add({
        targets: sp,
        y: sp.y - 35,
        alpha: 0,
        scale: 1.3,
        duration: 600,
        onComplete: () => sp.destroy(),
      })
    }
  }

  private celebrateMakeover(): void {
    audioManager.play('chime')
    this.character.playCelebrate()
    this.character.setExpression('excited')
    showToast('Fabulous! Looking gorgeous in the mirror! 💖')

    // Bulbs rapid shimmer sequence
    this.mirrorBulbs.forEach((bulb, idx) => {
      this.tweens.add({
        targets: bulb,
        scale: 1.5,
        alpha: 1,
        duration: 120,
        delay: idx * 40,
        yoyo: true,
        repeat: 2,
      })
    })

    // Floating heart and star burst
    const emojis = ['✨', '💖', '⭐', '🌸', '✨']
    emojis.forEach((em, i) => {
      const p = this.add.text(
        this.character.x + (i - 2) * 22,
        this.character.y - 70,
        em,
        { fontSize: '20px' }
      ).setDepth(2500)

      this.tweens.add({
        targets: p,
        y: p.y - 50,
        alpha: 0,
        scale: 1.3,
        duration: 850,
        ease: 'Cubic.Out',
        onComplete: () => p.destroy(),
      })
    })
  }

  private bindFloorClick(): void {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (!over.length && pointer.y > 360) {
        this.character.walkTo(
          Phaser.Math.Clamp(pointer.x, 180, 820),
          Phaser.Math.Clamp(pointer.y, 380, 480)
        )
      }
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
