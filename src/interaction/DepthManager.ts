import Phaser from 'phaser'

export function sortByWorldY(objects: readonly Phaser.GameObjects.GameObject[]): void {
  for (const object of objects) {
    if ('y' in object && 'setDepth' in object && typeof object.y === 'number' && typeof object.setDepth === 'function') object.setDepth(100 + Math.round(object.y))
  }
}
