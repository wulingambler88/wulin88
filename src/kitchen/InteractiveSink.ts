import Phaser from 'phaser'
import { audioManager } from '../audio/AudioManager'
import { showToast } from '../ui/UIManager'

export class InteractiveSink extends Phaser.GameObjects.Container {
  private isRunning = false
  private waterStream?: Phaser.GameObjects.Graphics
  private waterTimer?: Phaser.Time.TimerEvent

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    scene.add.existing(this)
    this.setDepth(210)

    this.createSink()
  }

  isWaterRunning(): boolean {
    return this.isRunning
  }

  isOverSink(x: number, y: number): boolean {
    return Math.abs(x - this.x) <= 45 && Math.abs(y - this.y) <= 30
  }

  washItem(itemName: string): void {
    audioManager.play('water')
    showToast(`Washed ${itemName}! Sparkling clean! ✨`)
    // Sparkle particles
    const sparkle = this.scene.add.text(this.x, this.y - 15, '✨', { fontSize: '20px' }).setOrigin(0.5).setDepth(2500)
    this.scene.tweens.add({
      targets: sparkle,
      y: this.y - 45,
      alpha: 0,
      duration: 800,
      ease: 'Sine.easeOut',
      onComplete: () => sparkle.destroy(),
    })
  }

  private createSink(): void {
    const OUTLINE = 0x663d63

    // 1. Porcelain Basin (White ceramic apron-front sink)
    const basin = this.scene.add.graphics()
    // Outer white porcelain rim
    basin.fillStyle(0xffffff).fillRoundedRect(-44, -2, 88, 28, 8)
    basin.lineStyle(2.5, OUTLINE).strokeRoundedRect(-44, -2, 88, 28, 8)

    // Inner porcelain bowl cavity
    basin.fillStyle(0xe4eef4).fillRoundedRect(-38, 2, 76, 20, 6)
    basin.lineStyle(1.5, OUTLINE, 0.4).strokeRoundedRect(-38, 2, 76, 20, 6)

    // Gentle pool reflection
    basin.fillStyle(0xcce8f0, 0.65).fillRoundedRect(-35, 5, 70, 15, 5)

    // Polished stainless strainer drain at (0, 13)
    basin.fillStyle(0x9cb1bc).fillCircle(0, 13, 6)
    basin.lineStyle(1.2, OUTLINE).strokeCircle(0, 13, 6)
    basin.fillStyle(0x3d3546).fillCircle(0, 13, 3.5)
    // Strainer micro-perforations
    basin.fillStyle(0xddebf2)
      .fillCircle(-1.5, 11.5, 0.8)
      .fillCircle(1.5, 11.5, 0.8)
      .fillCircle(0, 14.5, 0.8)

    // 2. Vintage Brass Gooseneck Bridge Faucet
    const faucet = this.scene.add.graphics()
    // Faucet bridge deck base
    faucet.fillStyle(0xd4a359).fillRoundedRect(-24, -9, 48, 6, 2.5)
    faucet.lineStyle(1.5, OUTLINE).strokeRoundedRect(-24, -9, 48, 6, 2.5)
    faucet.fillStyle(0xffe89e).fillRect(-22, -8, 44, 2)

    // Central mounting collar
    faucet.fillStyle(0xb5843a).fillRoundedRect(-14, -13, 10, 6, 2)
    faucet.lineStyle(1.5, OUTLINE).strokeRoundedRect(-14, -13, 10, 6, 2)

    // Curved swan-neck spout pipe (arching from -9, -12 up to -4, -28 and down to 0, -10)
    faucet.lineStyle(5.5, OUTLINE).beginPath()
    faucet.moveTo(-9, -12).lineTo(-9, -24).arc(-4, -24, 5, Math.PI, 0, false).lineTo(1, -12).strokePath()

    faucet.lineStyle(3.5, 0xd4a359).beginPath()
    faucet.moveTo(-9, -12).lineTo(-9, -24).arc(-4, -24, 5, Math.PI, 0, false).lineTo(1, -12).strokePath()

    // Brass highlight gleam
    faucet.lineStyle(1.5, 0xfff0b8, 0.9).beginPath()
    faucet.moveTo(-9.5, -14).lineTo(-9.5, -23).arc(-4, -24, 4, Math.PI * 0.9, 0, false).strokePath()

    // Spout aerator nozzle
    faucet.fillStyle(0xb5843a).fillRect(-1.5, -12, 5, 4)
    faucet.lineStyle(1.5, OUTLINE).strokeRect(-1.5, -12, 5, 4)

    // 3. Victorian Cross Handles (Hot & Cold)
    // Left handle (Cold) at x = -19, y = -11
    faucet.fillStyle(0xd4a359).fillRect(-21, -13, 4, 6)
    faucet.fillStyle(0xffffff).fillRoundedRect(-24, -16, 10, 4, 1.5).fillRoundedRect(-21, -19, 4, 10, 1.5)
    faucet.lineStyle(1.2, OUTLINE).strokeRoundedRect(-24, -16, 10, 4, 1.5).strokeRoundedRect(-21, -19, 4, 10, 1.5)
    faucet.fillStyle(0x3a86ff).fillCircle(-19, -14, 1.5) // Blue Cold dot

    // Right handle (Hot) at x = 15, y = -11
    faucet.fillStyle(0xd4a359).fillRect(13, -13, 4, 6)
    faucet.fillStyle(0xffffff).fillRoundedRect(10, -16, 10, 4, 1.5).fillRoundedRect(13, -19, 4, 10, 1.5)
    faucet.lineStyle(1.2, OUTLINE).strokeRoundedRect(10, -16, 10, 4, 1.5).strokeRoundedRect(13, -19, 4, 10, 1.5)
    faucet.fillStyle(0xf94144).fillCircle(15, -14, 1.5) // Red Hot dot

    this.add([basin, faucet])
    this.setSize(90, 60).setInteractive({ useHandCursor: true })

    this.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event.stopPropagation()
      this.toggleFaucet()
    })
  }

  toggleFaucet(): void {
    this.isRunning = !this.isRunning
    audioManager.play(this.isRunning ? 'water' : 'switch')

    if (this.isRunning) {
      showToast('Running water! Wash hands or fresh veggies! 🚰')
      this.startWaterStream()
    } else {
      showToast('Faucet turned off')
      this.stopWaterStream()
    }
  }

  private startWaterStream(): void {
    this.stopWaterStream()
    const g = this.scene.add.graphics()
    this.waterStream = g
    this.add(g)

    let frame = 0
    this.waterTimer = this.scene.time.addEvent({
      delay: 70,
      loop: true,
      callback: () => {
        if (!this.waterStream) return
        frame = (frame + 1) % 4
        this.waterStream.clear()

        // Water jet falling from spout at (-1, -10) to basin (0, 12)
        this.waterStream.fillStyle(0xd6f4fc, 0.85).fillRoundedRect(-2.5, -10, 5, 22, 2)
        this.waterStream.fillStyle(0xffffff, 0.9).fillRect(-1, -10, 2, 22)

        // Ripple wave in basin
        const rSize = 12 + frame * 4
        this.waterStream.lineStyle(1.5, 0xffffff, 0.7 - frame * 0.15).strokeEllipse(0, 12, rSize, rSize * 0.35)

        // Splash drops
        this.waterStream.fillStyle(0xbee8f7).fillCircle(-8 + frame * 3, 6 - (frame % 2) * 5, 2)
        this.waterStream.fillStyle(0xbee8f7).fillCircle(7 - frame * 2, 8 - ((frame + 1) % 2) * 4, 1.8)
      },
    })
  }

  private stopWaterStream(): void {
    this.waterTimer?.remove(false)
    this.waterTimer = undefined
    this.waterStream?.destroy()
    this.waterStream = undefined
  }
}

