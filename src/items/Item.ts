import Phaser from 'phaser'
import type { ItemDefinition } from '../data/items'
import { audioManager } from '../audio/AudioManager'

import { PropRenderer } from './PropRenderer'

export class Item extends Phaser.GameObjects.Container {
  readonly instanceId: string
  readonly definition: ItemDefinition
  lastValid = { x: 0, y: 0 }
  private pointerDownPos = { x: 0, y: 0 }

  constructor(scene: Phaser.Scene, instanceId: string, definition: ItemDefinition, x: number, y: number) {
    super(scene, x, y)
    this.instanceId = instanceId
    this.definition = definition
    this.lastValid = { x, y }
    scene.add.existing(this)
    this.setSize(64, 64)
    this.setInteractive({ useHandCursor: true })
    scene.input.setDraggable(this)
    this.draw()

    this.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      this.pointerDownPos = { x: ptr.x, y: ptr.y }
    })

    this.on('pointerup', (ptr: Phaser.Input.Pointer) => {
      const dist = Phaser.Math.Distance.Between(this.pointerDownPos.x, this.pointerDownPos.y, ptr.x, ptr.y)
      if (dist < 8) {
        this.playTapReaction()
      }
    })
  }

  playTapReaction(): void {
    if (this.definition.id === 'ball_01' || this.definition.tags?.includes('sport')) {
      audioManager.play('bounce')
      this.scene.tweens.add({
        targets: this,
        y: this.y - 70,
        duration: 180,
        yoyo: true,
        ease: 'Quad.Out',
      })
    } else if (this.definition.id === 'teddy_01' || this.definition.tags?.includes('soft')) {
      audioManager.play('rustle')
      this.scene.tweens.add({
        targets: this,
        scaleX: 1.15,
        scaleY: 0.88,
        duration: 120,
        yoyo: true,
        ease: 'Sine.easeInOut',
      })
    } else {
      audioManager.play('pop')
      this.scene.tweens.add({
        targets: this,
        scale: 1.14,
        duration: 90,
        yoyo: true,
        ease: 'Back.easeOut',
      })
    }
  }

  private draw(): void {
    const g = this.scene.add.graphics()
    PropRenderer.drawProp(g, this.definition.id, 0, 0, 1.1)
    this.add(g)
  }
}
