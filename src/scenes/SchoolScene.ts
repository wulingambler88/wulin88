import { treasureManager } from '../treasure/TreasureManager'
import Phaser from 'phaser'
import { Character } from '../characters/Character'
import { NPCBase } from '../characters/NPCBase'
import { audioManager } from '../audio/AudioManager'
import { locationManager } from '../navigation/LocationManager'
import { playerState } from '../state/PlayerState'
import { SpeechBubble } from '../ui/SpeechBubble'
import { setHelper, showToast } from '../ui/UIManager'

const OUTLINE = 0x663d63
const OUTLINE_LIGHT = 0x78504b

const LESSONS = [
  { topic: 'Math Magic', content: '2 + 3 = 5 🌟\n10 - 4 = 6 ✨\n4 × 2 = 8 🎯', icon: '📐' },
  { topic: 'Spelling Bee', content: 'S - T - A - R 💫\nF - R - I - E - N - D 💖\nS - C - H - O - O - L 🏫', icon: '📚' },
  { topic: 'Nature & Solar', content: '☀️ Sun  🌍 Earth  🌙 Moon\nPlants love sunshine! 🌱', icon: '🌿' },
  { topic: 'Music Harmony', content: 'Do - Re - Mi - Fa - Sol 🎵\n♫ ♬ ♩ 𝅘𝅥𝅯 ♪\nSweet melodies ring! 🎶', icon: '🎶' },
]

const EASEL_ART = [
  { title: 'Golden Sunflower', color: 0xffd166, glyph: '🌻' },
  { title: 'Cosmic Rainbow', color: 0x90e0ef, glyph: '🌈' },
  { title: 'Happy Kitty', color: 0xfb6f92, glyph: '🐱' },
  { title: 'Starry Sky', color: 0x6a4c93, glyph: '🌌' },
]

export class SchoolScene extends Phaser.Scene {
  private character!: Character
  private teacherNPC!: NPCBase
  private debugElapsed = 0
  private lessonIndex = 0
  private artIndex = 0
  private boardText!: Phaser.GameObjects.Text
  private easelCanvas!: Phaser.GameObjects.Rectangle
  private easelGlyph!: Phaser.GameObjects.Text

  constructor() { super('SchoolScene') }

