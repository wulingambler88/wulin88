import Phaser from 'phaser'

export class SpeechBubble extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string, icon = '★', duration = 2200) {
    super(scene, Phaser.Math.Clamp(x, 100, 860), Phaser.Math.Clamp(y, 65, 470))
    const label = scene.add.text(0, 0, `${icon}  ${text}`, { fontFamily: 'Trebuchet MS', fontSize: '18px', color: '#754c72', fontStyle: 'bold', align: 'center', wordWrap: { width: 235 } }).setOrigin(.5)
    const bounds = label.getBounds()
    const background = scene.add.graphics().fillStyle(0xfff8e9, .98).lineStyle(4, 0xffffff).fillRoundedRect(-bounds.width / 2 - 18, -bounds.height / 2 - 12, bounds.width + 36, bounds.height + 24, 18).strokeRoundedRect(-bounds.width / 2 - 18, -bounds.height / 2 - 12, bounds.width + 36, bounds.height + 24, 18)
    this.add([background, label]).setDepth(4900).setAlpha(0)
    scene.add.existing(this)
    scene.tweens.add({ targets: this, alpha: 1, y: this.y - 8, duration: 180, ease: 'Back.Out' })
    scene.time.delayedCall(duration, () => scene.tweens.add({ targets: this, alpha: 0, y: this.y - 20, duration: 200, onComplete: () => this.destroy(true) }))
  }
}
