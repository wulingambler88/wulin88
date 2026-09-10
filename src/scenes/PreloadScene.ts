import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../game/config'

export class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene') }

  preload(): void {
    // Audit fix #9: loading progress bar
    const cx = GAME_WIDTH / 2
    const cy = GAME_HEIGHT / 2
    const barW = 260
    const barH = 18

    const bgBar = this.add.graphics()
    bgBar.fillStyle(0xffffff, 0.5).fillRoundedRect(cx - barW / 2, cy + 30, barW, barH, 9)
    bgBar.lineStyle(2, 0x754c72, 0.4).strokeRoundedRect(cx - barW / 2, cy + 30, barW, barH, 9)

    const fillBar = this.add.graphics()

    const loadingText = this.add.text(cx, cy + 60, 'Loading…', {
      fontFamily: 'Nunito, Trebuchet MS, sans-serif',
      fontSize: '14px',
      color: '#754c72',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.load.on('progress', (value: number) => {
      fillBar.clear()
      fillBar.fillStyle(0xff8fc4, 1).fillRoundedRect(cx - barW / 2 + 3, cy + 33, (barW - 6) * value, barH - 6, 6)
    })

    this.load.on('complete', () => {
      bgBar.destroy()
      fillBar.destroy()
      loadingText.destroy()
    })

    this.load.image('world-terrain', 'art/world/terrain-v1.webp')
    this.load.image('world-buildings', 'art/world/buildings-v1.webp')
    this.load.image('world-furniture', 'art/world/furniture-v1.webp')
    this.load.image('world-rooms', 'art/world/rooms-v1.webp')
    this.load.image('hero-standing', 'art/characters/hero-standing.webp')
    this.load.image('hero-sitting', 'art/characters/hero-sitting.webp')
    this.load.image('hero-happy', 'art/characters/hero-happy.webp')
    this.load.image('hero-qianhui-v2', 'art/characters/hero-qianhui-v2.webp')
    this.load.image('mimi-kitten', 'art/characters/mimi-kitten.webp')
    this.load.image('resident-school', 'art/characters/resident-school.webp')
    this.load.image('resident-boutique', 'art/characters/resident-boutique.webp')
    this.load.image('resident-market', 'art/characters/resident-market.webp')
    this.load.image('resident-salon', 'art/characters/resident-salon.webp')
    this.load.image('resident-toyshop', 'art/characters/resident-toyshop.webp')
    this.load.image('resident-petshop', 'art/characters/resident-petshop.webp')
    this.load.image('resident-cafe', 'art/characters/resident-cafe.webp')
    this.load.image('boutique-rack', 'art/clothing/boutique-rack.webp')
  }

  create(): void {
    // BUG-17 fix: reference atlas design sizes. The frames below are authored in
    // this coordinate space and rescaled to the real texture size. In dev we warn
    // loudly if the shipped art's aspect ratio drifts from the reference layout,
    // instead of letting every frame silently misalign.
    const BUILDINGS_REF = 1254
    const FURNITURE_REF_W = 1448
    const FURNITURE_REF_H = 1086
    const atlas = this.textures.get('world-buildings')
    const source = atlas.getSourceImage() as HTMLImageElement
    if (import.meta.env.DEV && Math.abs(source.width / source.height - 1) > 0.02) {
      console.warn('[PreloadScene] world-buildings is not square; the hand-authored atlas frames may be misaligned.')
    }
    const buildings = [[0,0,424,437],[432,0,403,444],[838,0,416,440],
      [0,439,425,394],[431,446,402,383],[835,444,419,390],
      [0,833,426,421],[435,833,402,421],[839,835,415,419]]
    buildings.forEach(([x,y,w,h], frame) => atlas.add(frame, 0, Math.round(x * source.width / BUILDINGS_REF), Math.round(y * source.height / BUILDINGS_REF), Math.floor(w * source.width / BUILDINGS_REF), Math.floor(h * source.height / BUILDINGS_REF)))
    // Hand-registered atlas regions: generated sprites do not follow mathematically exact grids.
    const furniture = this.textures.get('world-furniture')
    const fs = furniture.getSourceImage() as HTMLImageElement
    if (import.meta.env.DEV && Math.abs(fs.width / fs.height - FURNITURE_REF_W / FURNITURE_REF_H) > 0.02) {
      console.warn('[PreloadScene] world-furniture aspect ratio differs from the reference atlas layout; frames may be misaligned.')
    }
    const bounds = [[0,0,380,390],[387,0,438,380],[833,0,272,379],[1135,0,310,380],
      [0,405,380,285],[380,405,335,285],[715,400,411,288],[1135,385,310,305],
      [0,691,409,390],[420,678,239,405],[680,690,359,395],[1040,680,407,405]]
    bounds.forEach(([x,y,w,h], frame) => furniture.add(frame, 0, Math.round(x * fs.width / FURNITURE_REF_W), Math.round(y * fs.height / FURNITURE_REF_H), Math.floor(w * fs.width / FURNITURE_REF_W), Math.floor(h * fs.height / FURNITURE_REF_H)))
    const rooms = this.textures.get('world-rooms')
    const rs = rooms.getSourceImage() as HTMLImageElement
    for (let room = 0; room < 3; room++) {
      const top = Math.round(rs.height * room / 3)
      const height = Math.floor(rs.height / 3)
      const wall = Math.round(height * .77)
      rooms.add(`wall-${room}`, 0, 0, top, rs.width, wall)
      rooms.add(`floor-${room}`, 0, 0, top + wall, rs.width, height - wall)
    }
    const cx = GAME_WIDTH / 2
    const cy = GAME_HEIGHT / 2
    this.add.circle(cx, cy - 20, 52, 0xff8fc4)
    this.add.star(cx, cy - 20, 5, 18, 40, 0xffffff)
    this.add.text(cx, cy + 62, 'Qian Hui Avatar City', { fontFamily: 'Trebuchet MS', fontSize: '28px', color: '#754c72', fontStyle: 'bold' }).setOrigin(0.5)
    this.time.delayedCall(220, () => this.scene.start('TownScene'))
  }
}
