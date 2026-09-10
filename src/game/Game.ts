import Phaser from 'phaser'
import { gameConfig, displayZoom } from './config'

export function createGame(parent: string): Phaser.Game {
  const game = new Phaser.Game(gameConfig(parent))

  // Keep the canvas crisp when the window is moved between monitors with
  // different device pixel ratios: re-sync the renderer zoom on resize.
  window.addEventListener('resize', () => {
    const zoom = displayZoom()
    if (Math.abs(game.scale.zoom - zoom) > 0.001) game.scale.setZoom(zoom)
  })

  return game
}
