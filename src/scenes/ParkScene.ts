import { treasureManager } from '../treasure/TreasureManager'
import Phaser from 'phaser'
import { Character } from '../characters/Character'
import { audioManager } from '../audio/AudioManager'
import { locationManager } from '../navigation/LocationManager'
import { playerState } from '../state/PlayerState'
import { setHelper, showToast } from '../ui/UIManager'
import { completeDailyEvent, dailyEventComplete } from '../state/DailyActivities'

const OUTLINE = 0x663d63
const OUTLINE_LIGHT = 0x78504b

export class ParkScene extends Phaser.Scene {
  private character!: Character
  private debugElapsed = 0

  constructor() { super('ParkScene') }

  create(): void {
    locationManager.resetLock()
    playerState.setLocation('park')
    this.drawPark()
    this.drawPlayground()

    this.character = new Character(this, { ...playerState.data.character, x: 480, y: 430, state: 'standing' })
    this.input.setDraggable(this.character, false)
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (!over.length && pointer.y > 330) {
        this.character.walkTo(Phaser.Math.Clamp(pointer.x, 70, 890), Phaser.Math.Clamp(pointer.y, 380, 480))
      }
    })

    treasureManager.spawnClueIfPresent(this, 'park')
    this.bindActions()
    this.game.events.emit('ui:context', 'venue')
    this.game.events.emit('ui:stats', { ...this.character.stats })
    setHelper('Tap the swings, slide, sandbox, or picnic blanket to play!')
    this.cameras.main.fadeIn(320, 240, 250, 255)
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
      zone: 'park',
      inventory: JSON.stringify(playerState.inventory.snapshot()),
      scene: 'Park',
      currency: playerState.currency.getBalance(),
      cartTotal: 0,
    })
  }

  private drawPark(): void {
    const g = this.add.graphics()

    // 1. Sky & Sun
    g.fillStyle(0xcdebf7).fillRect(0, 0, 960, 270)
    g.fillStyle(0xfffae0, 0.4).fillCircle(870, 70, 70)
    g.fillStyle(0xfff0ad).fillCircle(870, 70, 42)

    // Moving Fluffy Clouds
    for (const [cx, cy, scale] of [[140, 65, 1], [650, 80, 0.85], [420, 50, 0.7]]) {
      const cloud = this.add.graphics().setPosition(cx, cy)
      cloud.fillStyle(0xffffff, 0.9).fillCircle(0, 0, 24 * scale).fillCircle(-20 * scale, 4 * scale, 18 * scale).fillCircle(20 * scale, 4 * scale, 18 * scale)
      this.tweens.add({ targets: cloud, x: cx + 35, duration: 4500 + cx * 5, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
    }

    // 2. Layered Rolling Hills Background
    g.fillStyle(0xb5ead7).beginPath()
    g.moveTo(0, 240).lineTo(280, 200).lineTo(620, 250).lineTo(960, 210).lineTo(960, 540).lineTo(0, 540).closePath().fillPath()

    // Foreground Lush Grass
    g.fillStyle(0x92dfa8).beginPath()
    g.moveTo(0, 280).lineTo(340, 260).lineTo(700, 290).lineTo(960, 270).lineTo(960, 540).lineTo(0, 540).closePath().fillPath()

    // Dense flower-and-shrub border keeps the park in the same lush storybook family as town.
    const gardenClusters = [
      [28, 300], [92, 292], [165, 310], [255, 286], [350, 305], [430, 280],
      [548, 306], [625, 292], [700, 312], [770, 286], [850, 305], [930, 292],
    ] as const
    gardenClusters.forEach(([gx, gy], index) => {
      const shrub = index % 2 === 0 ? 0x69bd7f : 0x78c98b
      g.fillStyle(OUTLINE_LIGHT, .10).fillEllipse(gx, gy + 11, 52, 13)
      g.fillStyle(shrub).fillCircle(gx - 14, gy, 17).fillCircle(gx + 3, gy - 7, 22).fillCircle(gx + 20, gy + 1, 15)
      g.fillStyle(0x9ee3a7).fillCircle(gx - 8, gy - 8, 7).fillCircle(gx + 8, gy - 14, 8)
      const flower = index % 3 === 0 ? 0xff9fc7 : index % 3 === 1 ? 0xffd96f : 0xbda9ee
      for (const dx of [-13, 4, 18]) {
        g.fillStyle(flower).fillCircle(gx + dx - 3, gy - 11, 4).fillCircle(gx + dx + 3, gy - 11, 4)
          .fillCircle(gx + dx, gy - 15, 4).fillCircle(gx + dx, gy - 7, 4)
        g.fillStyle(0xfff0a8).fillCircle(gx + dx, gy - 11, 2.5)
      }
    })

    // Storybook Trees
    for (const tx of [80, 490, 890]) {
      // Trunk
      g.fillStyle(0x9c6644).fillRoundedRect(tx - 10, 180, 20, 90, 6).lineStyle(2, OUTLINE).strokeRoundedRect(tx - 10, 180, 20, 90, 6)
      // Foliage puff circles
      g.fillStyle(0x70c1b3).fillCircle(tx, 160, 46).fillCircle(tx - 24, 180, 32).fillCircle(tx + 24, 180, 32)
      g.fillStyle(0x8fe388).fillCircle(tx, 155, 38).fillCircle(tx - 18, 175, 26).fillCircle(tx + 18, 175, 26)
      g.fillStyle(0xffffff, 0.25).fillCircle(tx - 12, 145, 14)
    }

    // Winding Stone Pathway
    const pathPoints = [
      new Phaser.Math.Vector2(0, 450),
      new Phaser.Math.Vector2(320, 435),
      new Phaser.Math.Vector2(640, 475),
      new Phaser.Math.Vector2(960, 450),
      new Phaser.Math.Vector2(960, 505),
      new Phaser.Math.Vector2(640, 530),
      new Phaser.Math.Vector2(320, 490),
      new Phaser.Math.Vector2(0, 505),
    ]
    g.fillStyle(0xffe8d6).fillPoints(pathPoints, true)
    g.lineStyle(1.5, 0xddb892, 0.5)
    for (let sx = 40; sx < 940; sx += 60) {
      g.strokeEllipse(sx, 470 + Math.sin(sx * 0.02) * 15, 18, 8)
    }

    // 3. Illustrated Duck Pond
    const px = 790
    const py = 390
    g.fillStyle(OUTLINE_LIGHT, 0.16).fillEllipse(px, py + 10, 195, 85)
    g.fillStyle(0x89d2e8).fillEllipse(px, py, 190, 80).lineStyle(3, 0xffffff, 0.85).strokeEllipse(px, py, 190, 80)
    // Inner water depth
    g.fillStyle(0x64b5f6, 0.5).fillEllipse(px, py + 5, 150, 55)

    // Floating Lily Pads
    for (const [lx, ly] of [[px - 50, py + 12], [px + 40, py - 16], [px + 20, py + 18]]) {
      g.fillStyle(0x40916c).fillEllipse(lx, ly, 16, 9)
      g.fillStyle(0xffa8cf).fillCircle(lx + 2, ly - 2, 4) // Pink lotus flower
    }

    // Swimming Illustrated Duck & Duckling
    const duckGroup = this.add.container(px - 30, py)
    const dg = this.add.graphics()
    // Mother duck body
    dg.fillStyle(0xffd166).fillEllipse(0, 0, 16, 12).lineStyle(1.5, OUTLINE).strokeEllipse(0, 0, 16, 12)
    dg.fillStyle(0xffd166).fillCircle(8, -6, 7).lineStyle(1.5, OUTLINE).strokeCircle(8, -6, 7)
    dg.fillStyle(0xff9233).fillTriangle(14, -6, 21, -4, 14, -2) // Orange beak
    dg.fillStyle(0x000000).fillCircle(9, -8, 1.2)
    duckGroup.add(dg)

    this.tweens.add({
      targets: duckGroup,
      x: px + 40,
      duration: 3200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Title banner
    const banner = this.add.graphics()
    banner.fillStyle(0xffffff, 0.94).fillRoundedRect(30, 16, 300, 50, 14)
    banner.lineStyle(2, 0xefc6b3).strokeRoundedRect(30, 16, 300, 50, 14)
    this.add.text(45, 26, '🌳 Sunny Meadow Park', {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#2a5a52',
      fontStyle: 'bold',
    })
    this.add.text(45, 46, 'Playground swings, slide & duck pond', {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#52796f',
    })

    // Fluttering Butterfly
    const butterfly = this.add.text(480, 240, '🦋', { fontSize: '22px' }).setDepth(4000)
    this.tweens.add({
      targets: butterfly,
      x: 560,
      y: 220,
      duration: 2400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
    butterfly.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      audioManager.play('chime')
      showToast('A gentle butterfly dances around the flowers! 🌸')
      this.character?.playCelebrate()
    })
  }

  private drawPlayground(): void {
    const g = this.add.graphics()

    // 1. Illustrated A-Frame Wooden Swing Set
    const swingX = 145
    const swingY = 325
    g.fillStyle(OUTLINE_LIGHT, 0.16).fillEllipse(swingX, swingY + 95, 110, 20)
    // Timber legs
    g.lineStyle(6, 0xb5805c).lineBetween(swingX - 50, swingY + 95, swingX, swingY - 40).lineBetween(swingX + 50, swingY + 95, swingX, swingY - 40)
    g.lineStyle(8, 0x8a5832).lineBetween(swingX - 60, swingY - 40, swingX + 60, swingY - 40)

    const swingSeat = this.add.container(swingX, swingY - 40)
    const sg = this.add.graphics()
    sg.lineStyle(2.5, 0xaaaaaa).lineBetween(-18, 0, -18, 72).lineBetween(18, 0, 18, 72)
    sg.fillStyle(0xff8fc4).fillRoundedRect(-24, 72, 48, 12, 4).lineStyle(2, OUTLINE).strokeRoundedRect(-24, 72, 48, 12, 4)
    swingSeat.add(sg).setSize(52, 86).setInteractive({ useHandCursor: true })

    swingSeat.on('pointerdown', () => {
      if (!this.character.setDurableState('sitting')) { showToast('Qian Hui is busy right now!') ; return }
        this.character.setPosition(swingX, swingY + 38)
      this.character.setExpression('happy')
      this.character.updateStat('fun', 20)
      this.character.updateStat('happiness', 15)
      playerState.data.character = this.character.toSave()
      playerState.save(true)
      audioManager.play('button')
      showToast('Weee! Swinging high in the breeze! 🌸 +Fun!')
      this.tweens.add({
        targets: [swingSeat, this.character],
        angle: 18,
        duration: 480,
        yoyo: true,
        repeat: 3,
        ease: 'Sine.InOut',
        onComplete: () => {
          swingSeat.setAngle(0)
          this.character.setAngle(0)
        },
      })
    })

    // 2. Illustrated Pastel Playground Slide
    const slideX = 360
    const slideY = 320
    g.fillStyle(OUTLINE_LIGHT, 0.16).fillEllipse(slideX + 15, slideY + 95, 130, 22)
    // Ladder & Platform
    g.lineStyle(6, 0x3a86ff).lineBetween(slideX - 45, slideY + 95, slideX - 45, slideY - 25)
    for (let r = 0; r < 4; r++) {
      g.lineStyle(3, 0x8ecae6).lineBetween(slideX - 52, slideY + 80 - r * 26, slideX - 38, slideY + 80 - r * 26)
    }
    // Curved Slide Chute
    g.fillStyle(0xffd166).fillTriangle(slideX - 45, slideY - 25, slideX + 65, slideY + 95, slideX + 50, slideY + 95)
    g.lineStyle(5, 0xff9f1c).lineBetween(slideX - 45, slideY - 20, slideX + 65, slideY + 90)

    const slideTrigger = this.add.rectangle(slideX, slideY + 30, 90, 90, 0xffffff, 0.001).setInteractive({ useHandCursor: true })
    slideTrigger.on('pointerdown', () => {
      if (!this.character.setDurableState('sitting')) { showToast('Qian Hui is busy right now!') ; return }
        this.character.setPosition(slideX - 40, slideY - 15)
      this.character.setExpression('excited')
      this.character.updateStat('fun', 20)
      this.character.updateStat('happiness', 15)
      playerState.data.character = this.character.toSave()
      playerState.save(true)
      audioManager.play('drop')
      showToast('Wheeeee down the slide! ✨ +Fun!')
      this.tweens.add({
        targets: this.character,
        x: slideX + 65,
        y: slideY + 85,
        duration: 650,
        ease: 'Cubic.In',
        onComplete: () => {
          this.character.setDurableState('standing')
          this.character.playCelebrate()
        },
      })
    })

    // 3. Illustrated Wooden Sandbox with Sandcastles & Treasure
    const sandX = 560
    const sandY = 390
    g.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(sandX - 82, sandY - 42, 164, 96, 18)
    // Wooden border
    g.fillStyle(0xba8148).fillRoundedRect(sandX - 80, sandY - 45, 160, 92, 16).lineStyle(2.5, OUTLINE).strokeRoundedRect(sandX - 80, sandY - 45, 160, 92, 16)
    // Soft sand fill
    g.fillStyle(0xfde2b3).fillRoundedRect(sandX - 72, sandY - 37, 144, 76, 10)

    // Sandcastle in center
    g.fillStyle(0xe0b978).fillRoundedRect(sandX - 16, sandY - 26, 32, 28, 4)
    g.fillStyle(0xe0b978).fillTriangle(sandX - 16, sandY - 26, sandX + 16, sandY - 26, sandX, sandY - 38)
    g.fillStyle(0xf72585).fillTriangle(sandX, sandY - 38, sandX + 8, sandY - 34, sandX, sandY - 30) // Red flag

    this.add.text(sandX, sandY + 28, 'SANDBOX', {
      fontFamily: 'Trebuchet MS',
      fontSize: '10px',
      color: '#8a6534',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // 4 Dig spots in sandbox
    const spots = [
      { x: sandX - 44, y: sandY - 10, id: 1 },
      { x: sandX + 44, y: sandY - 10, id: 2 },
      { x: sandX - 28, y: sandY + 14, id: 3 },
      { x: sandX + 28, y: sandY + 14, id: 4 },
    ]

    spots.forEach((spot) => {
      // Audit fix #10: illustrated sand mound instead of the 🏖️ emoji.
      const mound = this.add.container(spot.x, spot.y).setInteractive(
        new Phaser.Geom.Circle(0, 0, 14), Phaser.Geom.Circle.Contains
      )
      const moundG = this.add.graphics()
      moundG.fillStyle(0xe8c98a).fillEllipse(0, 3, 26, 12)
      moundG.fillStyle(0xf0d69c).fillEllipse(0, 0, 20, 10)
      moundG.lineStyle(1.5, OUTLINE, 0.4).strokeEllipse(0, 3, 26, 12)
      // Tiny trowel sticking out of the mound
      moundG.fillStyle(0xd4a373).fillRoundedRect(6, -14, 3, 12, 1)
      moundG.fillStyle(0x9c6644).fillTriangle(4, -14, 11, -14, 7.5, -8)
      const eventId = `park-sandbox-${spot.id}`
      const alreadyDug = dailyEventComplete(playerState.data.minigames, eventId)
      const moundStar = this.add.text(0, -2, alreadyDug ? '⭐' : '✨', { fontSize: alreadyDug ? '14px' : '10px' }).setOrigin(0.5).setAlpha(alreadyDug ? 1 : 0.85)
      mound.add([moundG, moundStar])
      mound.on('pointerdown', () => {
        if (!completeDailyEvent(playerState.data.minigames, eventId)) {
          showToast('Already searched this spot today! Try another corner!')
          return
        }
        moundStar.setText('⭐').setFontSize('14px').setAlpha(1)
        const reward = spot.id % 2 === 0 ? 15 : 25
        playerState.currency.add(reward)
        this.character?.updateStat('fun', 15)
        this.character?.updateStat('happiness', 10)
        playerState.data.character = this.character.toSave()
        playerState.save(true)
        audioManager.play('purchase')
        showToast(`Found buried treasure! +${reward} ⭐ +Fun!`)
        this.character?.playCelebrate()

        const sparkle = this.add.text(spot.x, spot.y - 15, `+${reward} ⭐`, {
          fontFamily: 'Trebuchet MS',
          fontSize: '13px',
          color: '#754c72',
          fontStyle: 'bold',
          backgroundColor: '#fff1ad',
          padding: { x: 5, y: 2 },
        }).setOrigin(0.5).setDepth(4500)
        this.tweens.add({ targets: sparkle, y: sparkle.y - 25, alpha: 0, duration: 800, onComplete: () => sparkle.destroy() })
      })
    })

    // 4. Red Gingham Picnic Blanket
    const picX = 265
    const picY = 430
    g.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(picX - 38, picY - 20, 76, 44, 8)
    g.fillStyle(0xf28482).fillRoundedRect(picX - 35, picY - 22, 70, 40, 6).lineStyle(1.5, OUTLINE).strokeRoundedRect(picX - 35, picY - 22, 70, 40, 6)
    // White check pattern
    g.fillStyle(0xffffff, 0.5)
    for (let ox = -30; ox <= 30; ox += 14) {
      g.fillRect(picX + ox, picY - 22, 7, 40)
    }
    // Picnic basket & snacks
    g.fillStyle(0xba7c4b).fillRoundedRect(picX - 16, picY - 14, 32, 22, 5).lineStyle(1.5, OUTLINE).strokeRoundedRect(picX - 16, picY - 14, 32, 22, 5)

    const picTrigger = this.add.rectangle(picX, picY, 70, 40, 0x000000, 0.001).setInteractive({ useHandCursor: true })
    picTrigger.on('pointerdown', () => {
      if (!this.character.setDurableState('sitting')) { showToast('Qian Hui is busy right now!') ; return }
      this.character.setPosition(picX + 25, picY - 5)
      this.character.setExpression('eating')
      audioManager.play('chew')
      showToast('Picnic snack time in the sunshine! +Hunger +Fun! 🧺')
      this.character.updateStat('hunger', 25)
      this.character.updateStat('fun', 20)
      this.character.updateStat('happiness', 15)
      playerState.data.character = this.character.toSave()
      playerState.save(true)
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
