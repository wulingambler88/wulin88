import type Phaser from 'phaser'
import type { LocationId } from '../data/locations'
import {
  generateDailyHunt,
  getMysteryById,
  type TreasureClueStep,
  type TreasureMystery,
} from '../data/treasureHunt'
import { playerState } from '../state/PlayerState'
import { audioManager } from '../audio/AudioManager'
import { showToast } from '../ui/UIManager'

const MYSTERY_MAP: Record<number, string> = {
  1: 'mystery_golden_whisker',
  2: 'mystery_starlight_tiara',
  3: 'mystery_pirate_stash',
}

const REVERSE_MAP: Record<string, number> = {
  mystery_golden_whisker: 1,
  mystery_starlight_tiara: 2,
  mystery_pirate_stash: 3,
}

export class TreasureManager {
  startMystery(mysteryId: string): TreasureMystery | null {
    let index = REVERSE_MAP[mysteryId]
    let mystery: TreasureMystery | undefined

    if (mysteryId.startsWith('daily_hunt_')) {
      const seed = parseInt(mysteryId.replace('daily_hunt_', ''), 10) || 1
      index = 100 + seed
      mystery = generateDailyHunt(seed)
    } else {
      mystery = getMysteryById(mysteryId)
    }

    if (!mystery || index === undefined) return null

    const stats = playerState.data.minigames
    stats.activeMystery = index
    stats.clueStep = 0
    playerState.save()
    audioManager.play('button')
    showToast(`📜 Accepted Case: ${mystery.title}!`)
    return mystery
  }

  getActiveMystery(): TreasureMystery | null {
    const stats = playerState.data.minigames
    const idx = stats.activeMystery
    if (typeof idx !== 'number' || idx <= 0) return null

    if (idx >= 100) {
      return generateDailyHunt(idx - 100)
    }

    const id = MYSTERY_MAP[idx]
    return id ? getMysteryById(id) ?? null : null
  }

  getCurrentClue(): TreasureClueStep | null {
    const mystery = this.getActiveMystery()
    if (!mystery) return null
    const stats = playerState.data.minigames
    const stepIdx = stats.clueStep ?? 0
    return mystery.steps[stepIdx] ?? null
  }

  isMysterySolved(mysteryId: string): boolean {
    const stats = playerState.data.minigames
    return Boolean(stats[`solved_${mysteryId}`])
  }

  getCasesSolvedCount(): number {
    const stats = playerState.data.minigames
    return stats.mysteriesCompleted ?? 0
  }

  spawnClueIfPresent(scene: Phaser.Scene, currentLocation: LocationId): Phaser.GameObjects.Container | null {
    const mystery = this.getActiveMystery()
    if (!mystery) return null

    const clue = this.getCurrentClue()
    if (!clue || clue.location !== currentLocation) return null

    const isFinalChest = clue.stepIndex === mystery.steps.length - 1

    const container = scene.add.container(clue.x, clue.y)
    container.setDepth(25)

    const glow = scene.add.circle(0, 0, 32, isFinalChest ? 0xffd166 : 0x79c7ec, 0.45)
    scene.tweens.add({
      targets: glow,
      scaleX: 1.35,
      scaleY: 1.35,
      alpha: 0.15,
      duration: 800,
      yoyo: true,
      repeat: -1,
    })

    const bg = scene.add.circle(0, 0, 24, 0xffffff, 0.95)
    bg.setStrokeStyle(3, isFinalChest ? 0xff9f1c : 0x3a86ff)

    const icon = scene.add.text(0, 0, clue.propIcon, {
      fontSize: isFinalChest ? '24px' : '20px',
    }).setOrigin(0.5)

    const labelBg = scene.add.graphics()
    labelBg.fillStyle(0x332233, 0.8).fillRoundedRect(-50, 28, 100, 20, 6)
    const label = scene.add.text(0, 38, clue.propName, {
      fontSize: '10px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    container.add([glow, bg, icon, labelBg, label])

    // Gentle float bob animation
    scene.tweens.add({
      targets: container,
      y: clue.y - 8,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Interactive click
    bg.setInteractive({ useHandCursor: true })
    bg.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation()
      this.handleClueFound(scene, container, mystery, clue, isFinalChest)
    })

    return container
  }

  private handleClueFound(
    scene: Phaser.Scene,
    container: Phaser.GameObjects.Container,
    mystery: TreasureMystery,
    clue: TreasureClueStep,
    isFinalChest: boolean,
  ): void {
    const stats = playerState.data.minigames

    // Happy speech bubble
    // Happy speech bubble
    const bubble = scene.add.container(container.x, container.y - 45)
    const label = scene.add.text(0, 0, `${clue.propIcon}  Found ${clue.propName}! ✨`, {
      fontFamily: 'Trebuchet MS',
      fontSize: '15px',
      color: '#754c72',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    const bounds = label.getBounds()
    const bG = scene.add.graphics()
      .fillStyle(0xfff8e9, 0.98)
      .fillRoundedRect(-bounds.width / 2 - 12, -bounds.height / 2 - 8, bounds.width + 24, bounds.height + 16, 12)
      .lineStyle(3, 0xffffff)
      .strokeRoundedRect(-bounds.width / 2 - 12, -bounds.height / 2 - 8, bounds.width + 24, bounds.height + 16, 12)
    bubble.add([bG, label]).setDepth(4900)
    scene.tweens.add({ targets: bubble, y: bubble.y - 12, alpha: 0, delay: 1800, duration: 300, onComplete: () => bubble.destroy() })

    if (isFinalChest) {
      audioManager.play('purchase')

      // Grant rewards
      const reward = mystery.reward
      playerState.currency.add(reward.starCoins)

      // Unlock clothes into wardrobe
      reward.clothingIds.forEach((clothId) => {
        if (!playerState.data.ownedClothing.includes(clothId)) {
          playerState.data.ownedClothing.push(clothId)
        }
      })

      // Mark solved
      stats[`solved_${mystery.id}`] = 1
      stats.mysteriesCompleted = (stats.mysteriesCompleted ?? 0) + 1
      stats.activeMystery = 0
      stats.clueStep = 0
      playerState.save()

      showToast(`🎉 Solved ${mystery.title}! +${reward.starCoins} ⭐!`)
    } else {
      audioManager.play('chime')
      stats.clueStep = (stats.clueStep ?? 0) + 1
      playerState.save()
      showToast(`🔍 Clue ${clue.stepIndex + 1}/${mystery.steps.length} Found! Check your Journal!`)
    }

    // Shrink & vanish animation
    scene.tweens.add({
      targets: container,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 280,
      ease: 'Back.easeIn',
      onComplete: () => {
        container.destroy()
      },
    })
  }
}

export const treasureManager = new TreasureManager()
