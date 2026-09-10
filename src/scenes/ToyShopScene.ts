import Phaser from 'phaser'
import { Character } from '../characters/Character'
import { NPCBase } from '../characters/NPCBase'
import { PropRenderer } from '../items/PropRenderer'
import { ITEM_DEFINITIONS, type ItemDefinition } from '../data/items'
import { audioManager } from '../audio/AudioManager'
import { locationManager } from '../navigation/LocationManager'
import { playerState } from '../state/PlayerState'
import { setHelper, showToast } from '../ui/UIManager'
import { treasureManager } from '../treasure/TreasureManager'

const TOY_ITEMS = ITEM_DEFINITIONS.filter((item) => item.category === 'toys')

const OUTLINE = 0x663d63
const OUTLINE_LIGHT = 0x78504b

export class ToyShopScene extends Phaser.Scene {
  private character!: Character
  private shopkeeperNPC!: NPCBase
  private debugElapsed = 0
  private trainContainer?: Phaser.GameObjects.Container

  constructor() { super('ToyShopScene') }

  create(): void {
    locationManager.resetLock()
    playerState.setLocation('toy_shop')

    this.drawToyShopEnvironment()
    this.drawAlphabetPlayMat()
    this.drawToyShelvesAndCubbies()
    this.drawShopkeeper()

    this.character = new Character(this, {
      ...playerState.data.character,
      x: 560,
      y: 415,
      state: 'standing',
    })

    treasureManager.spawnClueIfPresent(this, 'toy_shop')
    this.bindFloorClick()
    this.bindActions()

    this.game.events.emit('ui:context', 'venue')
    this.game.events.emit('ui:stats', { ...this.character.stats })
    setHelper('Tap any toy to play with it or solve puzzles on the play mat! 🧸')
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
      zone: 'toy_shop',
      inventory: JSON.stringify(playerState.inventory.snapshot()),
      scene: 'ToyShop',
      currency: playerState.currency.getBalance(),
      cartTotal: 0,
    })
  }

  private drawToyShopEnvironment(): void {
    const g = this.add.graphics()
    this.add.image(575, 405, 'world-furniture', 4).setDisplaySize(145, 155)

    // 1. Upper Wall - Storybook Cream & Soft Coral Carnival Stripes
    g.fillStyle(0xfffaed).fillRect(0, 0, 960, 355)

    // Warm vertical carnival candy stripes
    g.fillStyle(0xffe8ec, 0.6)
    for (let x = 0; x < 960; x += 48) {
      g.fillRect(x, 0, 24, 355)
    }

    // Ceiling Crown Molding
    g.fillStyle(0xffffff).fillRect(0, 0, 960, 18)
    g.fillStyle(0xf7d1cd).fillRect(0, 18, 960, 4)

    // Carnival Pennant Bunting across the ceiling
    const flagColors = [0xff75a8, 0xffd166, 0x06d6a0, 0x118ab2, 0x8338ec]
    for (let i = 0; i < 20; i++) {
      const bx = i * 48
      const col = flagColors[i % flagColors.length]!
      g.fillStyle(col).fillTriangle(bx, 22, bx + 48, 22, bx + 24, 46)
      g.lineStyle(1.5, OUTLINE).strokeTriangle(bx, 22, bx + 48, 22, bx + 24, 46)
    }

    // Wainscoting trim
    g.fillStyle(0xffeed9).fillRect(0, 315, 960, 40)
    g.lineStyle(2, 0xd4a373).lineBetween(0, 315, 960, 315)
    g.lineStyle(2, 0xc18553).lineBetween(0, 355, 960, 355)

    // 2. Lower Floor - Warm Honey Wood Flooring
    g.fillStyle(0xf6dfc2).fillRect(0, 355, 960, 185)
    g.fillStyle(0xedd1ad)
    for (let y = 355; y < 540; y += 36) {
      g.fillRect(0, y, 960, 18)
      g.lineStyle(1, 0xdfbc93).lineBetween(0, y, 960, y)
    }
    // Floor plank separators
    g.lineStyle(1, 0xd8b284, 0.45)
    for (let x = 60; x < 960; x += 120) {
      g.lineBetween(x, 355, x, 540)
    }

    // Balloon Arch Cluster in Top-Left Corner
    this.drawBalloonCluster(60, 75)

    // Title Plaque
    const titlePlate = this.add.container(480, 42)
    const tBg = this.add.graphics()
    tBg.fillStyle(0xffffff, 0.95).fillRoundedRect(-180, -20, 360, 40, 14)
    tBg.lineStyle(2, 0xffa48e).strokeRoundedRect(-180, -20, 360, 40, 14)
    const tText = this.add.text(0, 0, '🎈 Starlet Wonder Toy Shop 🧸', {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#6e3c66',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    titlePlate.add([tBg, tText])
  }

  private drawBalloonCluster(x: number, y: number): void {
    const g = this.add.graphics()
    const balloons = [
      { dx: -24, dy: 10, r: 18, color: 0xff75a8 },
      { dx: 0, dy: -12, r: 20, color: 0xffd166 },
      { dx: 24, dy: 8, r: 19, color: 0x48cae4 },
      { dx: 6, dy: 24, r: 17, color: 0x06d6a0 },
    ]

    balloons.forEach((b) => {
      // Balloon String
      g.lineStyle(1.5, 0x9e889c).beginPath().moveTo(x + b.dx, y + b.dy + b.r).lineTo(x + b.dx - 2, y + b.dy + b.r + 28).strokePath()
      // Balloon Body
      g.fillStyle(b.color).fillCircle(x + b.dx, y + b.dy, b.r)
      g.lineStyle(1.5, OUTLINE).strokeCircle(x + b.dx, y + b.dy, b.r)
      // Highlight
      g.fillStyle(0xffffff, 0.6).fillCircle(x + b.dx - 5, y + b.dy - 6, 4)
    })
  }

  private drawAlphabetPlayMat(): void {
    const matX = 520
    const matY = 445
    const g = this.add.graphics()

    // Foam Play Rug Base
    g.fillStyle(OUTLINE_LIGHT, 0.15).fillRoundedRect(matX - 160, matY - 65, 320, 130, 24)
    g.fillStyle(0xfff0f3).fillRoundedRect(matX - 156, matY - 61, 312, 122, 20)
    g.lineStyle(3, 0xffcbf2).strokeRoundedRect(matX - 156, matY - 61, 312, 122, 20)

    // Interlocking Pastel Tiles with Letters/Numbers
    const tiles = [
      { dx: -105, dy: -30, color: 0xffcad4, label: 'A' },
      { dx: -35, dy: -30, color: 0xb5e2fa, label: 'B' },
      { dx: 35, dy: -30, color: 0xc1fba4, label: 'C' },
      { dx: 105, dy: -30, color: 0xffe5d8, label: '⭐' },
      { dx: -105, dy: 30, color: 0xfde2e4, label: '1' },
      { dx: -35, dy: 30, color: 0xd8bbff, label: '2' },
      { dx: 35, dy: 30, color: 0xffd6a5, label: '3' },
      { dx: 105, dy: 30, color: 0x9bf6ff, label: '❤️' },
    ]

    tiles.forEach((t) => {
      g.fillStyle(t.color).fillRoundedRect(matX + t.dx - 30, matY + t.dy - 26, 60, 52, 10)
      g.lineStyle(1.5, 0xffffff).strokeRoundedRect(matX + t.dx - 30, matY + t.dy - 26, 60, 52, 10)
      this.add.text(matX + t.dx, matY + t.dy, t.label, {
        fontFamily: 'Trebuchet MS',
        fontSize: '18px',
        color: '#6e4458',
        fontStyle: 'bold',
      }).setOrigin(0.5)
    })

    // Interactive 3D Puzzle Game Box on the mat
    const puzzleStation = this.add.container(matX + 35, matY + 30)
    const pBg = this.add.graphics()
    pBg.fillStyle(0xffffff, 0.95).fillRoundedRect(-55, -18, 110, 36, 12)
    pBg.lineStyle(2.5, 0xff70a6).strokeRoundedRect(-55, -18, 110, 36, 12)
    const pText = this.add.text(0, 0, '🧩 Jigsaw Fun', {
      fontFamily: 'Trebuchet MS',
      fontSize: '13px',
      color: '#754c72',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    puzzleStation.add([pBg, pText])
    puzzleStation.setSize(110, 36).setInteractive({ useHandCursor: true })
    puzzleStation.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event?.stopPropagation()
      audioManager.play('chime')
      this.game.events.emit('ui:open-brain-hub', 'puzzle')
    })
    this.tweens.add({
      targets: puzzleStation,
      scale: 1.05,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private drawToyShelvesAndCubbies(): void {
    const g = this.add.graphics()

    // Large Storybook Wooden Cubby Display Cabinet
    const shelfX = 65
    const shelfY = 90
    const shelfW = 340
    const shelfH = 265

    // Cabinet Frame
    g.fillStyle(OUTLINE_LIGHT, 0.18).fillRoundedRect(shelfX - 5, shelfY - 5, shelfW + 10, shelfH + 10, 18)
    g.fillStyle(0xffeed9).fillRoundedRect(shelfX, shelfY, shelfW, shelfH, 14)
    g.lineStyle(3, OUTLINE).strokeRoundedRect(shelfX, shelfY, shelfW, shelfH, 14)

    // Wood Grain shelves (3 tiers)
    for (let r = 0; r < 3; r++) {
      const sy = shelfY + 80 + r * 85
      g.fillStyle(0xdfa069).fillRoundedRect(shelfX + 8, sy, shelfW - 16, 14, 5)
      g.lineStyle(1.5, OUTLINE).strokeRoundedRect(shelfX + 8, sy, shelfW - 16, 14, 5)
    }

    // Populate shelves with interactive toys using PropRenderer
    const slotPositions = [
      { x: shelfX + 60, y: shelfY + 50, item: TOY_ITEMS[0] }, // Teddy Bear
      { x: shelfX + 170, y: shelfY + 50, item: TOY_ITEMS[1] }, // Bouncing Ball
      { x: shelfX + 280, y: shelfY + 50, item: TOY_ITEMS[2] }, // Wind-up Robot
      { x: shelfX + 60, y: shelfY + 135, item: TOY_ITEMS[3] }, // Plush Dino
      { x: shelfX + 170, y: shelfY + 135, item: TOY_ITEMS[4] }, // Toy Train
      { x: shelfX + 280, y: shelfY + 135, item: TOY_ITEMS[5] }, // Rainbow Kite
      { x: shelfX + 115, y: shelfY + 220, item: TOY_ITEMS[6] }, // Flying Disc
    ]

    slotPositions.forEach((slot) => {
      if (!slot.item) return
      this.createInteractiveToy(slot.x, slot.y, slot.item)
    })

    // Miniature Wooden Train on Track (Bottom Shelf Animation)
    this.createMiniTrainLoop(shelfX + 235, shelfY + 220)
  }

  private createInteractiveToy(x: number, y: number, toy: ItemDefinition): void {
    const container = this.add.container(x, y)
    const g = this.add.graphics()
    PropRenderer.drawProp(g, toy.id, 0, 0, 0.92)
    container.add(g)

    // Interaction Hitbox
    container.setSize(64, 64).setInteractive({ useHandCursor: true })
    container.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event?.stopPropagation()
      this.playToyInteraction(toy, container)
    })

    // Subtle gentle float
    this.tweens.add({
      targets: container,
      y: y - 4,
      duration: 1400 + Math.random() * 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private playToyInteraction(toy: ItemDefinition, container: Phaser.GameObjects.Container): void {
    if (toy.id === 'teddy_01') {
      // Warm Hug with Floating Hearts
      audioManager.play('chime')
      this.character.playPetReaction()
      this.character.setExpression('happy')
      showToast('You hugged the fluffy teddy bear! Warm & cuddly! 🧸💖')

      for (let i = 0; i < 5; i++) {
        const h = this.add.text(container.x + (i - 2) * 16, container.y - 30, '💖', { fontSize: '18px' }).setDepth(2200)
        this.tweens.add({
          targets: h,
          y: h.y - 40,
          alpha: 0,
          scale: 1.4,
          duration: 700,
          onComplete: () => h.destroy(),
        })
      }
    } else if (toy.id === 'ball_01') {
      // Physics Bounce with Squash & Stretch
      audioManager.play('bounce')
      this.character.react('playing', 900)
      this.character.setExpression('excited')
      showToast('Boing! The pastel soccer ball bounced super high! ⚽⭐')

      const origY = container.y
      this.tweens.add({
        targets: container,
        y: origY - 70,
        scaleX: 0.85,
        scaleY: 1.25,
        duration: 250,
        ease: 'Quad.Out',
        onComplete: () => {
          this.tweens.add({
            targets: container,
            y: origY,
            scaleX: 1.3,
            scaleY: 0.7,
            duration: 200,
            ease: 'Quad.In',
            onComplete: () => {
              this.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
              })
            },
          })
        },
      })
    } else if (toy.id === 'toy_robot_01') {
      // Wind-up Marching Dance with Beep Sound
      audioManager.play('honk')
      this.character.playCelebrate()
      this.character.setExpression('excited')
      showToast('Click-whirr! The wind-up robot is doing a happy dance! 🤖')

      this.tweens.add({
        targets: container,
        angle: { from: -14, to: 14 },
        duration: 120,
        yoyo: true,
        repeat: 5,
        onComplete: () => container.setAngle(0),
      })
    } else if (toy.id === 'toy_dino_01') {
      // Cute Dino Roar & Musical Sparkles
      audioManager.play('pop')
      this.character.react('playing', 800)
      this.character.setExpression('curious')
      showToast('Rawr! The plush dino gave you a high five! 🦕✨')

      this.tweens.add({
        targets: container,
        scale: 1.3,
        duration: 180,
        yoyo: true,
        repeat: 1,
      })
    } else {
      // General Toy Fun
      audioManager.play('pickup')
      this.character.react('playing', 1000)
      showToast(`Playing with ${toy.name}! So much fun! ⭐`)
      this.tweens.add({
        targets: container,
        scale: 1.25,
        duration: 160,
        yoyo: true,
      })
    }

    this.character.updateStat('fun', 20)
    this.character.updateStat('happiness', 15)
    playerState.data.character = this.character.toSave()
    playerState.save(true)
  }

  private createMiniTrainLoop(x: number, y: number): void {
    this.trainContainer = this.add.container(x, y)
    const g = this.add.graphics()
    PropRenderer.drawProp(g, 'toy_train_01', 0, 0, 0.85)
    this.trainContainer.add(g)

    this.trainContainer.setSize(50, 40).setInteractive({ useHandCursor: true })
    this.trainContainer.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event?.stopPropagation()
      audioManager.play('honk')
      showToast('Choo Choo! All aboard the Wonder Express! 🚂💨 +Fun!')
      this.character.updateStat('fun', 15)
      this.character.updateStat('happiness', 10)
      playerState.data.character = this.character.toSave()
      playerState.save(true)

      // Puff steam clouds
      for (let i = 0; i < 4; i++) {
        const steam = this.add.circle(this.trainContainer!.x - 15, this.trainContainer!.y - 20, 6, 0xffffff, 0.85).setDepth(2100)
        this.tweens.add({
          targets: steam,
          y: steam.y - 30 - i * 8,
          x: steam.x - 15,
          alpha: 0,
          scale: 2,
          duration: 600,
          onComplete: () => steam.destroy(),
        })
      }

      // Quick chug speedup
      this.tweens.add({
        targets: this.trainContainer,
        x: x + 25,
        duration: 250,
        yoyo: true,
        repeat: 2,
      })
    })
  }

  private drawShopkeeper(): void {
    this.shopkeeperNPC = new NPCBase(this, 780, 310, {
      id: 'toby',
      name: 'Toby',
      role: 'Toy Maker',
      spriteKey: 'resident-toyshop',
      skinColor: 0xffdfc5,
      hairStyle: 'pixie',
      hairColor: 0x5e3023,
      eyeColor: 0x3d2b1f,
      outfitColor: 0x48cae4,
      apronColor: 0xc17c46,
      accessory: 'bowtie',
      dialogues: [
        'Welcome to Wonder Toys! Every toy here has a sparkle of magic! 🧸',
        'Wind up the robot and watch it dance on the play mat! 🤖',
        'Have you tried solving today\'s jigsaw puzzle? 🧩',
        'Toys bring big smiles to every corner of Avatar City! ⭐',
      ],
      icon: '🧸',
    })
    this.shopkeeperNPC.setDepth(500)

    // Toy maker workbench on the right
    const g = this.add.graphics()
    g.fillStyle(0xdfa069).fillRoundedRect(830, 360, 110, 48, 8)
    g.lineStyle(2, OUTLINE).strokeRoundedRect(830, 360, 110, 48, 8)
    // Small painted wooden block & paintbrush on table
    g.fillStyle(0xffd166).fillRoundedRect(850, 350, 18, 18, 4)
    g.lineStyle(2, 0xef476f).lineBetween(885, 358, 910, 348)
  }

  private bindFloorClick(): void {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (!over.length && pointer.y > 360) {
        this.character.walkTo(
          Phaser.Math.Clamp(pointer.x, 160, 830),
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
