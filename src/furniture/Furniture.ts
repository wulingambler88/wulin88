import Phaser from 'phaser'
import type { FurnitureAnchor, FurnitureDefinition } from '../data/furniture'

export class Furniture extends Phaser.GameObjects.Container {
  readonly definition: FurnitureDefinition
  readonly instanceId: string
  isOn = false
  channelIndex = 0 // 0: off, 1: Kitty, 2: Rainbow, 3: Space
  private visualGraphics?: Phaser.GameObjects.Graphics
  private tvScreenText?: Phaser.GameObjects.Text
  private lightGlow?: Phaser.GameObjects.Graphics
  private selection?: Phaser.GameObjects.Graphics
  private illustrated?: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, instanceId: string, definition: FurnitureDefinition, x = definition.x, y = definition.y, rotation = 0) {
    super(scene, x, y)
    this.definition = definition
    this.instanceId = instanceId
    this.rotation = rotation
    scene.add.existing(this)
    this.setSize(definition.width, definition.height)
    this.setInteractive({ useHandCursor: true })
    this.draw()
  }

  setSelected(selected: boolean): void { this.selection?.setVisible(selected) }

  worldAnchors(): Array<FurnitureAnchor & { x: number; y: number; furnitureId: string }> {
    const anchors = [...this.definition.anchors]
    if (this.definition.type === 'bed' && !anchors.some((a) => a.id === 'sit')) {
      // Add sitting anchor at foot of bed
      anchors.push({ id: 'sit', x: 60, y: -15, state: 'sitting' })
    }
    return anchors.map((anchor) => ({ ...anchor, x: this.x + anchor.x, y: this.y + anchor.y, furnitureId: this.instanceId }))
  }

  interact(): 'toggled' | 'cycled' | 'wobbled' | 'none' {
    const { type } = this.definition
    if (type === 'lamp') {
      this.isOn = !this.isOn
      this.draw()
      return 'toggled'
    } else if (type === 'tv') {
      this.channelIndex = (this.channelIndex + 1) % 4
      this.isOn = this.channelIndex > 0
      this.draw()
      return 'cycled'
    } else if (type === 'plant') {
      this.scene.tweens.add({
        targets: this,
        angle: { from: -8, to: 8 },
        duration: 90,
        yoyo: true,
        repeat: 2,
        ease: 'Sine.easeInOut',
        onComplete: () => { this.setAngle(0) },
      })
      return 'wobbled'
    } else if (type === 'bed') {
      this.scene.tweens.add({
        targets: this,
        scaleY: 1.05,
        duration: 100,
        yoyo: true,
        ease: 'Quad.Out',
      })
      return 'wobbled'
    }
    return 'none'
  }

  private draw(): void {
    this.illustrated?.destroy()
    this.visualGraphics?.destroy()
    this.tvScreenText?.destroy()
    this.lightGlow?.destroy()
    this.selection?.destroy()

    const { width: w, height: h, color, type } = this.definition
    const g = this.scene.add.graphics()
    this.visualGraphics = g
    this.add(g)
    const OUTLINE = 0x663d63
    const OUTLINE_W = 2.2

    // Contact drop shadow
    g.fillStyle(OUTLINE, 0.16).fillEllipse(0, h * 0.44, w * 0.92, Math.max(18, h * 0.18))
    g.lineStyle(OUTLINE_W, OUTLINE)

    if (type === 'rug') {
      // Scalloped pastel oval rug matching art target
      g.fillStyle(color).fillEllipse(0, 0, w, h).strokeEllipse(0, 0, w, h)
      g.lineStyle(2, 0xffffff, 0.85).strokeEllipse(0, 0, w * 0.86, h * 0.76)
      // Inner dashed accent ring
      g.fillStyle(0xffffff, 0.2).fillEllipse(0, 0, w * 0.68, h * 0.55)
    } else if (type === 'bed') {
      // Headboard (Warm Wood / Peach)
      g.fillStyle(0xffd4b8).fillRoundedRect(-w / 2, -h / 2, w, h * 0.55, 18).strokeRoundedRect(-w / 2, -h / 2, w, h * 0.55, 18)
      // Mattress Base
      g.fillStyle(0xffffff).fillRoundedRect(-w / 2 + 6, -h * 0.15, w - 12, h * 0.6, 16).strokeRoundedRect(-w / 2 + 6, -h * 0.15, w - 12, h * 0.6, 16)
      // Cloud Pillow
      g.fillStyle(0xffffff).fillRoundedRect(-w * 0.42, -h * 0.25, w * 0.38, h * 0.32, 12).strokeRoundedRect(-w * 0.42, -h * 0.25, w * 0.38, h * 0.32, 12)
      g.fillStyle(0xf0e6f5).fillEllipse(-w * 0.23, -h * 0.09, 12, 6)
      // Quilted Snuggle Blanket (Pastel Pink / Blue)
      g.fillStyle(color).fillRoundedRect(-w * 0.46, h * 0.02, w * 0.92, h * 0.42, 16).strokeRoundedRect(-w * 0.46, h * 0.02, w * 0.92, h * 0.42, 16)
      // White folded sheet turn-down
      g.fillStyle(0xffffff).fillRoundedRect(-w * 0.46, h * 0.02, w * 0.92, 14, 6).strokeRoundedRect(-w * 0.46, h * 0.02, w * 0.92, 14, 6)
      // Embroidered Heart
      g.fillStyle(0xffffff).fillCircle(-10, h * 0.24, 7).fillCircle(10, h * 0.24, 7).fillTriangle(-17, h * 0.24, 17, h * 0.24, 0, h * 0.36)
      g.fillStyle(0xff7ab8).fillCircle(-6, h * 0.23, 4).fillCircle(6, h * 0.23, 4).fillTriangle(-10, h * 0.23, 10, h * 0.23, 0, h * 0.32)
    } else if (type === 'chair' || type === 'sofa') {
      // Rounded Soft Candy Sofa Backrest
      g.fillStyle(color).fillRoundedRect(-w / 2, -h / 2, w, h * 0.72, 22).strokeRoundedRect(-w / 2, -h / 2, w, h * 0.72, 22)
      // Tufted cushion division line
      g.lineStyle(2, 0xffffff, 0.6).lineBetween(0, -h * 0.42, 0, h * 0.1)
      g.lineStyle(OUTLINE_W, OUTLINE)
      // Plump Seat Cushion
      g.fillStyle(0xffffff, 0.4).fillRoundedRect(-w * 0.44, 0, w * 0.88, h * 0.36, 14)
      g.fillStyle(color).fillRoundedRect(-w * 0.44, h * 0.04, w * 0.88, h * 0.32, 14).strokeRoundedRect(-w * 0.44, h * 0.04, w * 0.88, h * 0.32, 14)
      // Rounded Sofa Armrests
      g.fillStyle(color).fillRoundedRect(-w / 2 - 4, -h * 0.15, 24, h * 0.52, 12).strokeRoundedRect(-w / 2 - 4, -h * 0.15, 24, h * 0.52, 12)
      g.fillStyle(color).fillRoundedRect(w / 2 - 20, -h * 0.15, 24, h * 0.52, 12).strokeRoundedRect(w / 2 - 20, -h * 0.15, 24, h * 0.52, 12)
    } else if (type === 'wardrobe' || type === 'bookshelf') {
      // Wardrobe Cabinet with decorative crest
      g.fillStyle(color).fillRoundedRect(-w / 2, -h / 2, w, h, 18).strokeRoundedRect(-w / 2, -h / 2, w, h, 18)
      // Top decorative scalloped crest
      g.fillStyle(0xffffff).fillRoundedRect(-w * 0.35, -h / 2 - 12, w * 0.7, 16, 8).strokeRoundedRect(-w * 0.35, -h / 2 - 12, w * 0.7, 16, 8)
      // Double door panels with recessed frames
      g.fillStyle(0xfff5ea).fillRoundedRect(-w * 0.44, -h * 0.42, w * 0.4, h * 0.84, 10).strokeRoundedRect(-w * 0.44, -h * 0.42, w * 0.4, h * 0.84, 10)
      g.fillStyle(0xfff5ea).fillRoundedRect(w * 0.04, -h * 0.42, w * 0.4, h * 0.84, 10).strokeRoundedRect(w * 0.04, -h * 0.42, w * 0.4, h * 0.84, 10)
      // Golden round door knobs
      g.fillStyle(0xffd700).fillCircle(-w * 0.08, 0, 4.5).strokeCircle(-w * 0.08, 0, 4.5)
      g.fillStyle(0xffd700).fillCircle(w * 0.08, 0, 4.5).strokeCircle(w * 0.08, 0, 4.5)
    } else if (type === 'lamp') {
      // Storybook Spindle Floor Lamp
      const lampColor = this.isOn ? 0xfff6b8 : 0xfbf6ea
      // Layered Turned-Wood Spindle Base
      g.fillStyle(0x8a5438).fillRoundedRect(-w * 0.3, h * 0.34, w * 0.6, 15, 7).strokeRoundedRect(-w * 0.3, h * 0.34, w * 0.6, 15, 7)
      g.fillStyle(0xffd700).fillRoundedRect(-w * 0.18, h * 0.3, w * 0.36, 6, 3)
      g.fillStyle(0xa66a47).fillRoundedRect(-5, -h * 0.18, 10, h * 0.52, 4).strokeRoundedRect(-5, -h * 0.18, 10, h * 0.52, 4)
      // Spindle brass bead rings
      g.fillStyle(0xffd700).fillCircle(0, h * 0.14, 6).fillCircle(0, -h * 0.04, 5)

      // Bell-shaped pleated lampshade
      g.fillStyle(lampColor).fillRoundedRect(-w * 0.44, -h * 0.48, w * 0.88, h * 0.32, { tl: 14, tr: 14, bl: 20, br: 20 })
      g.lineStyle(OUTLINE_W, OUTLINE).strokeRoundedRect(-w * 0.44, -h * 0.48, w * 0.88, h * 0.32, { tl: 14, tr: 14, bl: 20, br: 20 })
      // Pleat line accents
      g.lineStyle(1.5, this.isOn ? 0xffea85 : 0xedd6be, 0.85)
      for (let px = -w * 0.32; px <= w * 0.32; px += 9) {
        g.lineBetween(px * 0.7, -h * 0.44, px, -h * 0.18)
      }
      g.lineStyle(OUTLINE_W, OUTLINE)

      // Scalloped lace frill droplets
      g.fillStyle(0xffffff)
      for (let bx = -w * 0.38; bx <= w * 0.38; bx += 8) {
        g.fillCircle(bx, -h * 0.16, 3.5)
      }

      // Golden pull-chain with star bead
      g.lineStyle(1.5, 0xd4a017).lineBetween(w * 0.3, -h * 0.16, w * 0.3, -h * 0.04)
      g.fillStyle(0xffd700).fillCircle(w * 0.3, -h * 0.04, 3.2)

      // Brass finial top
      g.fillStyle(0xffd700).fillCircle(0, -h * 0.51, 6).strokeCircle(0, -h * 0.51, 6)

      if (this.isOn) {
        const glow = this.scene.add.graphics()
        this.lightGlow = glow
        // Diffused warm floor cone
        glow.fillStyle(0xffea8a, 0.22).fillTriangle(0, -h * 0.18, -w * 1.9, h * 0.92, w * 1.9, h * 0.92)
        // Shade inner illumination
        glow.fillStyle(0xfffae6, 0.35).fillEllipse(0, -h * 0.32, w * 0.7, h * 0.2)
        this.addAt(glow, 0)
      }
    } else if (type === 'plant') {
      // Terracotta Fluted Pot
      g.fillStyle(0xffb088).fillRoundedRect(-w * 0.32, h * 0.06, w * 0.64, h * 0.4, 10).strokeRoundedRect(-w * 0.32, h * 0.06, w * 0.64, h * 0.4, 10)
      g.fillStyle(0xffcaa7).fillRoundedRect(-w * 0.36, h * 0.04, w * 0.72, 10, 5).strokeRoundedRect(-w * 0.36, h * 0.04, w * 0.72, 10, 5)
      // Lush Monstera Leaves with outlines
      g.fillStyle(0x7ed6a5)
        .fillCircle(-20, -h * 0.2, 28).strokeCircle(-20, -h * 0.2, 28)
        .fillCircle(20, -h * 0.22, 30).strokeCircle(20, -h * 0.22, 30)
        .fillCircle(0, -h * 0.42, 32).strokeCircle(0, -h * 0.42, 32)
      // Flower blossom accent
      g.fillStyle(0xff99bb).fillCircle(0, -h * 0.46, 8).strokeCircle(0, -h * 0.46, 8)
      g.fillStyle(0xffe680).fillCircle(0, -h * 0.46, 3.5)
    } else if (type === 'tv') {
      // Vintage Storybook Honey-Oak Television
      // Outer curved wooden cabinet
      g.fillStyle(0x8f5333).fillRoundedRect(-w / 2, -h / 2, w, h * 0.74, 20).strokeRoundedRect(-w / 2, -h / 2, w, h * 0.74, 20)
      g.fillStyle(0xb5734c).fillRoundedRect(-w / 2 + 3, -h / 2 + 3, w - 6, h * 0.74 - 6, 17)

      // Front ivory baffle
      g.fillStyle(0xfffaee).fillRoundedRect(-w * 0.46, -h * 0.44, w * 0.92, h * 0.62, 13).strokeRoundedRect(-w * 0.46, -h * 0.44, w * 0.92, h * 0.62, 13)

      // Rabbit-Ear Antennae with Golden Stars
      g.lineStyle(2.5, OUTLINE)
        .lineBetween(-12, -h / 2, -26, -h / 2 - 20)
        .lineBetween(12, -h / 2, 26, -h / 2 - 20)
      g.fillStyle(0xffd700).fillCircle(-26, -h / 2 - 20, 4.5).fillCircle(26, -h / 2 - 20, 4.5)

      // Curved CRT Screen on the Left
      const screenColors = [0x261f2e, 0xffedf6, 0xdef3fa, 0x1d193d]
      const screenColor = screenColors[this.channelIndex] ?? 0x261f2e
      g.fillStyle(screenColor).fillRoundedRect(-w * 0.42, -h * 0.4, w * 0.62, h * 0.54, 11).strokeRoundedRect(-w * 0.42, -h * 0.4, w * 0.62, h * 0.54, 11)

      // Right Side Control Panel
      // Rotary Tuner Dial (Channel)
      g.fillStyle(0xffd700).fillCircle(w * 0.31, -h * 0.24, 7).strokeCircle(w * 0.31, -h * 0.24, 7)
      g.fillStyle(0x8a5438).fillCircle(w * 0.31, -h * 0.24, 3)
      // Rotary Volume Dial
      g.fillStyle(0xffd700).fillCircle(w * 0.31, -h * 0.05, 6).strokeCircle(w * 0.31, -h * 0.05, 6)
      // Speaker grille vents
      g.lineStyle(1.8, 0xc2a082)
      g.lineBetween(w * 0.23, h * 0.08, w * 0.39, h * 0.08)
      g.lineBetween(w * 0.23, h * 0.13, w * 0.39, h * 0.13)
      g.lineStyle(OUTLINE_W, OUTLINE)

      // Mid-century Tapered Wooden Legs with Brass Tips
      g.fillStyle(0x733e24)
        .fillRoundedRect(-w * 0.34, h * 0.24, 11, h * 0.22, 4).strokeRoundedRect(-w * 0.34, h * 0.24, 11, h * 0.22, 4)
        .fillRoundedRect(w * 0.23, h * 0.24, 11, h * 0.22, 4).strokeRoundedRect(w * 0.23, h * 0.24, 11, h * 0.22, 4)
      g.fillStyle(0xffd700).fillRect(-w * 0.34, h * 0.4, 11, 6).fillRect(w * 0.23, h * 0.4, 11, 6)

      if (this.channelIndex > 0) {
        const channelScenes = [
          '',
          '🐱 Mimi Show 💖',
          '🌈 Rainbow Fun ☀️',
          '🚀 Star Quest 🌙'
        ]
        this.tvScreenText = this.scene.add.text(-w * 0.11, -h * 0.13, channelScenes[this.channelIndex]!, {
          fontSize: '13px',
          fontFamily: 'Trebuchet MS',
          fontStyle: 'bold',
          color: this.channelIndex === 3 ? '#ffe47a' : '#683a5e',
          align: 'center'
        }).setOrigin(0.5)
        this.add(this.tvScreenText)

        // Glass CRT glare reflection arc
        g.lineStyle(2, 0xffffff, 0.45).strokeRoundedRect(-w * 0.39, -h * 0.37, w * 0.56, h * 0.47, 8)
      } else {
        // Power indicator off
        g.fillStyle(0x423648).fillCircle(-w * 0.11, -h * 0.13, 8)
      }
    } else {
      // Dining / Coffee Table
      // Tabletop Surface (Warm rounded wood)
      g.fillStyle(color).fillRoundedRect(-w / 2, -h / 2, w, h * 0.36, 16).strokeRoundedRect(-w / 2, -h / 2, w, h * 0.36, 16)
      // Table Legs with clean outlines
      g.fillStyle(0xb58263)
        .fillRoundedRect(-w * 0.4, -h * 0.14, 16, h * 0.65, 6).strokeRoundedRect(-w * 0.4, -h * 0.14, 16, h * 0.65, 6)
        .fillRoundedRect(w * 0.3, -h * 0.14, 16, h * 0.65, 6).strokeRoundedRect(w * 0.3, -h * 0.14, 16, h * 0.65, 6)
      // Lace Placemat Runner
      g.fillStyle(0xffffff, 0.85).fillRoundedRect(-w * 0.36, -h * 0.48, w * 0.72, h * 0.26, 8).strokeRoundedRect(-w * 0.36, -h * 0.48, w * 0.72, h * 0.26, 8)
    }

    const frame = ({ bed: 0, sofa: 1, wardrobe: 2, bookshelf: 3, chair: 4, table: 5, rug: 6, plant: 7 } as Partial<Record<string, number>>)[type]
    if (frame !== undefined && this.scene.textures.exists('world-furniture')) {
      g.setVisible(false)
      this.illustrated = this.scene.add.image(0, 0, 'world-furniture', frame).setDisplaySize(w, h)
      this.add(this.illustrated)
    }
    this.selection = this.scene.add.graphics().lineStyle(4, 0xffd700, 0.95).strokeRoundedRect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12, 20).setVisible(false)
    this.add(this.selection)
  }
}
