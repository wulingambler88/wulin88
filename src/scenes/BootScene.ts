import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene') }

  create(): void {
    this.cameras.main.setBackgroundColor('#fff4fa')
    this.scene.start('PreloadScene')
  }
}
