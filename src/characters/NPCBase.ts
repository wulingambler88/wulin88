import Phaser from 'phaser'
import { SpeechBubble } from '../ui/SpeechBubble'
import { audioManager } from '../audio/AudioManager'

export interface NPCConfig {
  id: string
  name: string
  role: string
  spriteKey?: string
  skinColor?: number
  hairStyle?: 'twin_buns' | 'long_waves' | 'ponytail' | 'bob' | 'pixie' | 'short_tidy'
  hairColor?: number
  eyeColor?: number
  outfitColor?: number
  accentColor?: number
  apronColor?: number
  accessory?: 'glasses' | 'cap' | 'ears' | 'bowtie' | 'shears' | 'none'
  dialogues: string[]
  icon?: string
  showBadge?: boolean
}

const OUTLINE = 0x663d63
const OUTLINE_LIGHT = 0x78504b

export class NPCBase extends Phaser.GameObjects.Container {
  readonly config: NPCConfig
  private dialogueIndex = 0
  private speechBubble?: SpeechBubble

  constructor(scene: Phaser.Scene, x: number, y: number, config: NPCConfig) {
    super(scene, x, y)
    this.config = config
    scene.add.existing(this)

    this.drawNPC()
    this.setSize(80, 140)
    this.setInteractive({ useHandCursor: true })

    this.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event?.stopPropagation()
      this.playTapGreeting()
    })
  }

  playTapGreeting(): void {
    audioManager.play('chime')

    // Cycle dialogue
    const text = this.config.dialogues[this.dialogueIndex % this.config.dialogues.length]!
    this.dialogueIndex++

    if (this.speechBubble?.active) {
      this.speechBubble.destroy()
    }
    this.speechBubble = new SpeechBubble(
      this.scene,
      this.x,
      this.y - 85,
      `${this.config.name}: "${text}"`,
      this.config.icon ?? '✨',
      3200
    )
  }

  private drawNPC(): void {
    const g = this.scene.add.graphics()
    this.add(g)

    if (this.config.spriteKey && this.scene.textures.exists(this.config.spriteKey)) {
      g.fillStyle(OUTLINE_LIGHT, 0.22).fillEllipse(0, 72, 66, 16)
      const sprite = this.scene.add.image(0, -6, this.config.spriteKey)
      sprite.setDisplaySize(116, 185)
      this.add(sprite)

      if (this.config.showBadge !== false) {
        const tagBg = this.scene.add.graphics()
        tagBg.fillStyle(0xffffff, 0.94).fillRoundedRect(-44, -108, 88, 22, 11)
        tagBg.lineStyle(1.5, 0xf2c4ce).strokeRoundedRect(-44, -108, 88, 22, 11)
        const nameText = this.scene.add.text(0, -97, `${this.config.icon ?? '✨'} ${this.config.name}`, {
          fontFamily: 'Trebuchet MS',
          fontSize: '11px',
          color: '#6e4458',
          fontStyle: 'bold',
        }).setOrigin(0.5)
        this.add([tagBg, nameText])
      }
      this.setSize(96, 176)
      return
    }

    const skin = this.config.skinColor ?? 0xffdfc5
    const hair = this.config.hairColor ?? 0x7c4e2f
    const eye = this.config.eyeColor ?? 0x483245
    const bodyColor = this.config.outfitColor ?? 0x79c7ec
    const accent = this.config.accentColor ?? 0xffffff

    // Ground shadow
    g.fillStyle(OUTLINE_LIGHT, 0.18).fillEllipse(0, 56, 60, 14)

    // Back hair
    g.lineStyle(2, OUTLINE)
    if (this.config.hairStyle === 'long_waves') {
      g.fillStyle(hair).fillRoundedRect(-38, -48, 76, 92, 20).strokeRoundedRect(-38, -48, 76, 92, 20)
    } else if (this.config.hairStyle === 'twin_buns') {
      g.fillStyle(hair).fillCircle(-28, -52, 16).strokeCircle(-28, -52, 16)
      g.fillStyle(hair).fillCircle(28, -52, 16).strokeCircle(28, -52, 16)
    } else if (this.config.hairStyle === 'ponytail') {
      g.fillStyle(hair).fillCircle(26, -56, 18).strokeCircle(26, -56, 18)
    }

    // Legs & Shoes
    g.fillStyle(0xffffff).fillRoundedRect(-18, 38, 14, 20, 4).fillRoundedRect(4, 38, 14, 20, 4)
    g.fillStyle(0x503b4d).fillRoundedRect(-20, 48, 18, 12, 5).fillRoundedRect(2, 48, 18, 12, 5)

    // Torso & Clothing
    g.fillStyle(bodyColor).fillRoundedRect(-26, 0, 52, 44, 10).lineStyle(2, OUTLINE).strokeRoundedRect(-26, 0, 52, 44, 10)

    // Apron or Uniform Overlay
    if (this.config.apronColor) {
      g.fillStyle(this.config.apronColor).fillRoundedRect(-20, 6, 40, 36, 6).lineStyle(1.5, OUTLINE).strokeRoundedRect(-20, 6, 40, 36, 6)
      // Apron straps
      g.lineStyle(2, this.config.apronColor).lineBetween(-14, 6, -6, -2).lineBetween(14, 6, 6, -2)
      // Pocket with gold button or badge
      g.fillStyle(0xffffff).fillRoundedRect(-10, 22, 20, 14, 4)
      g.fillStyle(0xffd700).fillCircle(0, 12, 2.5)
    }

    // Arms
    g.fillStyle(skin).fillRoundedRect(-34, 4, 11, 34, 5).strokeRoundedRect(-34, 4, 11, 34, 5)
    g.fillStyle(skin).fillRoundedRect(23, 4, 11, 34, 5).strokeRoundedRect(23, 4, 11, 34, 5)

    // Head
    g.fillStyle(hair).fillCircle(0, -38, 36).strokeCircle(0, -38, 36)
    g.fillStyle(skin).fillCircle(0, -32, 34).strokeCircle(0, -32, 34)

    // Ears
    g.fillStyle(skin).fillCircle(-34, -32, 6).strokeCircle(-34, -32, 6)
    g.fillStyle(skin).fillCircle(34, -32, 6).strokeCircle(34, -32, 6)

    // Chibi Eyes
    g.fillStyle(0xffffff).fillEllipse(-16, -32, 18, 18).fillEllipse(16, -32, 18, 18)
    g.fillStyle(eye).fillCircle(-16, -32, 7).fillCircle(16, -32, 7)
    g.fillStyle(0xffffff).fillCircle(-18, -35, 2.5).fillCircle(14, -35, 2.5) // Catchlight
    g.lineStyle(2.2, OUTLINE).beginPath().arc(-16, -32, 9, 3.2, 6.1).strokePath()
    g.beginPath().arc(16, -32, 9, 3.2, 6.1).strokePath()

    // Cheerful Eyebrows
    g.lineStyle(1.8, OUTLINE_LIGHT).beginPath().arc(-16, -42, 7, 3.4, 6.0).strokePath()
    g.beginPath().arc(16, -42, 7, 3.4, 6.0).strokePath()

    // Rosy Blush
    g.fillStyle(0xff8fc4, 0.6).fillEllipse(-22, -22, 9, 5).fillEllipse(22, -22, 9, 5)

    // Sweet Smile
    g.lineStyle(2, 0xb3496c).beginPath().arc(0, -22, 6, 0.2, 2.9).strokePath()

    // Bangs
    g.fillStyle(hair)
      .fillCircle(-16, -52, 13).strokeCircle(-16, -52, 13)
      .fillCircle(0, -56, 15).strokeCircle(0, -56, 15)
      .fillCircle(16, -52, 13).strokeCircle(16, -52, 13)

    // Accessories
    if (this.config.accessory === 'glasses') {
      g.lineStyle(2, 0x9d4edd).strokeCircle(-16, -32, 11).strokeCircle(16, -32, 11).lineBetween(-5, -32, 5, -32)
    } else if (this.config.accessory === 'cap') {
      // Visor cap
      g.fillStyle(accent).fillRoundedRect(-26, -64, 52, 16, 7).strokeRoundedRect(-26, -64, 52, 16, 7)
      g.fillStyle(accent).fillEllipse(12, -56, 26, 8).strokeEllipse(12, -56, 26, 8)
    } else if (this.config.accessory === 'ears') {
      // Bunny headband
      g.fillStyle(0xff8fc4).fillRoundedRect(-18, -74, 9, 24, 4).fillRoundedRect(9, -74, 9, 24, 4)
      g.fillStyle(0xffffff).fillRoundedRect(-16, -72, 5, 18, 2).fillRoundedRect(11, -72, 5, 18, 2)
    } else if (this.config.accessory === 'bowtie') {
      g.fillStyle(0xd90429).fillTriangle(-10, -3, -2, 2, -10, 7).fillTriangle(10, -3, 2, 2, 10, 7).fillCircle(0, 2, 3)
    } else if (this.config.accessory === 'shears') {
      // Silver styling shears
      g.lineStyle(2.2, 0xd0d8e2).lineBetween(17, 12, 27, 26).lineBetween(27, 12, 17, 26)
      g.lineStyle(1.8, 0x909eb0).strokeCircle(15, 10, 3.5).strokeCircle(29, 10, 3.5)
    }

    // Name badge overhead
    const tagBg = this.scene.add.graphics()
    tagBg.fillStyle(0xffffff, 0.94).fillRoundedRect(-38, -82, 76, 20, 10)
    tagBg.lineStyle(1.5, 0xf2c4ce).strokeRoundedRect(-38, -82, 76, 20, 10)
    const nameText = this.scene.add.text(0, -72, this.config.name, {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#6e4458',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    this.add([tagBg, nameText])
  }
}
