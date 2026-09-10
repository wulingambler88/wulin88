import Phaser from 'phaser'
import { BootScene } from '../scenes/BootScene'
import { PreloadScene } from '../scenes/PreloadScene'
import { TownScene } from '../scenes/TownScene'
import { HomeScene } from '../scenes/HomeScene'
import { ClothingShopScene } from '../scenes/ClothingShopScene'
import { SupermarketScene } from '../scenes/SupermarketScene'
import { PetShopScene } from '../scenes/PetShopScene'
import { ParkScene } from '../scenes/ParkScene'
import { CafeScene } from '../scenes/CafeScene'
import { SalonScene } from '../scenes/SalonScene'
import { ToyShopScene } from '../scenes/ToyShopScene'
import { SchoolScene } from '../scenes/SchoolScene'

export const GAME_WIDTH = 960
export const GAME_HEIGHT = 540

// Render the canvas backing store at the device's native pixel ratio so
// characters and world art stay crisp on high-DPI screens. The logical game
// size remains GAME_WIDTH×GAME_HEIGHT; only the backing store is enlarged.
// Capped to avoid excessive canvas sizes on 3x+ devices.
export function displayZoom(): number {
  return Math.min(window.devicePixelRatio || 1, 2.5)
}

export function gameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    zoom: displayZoom(),
    backgroundColor: '#bdeaf5',
    scene: [
      BootScene,
      PreloadScene,
      TownScene,
      HomeScene,
      ClothingShopScene,
      SupermarketScene,
      PetShopScene,
      ParkScene,
      CafeScene,
      SalonScene,
      ToyShopScene,
      SchoolScene,
    ],
    input: { activePointers: 3 },
    render: { antialias: true, pixelArt: false },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
  }
}
