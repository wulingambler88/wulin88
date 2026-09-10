import Phaser from 'phaser'
import type { AvatarCustomization, CharacterSave, CharacterStats, DurableCharacterState } from '../save/SaveSchema'
import { AvatarRenderer, type CharacterExpression } from './AvatarRenderer'
import { ClothingManager, type EquippedClothing } from './ClothingManager'
import { CharacterState, type CharacterStateName } from './CharacterState'
import { audioManager } from '../audio/AudioManager'

export class Character extends Phaser.GameObjects.Container {
  readonly stateMachine: CharacterState
  readonly clothing: ClothingManager
  readonly stats: CharacterStats
  customization?: AvatarCustomization
  private readonly renderer: AvatarRenderer
  private visual?: Phaser.GameObjects.Container
  private reactionTimer?: Phaser.Time.TimerEvent
  private currentExpression?: CharacterExpression
  private zzzTimer?: Phaser.Time.TimerEvent

  heldItemId?: string
  private idleTween?: Phaser.Tweens.Tween
  private blinkTimer?: Phaser.Time.TimerEvent
  private walkTween?: Phaser.Tweens.Tween

  constructor(scene: Phaser.Scene, save: CharacterSave) {
    super(scene, save.x, save.y)
    this.stateMachine = new CharacterState(save.state)
    this.clothing = new ClothingManager(save.equipped)
    this.stats = { ...save.stats }
    this.customization = save.customization ? { ...save.customization } : undefined
    this.renderer = new AvatarRenderer(scene)
    this.heldItemId = save.heldItemId
    scene.add.existing(this)
    this.setSize(118, 180)
    this.setInteractive({ useHandCursor: true })
    scene.input.setDraggable(this)
    this.redraw()

    this.blinkTimer = scene.time.addEvent({
      delay: 3800,
      loop: true,
      callback: () => {
        if (!this.active) return
        const lids = this.visual?.getByName('blink-lids') as Phaser.GameObjects.Graphics | null
        if (!lids) return
        lids.setVisible(true)
        scene.time.delayedCall(120, () => {
          // BUG-18 fix: re-fetch the lids from the current visual. A redraw()
          // may have replaced the visual while the blink was in flight, and
          // hiding a stale (destroyed) object would skip the blink.
          const current = this.visual?.getByName('blink-lids') as Phaser.GameObjects.Graphics | null
          if (current?.active) current.setVisible(false)
        })
      },
    })

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.blinkTimer?.remove(false)
      this.reactionTimer?.remove(false)
      this.zzzTimer?.remove(false)
      this.walkTween?.stop()
      this.stopIdleBreathing()
    })
  }

  holdItem(itemId: string): void {
    this.heldItemId = itemId
    this.redraw()
  }

  dropHeldItem(): string | undefined {
    const item = this.heldItemId
    this.heldItemId = undefined
    this.redraw()
    return item
  }

  setExpression(expr: CharacterExpression, durationMs?: number): void {
    this.currentExpression = expr
    this.redraw()
    if (durationMs) {
      this.reactionTimer?.remove(false)
      this.reactionTimer = this.scene.time.delayedCall(durationMs, () => {
        this.currentExpression = undefined
        this.redraw()
      })
    }
  }

  eatFood(itemId: string, onComplete?: () => void): void {
    this.heldItemId = itemId
    this.setExpression('eating')
    audioManager.play('chew')
    this.react('eating', 1400, () => {
      this.heldItemId = undefined
      this.currentExpression = 'happy'
      this.updateStat('hunger', 25)
      this.updateStat('happiness', 10)
      this.redraw()
      this.scene.time.delayedCall(800, () => {
        this.currentExpression = undefined
        this.redraw()
        onComplete?.()
      })
    })
  }

  drinkBeverage(itemId: string, onComplete?: () => void): void {
    this.heldItemId = itemId
    this.setExpression('drinking')
    audioManager.play('pop')
    this.react('eating', 1200, () => {
      this.heldItemId = undefined
      this.currentExpression = 'happy'
      this.updateStat('hunger', 15)
      this.updateStat('energy', 10)
      this.redraw()
      this.scene.time.delayedCall(600, () => {
        this.currentExpression = undefined
        this.redraw()
        onComplete?.()
      })
    })
  }

  playWave(): void {
    this.setExpression('happy', 1200)
    audioManager.play('chime')
    this.scene.tweens.add({
      targets: this,
      angle: { from: -6, to: 6 },
      duration: 160,
      yoyo: true,
      repeat: 2,
      onComplete: () => this.setAngle(0),
    })
  }

  playCelebrate(): void {
    this.setExpression('excited', 1600)
    audioManager.play('purchase')
    const startY = this.y
    this.scene.tweens.add({
      targets: this,
      y: startY - 24,
      duration: 180,
      yoyo: true,
      repeat: 1,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.y = startY
      },
    })
  }

  playPetReaction(): void {
    this.setExpression('happy', 1400)
    audioManager.play('chime')
    // Floating hearts
    for (let i = 0; i < 4; i++) {
      const h = this.scene.add.text(this.x + (i - 1.5) * 16, this.y - 70, '♥', {
        fontSize: '20px',
        color: '#ff69b4',
      }).setOrigin(0.5).setDepth(4900)
      this.scene.tweens.add({
        targets: h,
        y: h.y - 35,
        alpha: 0,
        scale: 1.4,
        duration: 700 + i * 150,
        onComplete: () => h.destroy(),
      })
    }
  }

  playDropSettle(): void {
    this.stopIdleBreathing()
    const baseX = this.scaleX
    const baseY = this.scaleY
    this.scene.tweens.add({
      targets: this,
      scaleX: baseX * 1.05,
      scaleY: baseY * 0.95,
      duration: 80,
      ease: 'Quad.Out',
      yoyo: true,
      onComplete: () => {
        this.setScale(baseX, baseY)
        this.startIdleBreathing()
      },
    })
  }

  changeState(state: CharacterStateName): boolean {
    if (!this.stateMachine.transition(state)) return false
    this.redraw()
    return true
  }

  setDurableState(state: DurableCharacterState): boolean {
    if (!this.stateMachine.transition(state)) return false
    if (state === 'sleeping') {
      this.startSleepZzz()
    } else {
      this.stopSleepZzz()
    }
    this.redraw()
    return true
  }

  private startSleepZzz(): void {
    this.stopSleepZzz()
    this.zzzTimer = this.scene.time.addEvent({
      delay: 1400,
      loop: true,
      callback: () => {
        if (!this.active || this.stateMachine.value !== 'sleeping') return
        const z = this.scene.add.text(this.x + 20, this.y - 30, 'z', {
          fontFamily: 'Trebuchet MS',
          fontSize: '18px',
          color: '#b89fe8',
          fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(4900)
        this.scene.tweens.add({
          targets: z,
          x: z.x + 18,
          y: z.y - 40,
          scale: 1.5,
          alpha: 0,
          duration: 1200,
          onComplete: () => z.destroy(),
        })
      },
    })
  }

  private stopSleepZzz(): void {
    this.zzzTimer?.remove(false)
    this.zzzTimer = undefined
  }

  react(state: 'eating' | 'playing', duration: number, onComplete?: () => void): boolean {
    if (!this.changeState(state)) return false
    this.reactionTimer?.remove(false)
    this.reactionTimer = this.scene.time.delayedCall(duration, () => {
      this.stateMachine.finishReaction()
      this.redraw()
      onComplete?.()
    })
    return true
  }

  equip(itemId: string): boolean {
    const changed = this.clothing.equip(itemId)
    if (changed) this.redraw()
    return changed
  }

  restoreOutfit(outfit: EquippedClothing): void {
    this.clothing.restore(outfit)
    this.redraw()
  }

  outfit(): EquippedClothing {
    return this.clothing.snapshot()
  }

  setCustomization(custom: AvatarCustomization): void {
    this.customization = { ...custom }
    this.redraw()
  }

  walkTo(targetX: number, targetY: number, onComplete?: () => void): void {
    if (this.stateMachine.isBusy) return
    this.walkTween?.stop()
    const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY)
    this.changeState('standing')
    // Face direction
    if (targetX < this.x && this.scaleX > 0) {
      this.scaleX = -Math.abs(this.scaleX)
    } else if (targetX > this.x && this.scaleX < 0) {
      this.scaleX = Math.abs(this.scaleX)
    }

    this.walkTween = this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      duration: Math.max(300, dist * 2.2),
      ease: 'Sine.Out',
      onComplete: () => {
        if (this.scaleX < 0) this.scaleX = Math.abs(this.scaleX)
        onComplete?.()
      },
    })
  }

  updateStat(stat: keyof CharacterStats, amount: number): void {
    this.stats[stat] = Phaser.Math.Clamp(this.stats[stat] + amount, 0, 100)
    try {
      this.scene.game.events.emit('ui:stats', { ...this.stats })
    } catch {
      // ignore
    }
  }

  toSave(): CharacterSave {
    const value = this.stateMachine.value
    const state: DurableCharacterState = value === 'sitting' || value === 'sleeping' ? value : 'standing'
    return {
      x: this.x,
      y: this.y,
      state,
      equipped: this.outfit(),
      stats: { ...this.stats },
      customization: this.customization,
      heldItemId: this.heldItemId,
    }
  }

  private redraw(): void {
    this.stopIdleBreathing()
    this.visual?.destroy(true)
    this.visual = this.renderer.render(
      this.outfit(),
      this.stateMachine.value,
      this.customization,
      this.heldItemId,
      this.currentExpression
    )
    this.add(this.visual)
    this.startIdleBreathing()
  }

  private startIdleBreathing(): void {
    if (!this.visual) return
    const s = this.stateMachine.value
    if (s === 'dragging' || s === 'sleeping') return

    this.idleTween = this.scene.tweens.add({
      targets: this.visual,
      scaleY: 1.018,
      duration: 1400,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    })
  }

  private stopIdleBreathing(): void {
    this.idleTween?.stop()
    this.idleTween = undefined
    if (this.visual) this.visual.scaleY = 1
  }
}
