import Phaser from 'phaser'
import { audioManager } from '../audio/AudioManager'
import { showToast } from '../ui/UIManager'

export type TimeOfDay = 'day' | 'sunset' | 'night'

const TINTS: Record<TimeOfDay, { color: number; alpha: number }> = {
  day: { color: 0xffffff, alpha: 0 },
  sunset: { color: 0xff8c42, alpha: 0.16 },
  night: { color: 0x1a153b, alpha: 0.44 },
}

export class DayNightManager {
  private readonly scene: Phaser.Scene
  private currentTime: TimeOfDay = 'day'
  private ambientOverlay: Phaser.GameObjects.Rectangle
  private nightStars: Phaser.GameObjects.Text[] = []

  constructor(scene: Phaser.Scene, initialTime: TimeOfDay = 'day') {
    this.scene = scene
    this.currentTime = initialTime

    // Fullscreen viewport overlay (scrollFactor 0, depth 4850)
    this.ambientOverlay = this.scene.add.rectangle(480, 270, 960, 540, 0x000000, 0)
      .setScrollFactor(0)
      .setDepth(4850)

    this.applyTime(this.currentTime, false)
  }

  getTime(): TimeOfDay {
    return this.currentTime
  }

  cycle(): TimeOfDay {
    const next: Record<TimeOfDay, TimeOfDay> = {
      day: 'sunset',
      sunset: 'night',
      night: 'day',
    }
    this.setTime(next[this.currentTime])
    return this.currentTime
  }

  setTime(time: TimeOfDay, animate = true): void {
    this.currentTime = time
    this.applyTime(time, animate)

    audioManager.play('chime')
    if (time === 'day') showToast('☀️ Bright Sunny Morning!')
    else if (time === 'sunset') showToast('🌇 Golden Cozy Sunset!')
    else showToast('🌙 Peaceful Starry Night!')
  }

  private applyTime(time: TimeOfDay, animate = true): void {
    const config = TINTS[time]
    this.ambientOverlay.setFillStyle(config.color, config.alpha)

    if (animate) {
      this.ambientOverlay.setAlpha(0)
      this.scene.tweens.add({
        targets: this.ambientOverlay,
        alpha: config.alpha,
        duration: 500,
        ease: 'Linear',
      })
    }

    // Toggle stars
    if (time === 'night') {
      this.spawnStars()
    } else {
      this.clearStars()
    }
  }

  private spawnStars(): void {
    this.clearStars()
    const starPositions = [
      { x: 120, y: 55 },
      { x: 260, y: 40 },
      { x: 420, y: 65 },
      { x: 590, y: 45 },
      { x: 740, y: 70 },
      { x: 880, y: 50 },
    ]

    for (const pos of starPositions) {
      const star = this.scene.add.text(pos.x, pos.y, '✦', {
        fontSize: '18px',
        color: '#fff4b8',
      }).setScrollFactor(0).setDepth(4855)

      this.scene.tweens.add({
        targets: star,
        alpha: 0.3,
        duration: 600 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
      })
      this.nightStars.push(star)
    }
  }

  private clearStars(): void {
    for (const star of this.nightStars) {
      star.destroy()
    }
    this.nightStars = []
  }
}
