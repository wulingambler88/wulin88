import Phaser from 'phaser'
import { getPetDefinition, type PetDefinition } from '../data/pets'
import type { AdoptedPet } from '../save/SaveSchema'
import { audioManager } from '../audio/AudioManager'

const OUTLINE = 0x663d63
const OUTLINE_LIGHT = 0x78504b

export class Pet extends Phaser.GameObjects.Container {
  readonly instanceId: string
  readonly definition: PetDefinition
  hunger: number
  happiness: number
  lastValid = { x: 0, y: 0 }
  private visual?: Phaser.GameObjects.Container
  private tailTween?: Phaser.Tweens.Tween

  constructor(scene: Phaser.Scene, data: AdoptedPet) {
    super(scene, data.x, data.y)
    this.instanceId = data.instanceId
    this.definition = getPetDefinition(data.petId) ?? {
      id: data.petId,
      name: data.name,
      species: 'puppy',
      icon: '🐾',
      color: 0xffd98d,
      accent: 0xc88f4e,
      price: 100,
      favoriteFood: 'apple_01',
      sound: 'bark',
      description: 'A cute companion',
    }
    this.hunger = data.hunger ?? 80
    this.happiness = data.happiness ?? 80
    this.lastValid = { x: data.x, y: data.y }
    scene.add.existing(this)
    this.setSize(76, 76)
    this.setInteractive({ useHandCursor: true })
    scene.input.setDraggable(this)
    this.draw()

    // Gentle idle breathing / tail wag
    this.tailTween = scene.tweens.add({
      targets: this,
      scaleY: 1.03,
      duration: 1200,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    })

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.tailTween?.stop()
    })
  }

  petAnimal(): void {
    this.happiness = Math.min(100, this.happiness + 15)
    this.heartEffect()
    audioManager.play('chew')
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.15,
      scaleY: 0.88,
      duration: 120,
      yoyo: true,
    })
  }

  feed(hungerRestore = 25): void {
    this.hunger = Math.min(100, this.hunger + hungerRestore)
    this.happiness = Math.min(100, this.happiness + 15)
    this.heartEffect()
    audioManager.play('purchase')
    this.scene.tweens.add({
      targets: this,
      y: this.y - 18,
      duration: 150,
      yoyo: true,
      repeat: 2,
    })
  }

  toData(location: import('../data/locations').LocationId): AdoptedPet {
    return {
      instanceId: this.instanceId,
      petId: this.definition.id,
      name: this.definition.name,
      location,
      x: Math.round(this.x),
      y: Math.round(this.y),
      hunger: this.hunger,
      happiness: this.happiness,
    }
  }

  private draw(): void {
    this.visual?.destroy(true)
    const root = this.scene.add.container(0, 0)
    const g = this.scene.add.graphics()

    // Contact ground shadow
    g.fillStyle(OUTLINE_LIGHT, 0.18).fillEllipse(0, 26, 56, 16)

    const baseColor = this.definition.color
    const accent = this.definition.accent

    // Illustrated rendering per species
    if (this.definition.species === 'bunny') {
      // Long ears
      g.fillStyle(baseColor).fillRoundedRect(-16, -42, 11, 28, 5).fillRoundedRect(5, -42, 11, 28, 5)
      g.lineStyle(2, OUTLINE).strokeRoundedRect(-16, -42, 11, 28, 5).strokeRoundedRect(5, -42, 11, 28, 5)
      g.fillStyle(0xffa8d3).fillRoundedRect(-13, -38, 5, 20, 2).fillRoundedRect(8, -38, 5, 20, 2)
      // Body & Paws
      g.fillStyle(baseColor).fillCircle(0, 4, 25).lineStyle(2.5, OUTLINE).strokeCircle(0, 4, 25)
      g.fillStyle(0xffffff).fillCircle(-10, 24, 6).fillCircle(10, 24, 6)
      // Fluffy tail
      g.fillStyle(0xffffff).fillCircle(20, 10, 8).lineStyle(2, OUTLINE).strokeCircle(20, 10, 8)
      // Face details
      g.fillStyle(0x3a2312).fillCircle(-8, 0, 3).fillCircle(8, 0, 3)
      g.fillStyle(0xffffff).fillCircle(-9, -1.5, 1.2).fillCircle(7, -1.5, 1.2)
      g.fillStyle(0xff7ab8).fillTriangle(-3, 6, 3, 6, 0, 9)
    } else if (this.definition.species === 'kitten') {
      // Pointed ears with pink inner
      g.fillStyle(baseColor).fillTriangle(-22, -8, -12, -32, -4, -8).fillTriangle(4, -8, 12, -32, 22, -8)
      g.lineStyle(2, OUTLINE).strokeTriangle(-22, -8, -12, -32, -4, -8).strokeTriangle(4, -8, 12, -32, 22, -8)
      g.fillStyle(0xffa8d3).fillTriangle(-18, -9, -12, -26, -7, -9).fillTriangle(7, -9, 12, -26, 18, -9)
      // Body & Curved Tail
      g.lineStyle(4, baseColor).beginPath().arc(20, 12, 12, -Math.PI / 2, Math.PI / 4).strokePath()
      g.lineStyle(1.8, OUTLINE).beginPath().arc(20, 12, 12, -Math.PI / 2, Math.PI / 4).strokePath()
      g.fillStyle(baseColor).fillCircle(0, 4, 24).lineStyle(2.5, OUTLINE).strokeCircle(0, 4, 24)
      // Whiskers
      g.lineStyle(1.5, OUTLINE)
        .lineBetween(-16, 4, -26, 2).lineBetween(-16, 7, -26, 9)
        .lineBetween(16, 4, 26, 2).lineBetween(16, 7, 26, 9)
      // Kawaii Eyes & Nose
      g.fillStyle(0x3a2312).fillCircle(-8, 1, 3.5).fillCircle(8, 1, 3.5)
      g.fillStyle(0xffffff).fillCircle(-9, -0.5, 1.2).fillCircle(7, -0.5, 1.2)
      g.fillStyle(0xff7ab8).fillCircle(0, 6, 2)
      // Bell Collar
      g.fillStyle(0xff5964).fillRoundedRect(-14, 16, 28, 5, 2)
      g.fillStyle(0xffd700).fillCircle(0, 20, 3.5)
    } else if (this.definition.species === 'panda') {
      // Black Ears
      g.fillStyle(0x2b2d42).fillCircle(-18, -18, 9).fillCircle(18, -18, 9)
      g.lineStyle(2, OUTLINE).strokeCircle(-18, -18, 9).strokeCircle(18, -18, 9)
      // White Chubby Head/Body
      g.fillStyle(0xffffff).fillCircle(0, 4, 26).lineStyle(2.5, OUTLINE).strokeCircle(0, 4, 26)
      // Black Eye Patches
      g.fillStyle(0x2b2d42).fillEllipse(-9, 2, 7, 10).fillEllipse(9, 2, 7, 10)
      // Eyes inside patches
      g.fillStyle(0xffffff).fillCircle(-9, 1, 3.5).fillCircle(9, 1, 3.5)
      g.fillStyle(0x000000).fillCircle(-9, 1, 2).fillCircle(9, 1, 2)
      g.fillStyle(0xffffff).fillCircle(-10, 0, 0.8).fillCircle(8, 0, 0.8)
      // Nose & Mouth
      g.fillStyle(0x2b2d42).fillCircle(0, 8, 2.5)
      // Bamboo leaf snack
      g.fillStyle(0x52b788).fillEllipse(18, 14, 8, 4).lineStyle(1, 0x1b4332).strokeEllipse(18, 14, 8, 4)
    } else if (this.definition.species === 'hamster') {
      // Tiny rounded ears
      g.fillStyle(accent).fillCircle(-16, -16, 7).fillCircle(16, -16, 7)
      g.fillStyle(0xffa8d3).fillCircle(-16, -16, 4).fillCircle(16, -16, 4)
      // Chubby cheeks body
      g.fillStyle(baseColor).fillCircle(0, 4, 24).lineStyle(2.5, OUTLINE).strokeCircle(0, 4, 24)
      g.fillStyle(0xffecd9).fillCircle(-13, 8, 10).fillCircle(13, 8, 10) // Plump cheeks
      // Eyes & Snout
      g.fillStyle(0x3a2312).fillCircle(-7, 0, 3).fillCircle(7, 0, 3)
      g.fillStyle(0xffffff).fillCircle(-8, -1, 1).fillCircle(6, -1, 1)
      g.fillStyle(0xff7ab8).fillCircle(0, 4, 2)
      // Holding sunflower seed in paws
      g.fillStyle(0x543217).fillEllipse(0, 16, 6, 9)
      g.fillStyle(baseColor).fillCircle(-5, 17, 3.5).fillCircle(5, 17, 3.5)
    } else {
      // Puppy (Buttercup)
      // Floppy ears
      g.fillStyle(accent).fillEllipse(-20, -6, 10, 18).fillEllipse(20, -6, 10, 18)
      g.lineStyle(2, OUTLINE).strokeEllipse(-20, -6, 10, 18).strokeEllipse(20, -6, 10, 18)
      // Head & Body
      g.fillStyle(baseColor).fillCircle(0, 4, 25).lineStyle(2.5, OUTLINE).strokeCircle(0, 4, 25)
      // Snout muzzle
      g.fillStyle(0xffeed9).fillEllipse(0, 8, 16, 12)
      g.fillStyle(0x3a2312).fillCircle(0, 4, 3.5) // Shiny dark nose
      // Large glossy puppy eyes
      g.fillStyle(0x3a2312).fillCircle(-9, -1, 4).fillCircle(9, -1, 4)
      g.fillStyle(0xffffff).fillCircle(-10.5, -2.5, 1.5).fillCircle(7.5, -2.5, 1.5)
      // Collar with star tag
      g.fillStyle(0x3a86ff).fillRoundedRect(-14, 17, 28, 5, 2)
      g.fillStyle(0xffd700).fillCircle(0, 21, 3.5)
    }

    // Rosy Blush
    g.fillStyle(0xff8fc4, 0.65).fillEllipse(-14, 8, 7, 4).fillEllipse(14, 8, 7, 4)

    root.add(g)
    this.visual = root
    this.add(root)
  }

  private heartEffect(): void {
    for (let i = 0; i < 4; i++) {
      const heart = this.scene.add.text(this.x + (i - 1.5) * 16, this.y - 30, '♥', {
        fontSize: '20px',
        color: '#ff69b4',
      }).setOrigin(0.5).setDepth(4900)
      this.scene.tweens.add({
        targets: heart,
        y: heart.y - 40,
        alpha: 0,
        scale: 1.4,
        duration: 800,
        delay: i * 80,
        onComplete: () => heart.destroy(),
      })
    }
  }
}