  create(): void {
    locationManager.resetLock()
    playerState.setLocation('school')
    this.drawClassroom()
    this.drawTeacher()
    this.drawBlackboard()
    this.drawEasel()
    this.drawDesks()
    this.drawBookshelf()

    this.character = new Character(this, { ...playerState.data.character, x: 500, y: 430, state: 'standing' })
    treasureManager.spawnClueIfPresent(this, 'school')
    this.bindActions()
    this.game.events.emit('ui:context', 'venue')
    this.game.events.emit('ui:stats', { ...this.character.stats })
    setHelper('Tap the chalkboard to learn, the easel to choose artwork, or desks to study!')
    this.cameras.main.fadeIn(320, 245, 245, 255)
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
      zone: 'school',
      inventory: JSON.stringify(playerState.inventory.snapshot()),
      scene: 'School',
      currency: playerState.currency.getBalance(),
      cartTotal: 0,
    })
  }

  private drawClassroom(): void {
    const g = this.add.graphics()
    this.add.image(190, 400, 'world-furniture', 3).setDisplaySize(105, 180)

    // 1. Warm Mint & Pastel Wallpaper
    g.fillStyle(0xeefaf6).fillRect(0, 0, 960, 370)
    // Wood wainscoting
    g.fillStyle(0xecd5bd).fillRect(0, 310, 960, 60)
    g.lineStyle(2, OUTLINE_LIGHT, 0.4).lineBetween(0, 310, 960, 310)

    // Wood floor planks
    g.fillStyle(0xe0be98).fillRect(0, 370, 960, 170)
    g.lineStyle(1.5, 0xc69e76, 0.6)
    for (let y = 370; y < 540; y += 34) {
      g.lineBetween(0, y, 960, y)
    }

    // Alphabet pennant banner across the top
    const bannerLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    bannerLetters.forEach((letter, i) => {
      const bx = 110 + i * 78
      g.fillStyle(i % 2 === 0 ? 0xffb7b2 : 0xb5ead7).fillTriangle(bx - 16, 12, bx + 16, 12, bx, 44)
      g.lineStyle(1.5, OUTLINE_LIGHT).strokeTriangle(bx - 16, 12, bx + 16, 12, bx, 44)
      this.add.text(bx, 24, letter, {
        fontFamily: 'Trebuchet MS',
        fontSize: '13px',
        color: '#4a4a4a',
        fontStyle: 'bold',
      }).setOrigin(0.5)
    })

    // Classroom Wall Clock
    g.fillStyle(0xffffff).fillCircle(880, 58, 26).lineStyle(3, OUTLINE).strokeCircle(880, 58, 26)
    g.fillStyle(0xffd166).fillCircle(880, 58, 22)
    g.lineStyle(2, OUTLINE).lineBetween(880, 58, 880, 44).lineBetween(880, 58, 892, 58)
    this.add.text(880, 70, '10:15', { fontFamily: 'Courier New', fontSize: '9px', color: '#4a4e69', fontStyle: 'bold' }).setOrigin(0.5)

    // School Brass Bell
    const bellContainer = this.add.container(880, 118)
    const bellG = this.add.graphics()
    bellG.fillStyle(0xffd166).fillCircle(0, 0, 18).lineStyle(2.5, 0xb8860b).strokeCircle(0, 0, 18)
    const bellText = this.add.text(0, 0, '🔔', { fontSize: '16px' }).setOrigin(0.5)
    bellContainer.add([bellG, bellText]).setSize(36, 36).setInteractive({ useHandCursor: true })

    bellContainer.on('pointerdown', () => {
      audioManager.play('chime')
      this.tweens.add({
        targets: bellContainer,
        angle: { from: -18, to: 18 },
        duration: 80,
        yoyo: true,
        repeat: 4,
        onComplete: () => bellContainer.setAngle(0),
      })
      showToast('Ding-dong! Recess time at Sunshine Academy! 🏫🔔')
    })

    // Title banner
    const banner = this.add.graphics()
    banner.fillStyle(0xffffff, 0.94).fillRoundedRect(30, 14, 280, 48, 14)
    banner.lineStyle(2, 0xefc6b3).strokeRoundedRect(30, 14, 280, 48, 14)
    this.add.text(45, 24, '🏫 Sunshine Academy', {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#2a5a52',
      fontStyle: 'bold',
    })
    this.add.text(45, 44, 'Chalkboard, art easel & learning library', {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#52796f',
    })
  }

  private drawTeacher(): void {
    // Ms. Blossom Teacher NPC
    this.teacherNPC = new NPCBase(this, 780, 290, {
      id: 'ms_blossom',
      name: 'Ms. Blossom',
      role: 'Teacher',
      skinColor: 0xffdfc5,
      hairStyle: 'bob',
      hairColor: 0x6b4226,
      eyeColor: 0x3d3544,
      outfitColor: 0x3a86ff,
      apronColor: 0xffd166,
      accessory: 'glasses',
      icon: '📖',
      dialogues: [
        'Welcome to Sunshine Academy! Knowledge is a wonderful superpower!',
        'Tap the chalkboard to switch between math, science, and spelling!',
        'Try the Quiz button on the board to test your memory and earn stars!',
        'Learning something new every day makes your brain sparkle! ⭐',
      ],
    })
    this.teacherNPC.setScale(0.85).setDepth(200)

    // Teacher's Desk
    const tg = this.add.graphics()
    tg.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(720, 335, 140, 75, 12)
    tg.fillStyle(0xba7c4b).fillRoundedRect(725, 330, 130, 70, 10).lineStyle(2.5, OUTLINE).strokeRoundedRect(725, 330, 130, 70, 10)
    // Red Apple & Stack of Books on Teacher's desk
    tg.fillStyle(0x4361ee).fillRoundedRect(735, 320, 28, 8, 2)
    tg.fillStyle(0xf72585).fillRoundedRect(733, 314, 30, 6, 2)
    tg.fillStyle(0xed3f58).fillCircle(780, 322, 7).lineStyle(1.5, OUTLINE).strokeCircle(780, 322, 7)
    tg.fillStyle(0x52b788).fillEllipse(784, 316, 4, 2)
  }

  private drawBlackboard(): void {
    const bg = this.add.graphics()
    // Wooden frame
    bg.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(75, 85, 370, 230, 14)
    bg.fillStyle(0x7f5539).fillRoundedRect(80, 80, 360, 225, 12).lineStyle(2.5, OUTLINE).strokeRoundedRect(80, 80, 360, 225, 12)
    // Dark Green Chalk Slate
    bg.fillStyle(0x234d3d).fillRoundedRect(92, 92, 336, 198, 8)

    // Chalk tray & chalk sticks
    bg.fillStyle(0xa68a64).fillRoundedRect(92, 285, 336, 14, 4).lineStyle(1.5, OUTLINE).strokeRoundedRect(92, 285, 336, 14, 4)
    bg.fillStyle(0xffffff).fillRect(120, 287, 18, 6)
    bg.fillStyle(0xffbe0b).fillRect(145, 287, 18, 6)
    bg.fillStyle(0x48cae4).fillRect(170, 287, 18, 6)
    // Felt eraser
    bg.fillStyle(0x503b4d).fillRoundedRect(210, 286, 26, 8, 3)

    const title = this.add.text(260, 115, LESSONS[this.lessonIndex].topic, {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#ffdd53',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.boardText = this.add.text(260, 185, LESSONS[this.lessonIndex].content, {
      fontFamily: 'Courier New',
      fontSize: '17px',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 8,
    }).setOrigin(0.5)

    const tapZone = this.add.rectangle(260, 195, 336, 198, 0x000000, 0.001).setInteractive({ useHandCursor: true })
    tapZone.on('pointerdown', () => {
      audioManager.play('pop')
      this.lessonIndex = (this.lessonIndex + 1) % LESSONS.length
      const lesson = LESSONS[this.lessonIndex]
      title.setText(lesson.topic)
      this.boardText.setText(lesson.content)
      this.character.updateStat('fun', 15)
      this.character.updateStat('happiness', 10)
      playerState.data.character = this.character.toSave()
      playerState.save(true)
      showToast(`${lesson.icon} Lesson: ${lesson.topic}! +Fun!`)
    })

    // Brain Games Quiz Gateway Button
    const quizBtn = this.add.container(365, 260)
    const qBg = this.add.graphics()
    qBg.fillStyle(0xffd166).fillRoundedRect(-46, -14, 92, 28, 8)
    qBg.lineStyle(2, 0xffffff).strokeRoundedRect(-46, -14, 92, 28, 8)
    const qText = this.add.text(0, 0, '📝 Take Quiz', {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#543d00',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    quizBtn.add([qBg, qText])
    quizBtn.setInteractive(new Phaser.Geom.Rectangle(-46, -14, 92, 28), Phaser.Geom.Rectangle.Contains)
    quizBtn.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event?.stopPropagation()
      audioManager.play('chime')
      this.game.events.emit('ui:open-brain-hub', 'quiz')
    })
  }

  private drawEasel(): void {
    const easelContainer = this.add.container(510, 215)
    const g = this.add.graphics()

    // Wooden A-Frame legs
    g.lineStyle(6, 0x8b5a2b)
    g.lineBetween(-35, 120, 0, -40)
    g.lineBetween(35, 120, 0, -40)
    g.lineBetween(0, 120, 0, -40)
    g.lineStyle(8, 0xa67c52)
    g.lineBetween(-48, 70, 48, 70) // Shelf crossbar

    easelContainer.add(g)

    // Canvas with wooden frame
    this.easelCanvas = this.add.rectangle(0, 15, 96, 108, EASEL_ART[this.artIndex].color)
      .setStrokeStyle(3, 0xffffff)
    this.easelGlyph = this.add.text(0, 15, EASEL_ART[this.artIndex].glyph, { fontSize: '38px' }).setOrigin(0.5)

    easelContainer.add([this.easelCanvas, this.easelGlyph])
    easelContainer.setSize(100, 140).setInteractive({ useHandCursor: true })

    easelContainer.on('pointerdown', () => {
      audioManager.play('chime')
      this.artIndex = (this.artIndex + 1) % EASEL_ART.length
      const art = EASEL_ART[this.artIndex]
      this.easelCanvas.setFillStyle(art.color)
      this.easelGlyph.setText(art.glyph)
      this.character.updateStat('fun', 15)
      this.character.updateStat('happiness', 15)
      playerState.data.character = this.character.toSave()
      playerState.save(true)
      this.tweens.add({ targets: easelContainer, scaleX: 1.1, scaleY: 1.1, duration: 120, yoyo: true })
      showToast(`🎨 Artwork: ${art.title}! +Fun!`)
    })
  }

  private drawDesks(): void {
    const deskPositions = [260, 440]
    deskPositions.forEach((x, i) => {
      const g = this.add.graphics()
      // Desk Shadow
      g.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(x - 52, 435, 104, 30, 8)
      // Wooden desk top
      g.fillStyle(0xd4a373).fillRoundedRect(x - 50, 390, 100, 48, 8).lineStyle(2.5, OUTLINE).strokeRoundedRect(x - 50, 390, 100, 48, 8)
      // Legs
      g.fillStyle(0x7f5539).fillRect(x - 45, 438, 8, 30).fillRect(x + 37, 438, 8, 30)
      // Notebook on desk
      g.fillStyle(0xffffff).fillRoundedRect(x - 32, 400, 24, 20, 3).lineStyle(1.5, OUTLINE).strokeRoundedRect(x - 32, 400, 24, 20, 3)
      // Pencil
      g.fillStyle(0xffd166).fillRect(x + 6, 404, 20, 4)

      // Chair cushion
      g.fillStyle(0xffb8d9).fillRoundedRect(x - 25, 445, 50, 16, 6).lineStyle(2, OUTLINE).strokeRoundedRect(x - 25, 445, 50, 16, 6)

      const deskHit = this.add.rectangle(x, 420, 110, 70, 0x000000, 0.001).setInteractive({ useHandCursor: true })
      deskHit.on('pointerdown', () => {
        audioManager.play('pop')
        if (!this.character.setDurableState('sitting')) { showToast('Qian Hui is busy right now!') ; return }
        this.character.setPosition(x, 410)
        this.character.setExpression('happy', 1500)
        this.character.updateStat('energy', 15)
        this.character.updateStat('fun', 10)
        playerState.data.character = this.character.toSave()
        playerState.save(true)
        new SpeechBubble(this, x, 310, `Studying at Desk #${i + 1}! ✏️`, '📖', 2000)
        showToast('Study time! Smart points increased! ⭐ +Energy!')
      })
    })
  }

  private drawBookshelf(): void {
    // Illustrated Classroom Bookshelf
    const shelfX = 645
    const shelfY = 190
    const g = this.add.graphics()

    g.fillStyle(OUTLINE_LIGHT, 0.16).fillRoundedRect(shelfX - 52, shelfY - 80, 104, 185, 10)
    g.fillStyle(0xc88f4e).fillRoundedRect(shelfX - 50, shelfY - 85, 100, 180, 8).lineStyle(2.5, OUTLINE).strokeRoundedRect(shelfX - 50, shelfY - 85, 100, 180, 8)

    // Shelf dividers with books
    for (let row = 0; row < 3; row++) {
      const by = shelfY - 60 + row * 55
      g.fillStyle(0xfff3e3).fillRect(shelfX - 46, by + 40, 92, 8)
      // Colorful books
      const colors = [0x3a86ff, 0xff70a6, 0x52b788, 0xffd166]
      for (let b = 0; b < 4; b++) {
        g.fillStyle(colors[(row + b) % colors.length]).fillRoundedRect(shelfX - 42 + b * 22, by + 4, 18, 36, 3)
      }
    }

    const shelfHit = this.add.rectangle(shelfX, shelfY, 100, 180, 0x000000, 0.001).setInteractive({ useHandCursor: true })
    shelfHit.on('pointerdown', () => {
      audioManager.play('rustle')
      playerState.inventory.add('school_notebook_01', 1)
      playerState.save(true)
      showToast('Found a Star Notebook! Added to your bag!')
      this.character.playCelebrate()
    })
  }

  private bindActions(): void {
    const map = (): void => { locationManager.navigate(this, 'town', playerState.data.unlockedLocations) }
    const home = (): void => { locationManager.navigate(this, 'home', playerState.data.unlockedLocations) }
    this.game.events.on('ui:map', map).on('ui:home', home)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('ui:map', map).off('ui:home', home)
    })

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.y > 490 && pointer.x > 850) return
      if (pointer.y < 350 && pointer.x < 460) return
      if (pointer.y < 300 && pointer.x > 460 && pointer.x < 560) return
      if (pointer.y > 360) {
        this.character.walkTo(Phaser.Math.Clamp(pointer.x, 80, 880), Phaser.Math.Clamp(pointer.y, 400, 460))
      }
    })
  }
}
