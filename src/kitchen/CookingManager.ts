import Phaser from 'phaser'
import { findMatchingRecipe, type RecipeDefinition } from '../data/recipes'
import { audioManager } from '../audio/AudioManager'
import { showToast } from '../ui/UIManager'

interface CookingManagerOptions {
  onCook: (resultItemId: string, spawnX: number, spawnY: number) => void
  onCookFailed?: (ingredientIds: string[]) => void
}

export class CookingManager {
  private readonly scene: Phaser.Scene
  private readonly options: CookingManagerOptions
  private blenderIngredients: string[] = []
  private stoveIngredients: string[] = []
  private blenderContainer!: Phaser.GameObjects.Container
  private stoveContainer!: Phaser.GameObjects.Container
  private blenderLabel!: Phaser.GameObjects.Text
  private stoveLabel!: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, options: CookingManagerOptions) {
    this.scene = scene
    this.options = options
    this.createCookware()
  }

  private createCookware(): void {
    const OUTLINE = 0x663d63

    // 1. Illustrated Blender (x: 2470, y: 268)
    this.blenderContainer = this.scene.add.container(2470, 268).setDepth(250)
    const bg = this.scene.add.graphics()

    // Blender Motor Base (Pastel Coral/Mint)
    bg.fillStyle(0xffa8ba).fillRoundedRect(-20, 4, 40, 26, 6)
    bg.lineStyle(2, OUTLINE).strokeRoundedRect(-20, 4, 40, 26, 6)
    // Control dial & power light
    bg.fillStyle(0xffffff).fillCircle(-6, 17, 4.5)
    bg.fillStyle(0xffd166).fillCircle(8, 17, 3)

    // Glass Pitcher
    bg.fillStyle(0xddf4fb, 0.85).fillRoundedRect(-18, -28, 36, 32, 5)
    bg.lineStyle(2, OUTLINE).strokeRoundedRect(-18, -28, 36, 32, 5)
    // Glass handle
    bg.lineStyle(2.5, OUTLINE).beginPath().arc(19, -14, 7, -Math.PI / 2, Math.PI / 2).strokePath()
    // Measurement marks
    bg.lineStyle(1.5, 0x8ecae6).lineBetween(-14, -20, -8, -20).lineBetween(-14, -14, -8, -14).lineBetween(-14, -8, -8, -8)
    // Pitcher Lid
    bg.fillStyle(0xff75a8).fillRoundedRect(-20, -33, 40, 7, 3)
    bg.lineStyle(1.5, OUTLINE).strokeRoundedRect(-20, -33, 40, 7, 3)
    bg.fillStyle(0xffffff).fillCircle(0, -33, 3)

    this.blenderLabel = this.scene.add.text(0, 36, 'Blender', {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#754c72',
      fontStyle: 'bold',
      backgroundColor: '#ffffffcc',
      padding: { x: 5, y: 2 },
    }).setOrigin(0.5)

    this.blenderContainer.add([bg, this.blenderLabel]).setSize(54, 66).setInteractive({ useHandCursor: true })
    this.blenderContainer.on('pointerdown', () => {
      audioManager.play('button')
      if (this.blenderIngredients.length === 0) {
        showToast('Blender: Drop Apple + Milk or Strawberry + Milk! 🍎🥛')
      } else {
        showToast(`Blender holds: ${this.blenderIngredients.join(', ')}`)
      }
    })

    // 2. Illustrated Stove Skillet / Pan (x: 2600, y: 268)
    this.stoveContainer = this.scene.add.container(2600, 268).setDepth(250)
    const sg = this.scene.add.graphics()

    // Pan handle
    sg.fillStyle(0x42384a).fillRoundedRect(18, -5, 26, 10, 4)
    sg.lineStyle(2, OUTLINE).strokeRoundedRect(18, -5, 26, 10, 4)

    // Outer Skillet Body
    sg.fillStyle(0x3d3546).fillCircle(0, 0, 24)
    sg.lineStyle(2.5, OUTLINE).strokeCircle(0, 0, 24)
    // Copper rim accent
    sg.lineStyle(2, 0xdfa069).strokeCircle(0, 0, 22)
    // Nonstick cooking surface
    sg.fillStyle(0x5a4f63).fillCircle(0, 0, 19)

    // Cooking sizzle detail: sunny-side egg / butter melt
    sg.fillStyle(0xffffff, 0.9).fillEllipse(-2, 2, 14, 11)
    sg.fillStyle(0xffbe0b).fillCircle(-1, 2, 4.5)

    this.stoveLabel = this.scene.add.text(0, 36, 'Stove Pan', {
      fontFamily: 'Trebuchet MS',
      fontSize: '11px',
      color: '#754c72',
      fontStyle: 'bold',
      backgroundColor: '#ffffffcc',
      padding: { x: 5, y: 2 },
    }).setOrigin(0.5)

    this.stoveContainer.add([sg, this.stoveLabel]).setSize(56, 56).setInteractive({ useHandCursor: true })
    this.stoveContainer.on('pointerdown', () => {
      audioManager.play('button')
      if (this.stoveIngredients.length === 0) {
        showToast('Stove: Drop Bread + Cheese or Cake + Strawberry! 🍞🧀')
      } else {
        showToast(`Stove holds: ${this.stoveIngredients.join(', ')}`)
      }
    })
  }

  handleItemDrop(itemId: string, itemX: number, itemY: number): boolean {
    // Check blender
    if (Phaser.Math.Distance.Between(itemX, itemY, 2470, 268) <= 55) {
      this.blenderIngredients.push(itemId)
      audioManager.play('drop')
      this.checkCooking('blender')
      return true
    }

    // Check stove
    if (Phaser.Math.Distance.Between(itemX, itemY, 2600, 268) <= 55) {
      this.stoveIngredients.push(itemId)
      audioManager.play('drop')
      this.checkCooking('stove')
      return true
    }

    return false
  }

  private checkCooking(cookware: 'stove' | 'blender'): void {
    const list = cookware === 'blender' ? this.blenderIngredients : this.stoveIngredients
    const matched = findMatchingRecipe(cookware, list)

    if (matched) {
      this.executeCooking(cookware, matched)
    } else if (list.length >= 2) {
      showToast('Hmm, these ingredients do not make a recipe. They are back in your bag!')
      this.options.onCookFailed?.([...list])
      list.length = 0
    } else {
      showToast(`Added to ${cookware}! Add 1 more ingredient to cook! 🍲`)
    }
  }

  private executeCooking(cookware: 'stove' | 'blender', recipe: RecipeDefinition): void {
    const targetX = cookware === 'blender' ? 2470 : 2600
    const targetY = 268
    const targetContainer = cookware === 'blender' ? this.blenderContainer : this.stoveContainer

    audioManager.play('eat')
    this.scene.tweens.add({
      targets: targetContainer,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 180,
      yoyo: true,
      repeat: 3,
    })

    // Steam / sparkle effects
    for (let i = 0; i < 6; i++) {
      const steam = this.scene.add.text(targetX + (i - 2.5) * 14, targetY - 20, i % 2 === 0 ? '✨' : '♨️', {
        fontSize: '18px',
      }).setDepth(5000)
      this.scene.tweens.add({
        targets: steam,
        y: steam.y - 45,
        alpha: 0,
        duration: 900,
        onComplete: () => steam.destroy(),
      })
    }

    this.scene.time.delayedCall(700, () => {
      audioManager.play('purchase')
      if (cookware === 'blender') this.blenderIngredients = []
      else this.stoveIngredients = []

      showToast(`🎉 Freshly Made: ${recipe.name}! ${recipe.icon}`)
      this.options.onCook(recipe.resultItemId, targetX, targetY + 50)
    })
  }
}
