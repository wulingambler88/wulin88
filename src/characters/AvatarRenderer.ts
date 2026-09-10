import Phaser from 'phaser'
import { ClothingRegistry } from '../data/clothes'
import { ITEM_DEFINITIONS } from '../data/items'
import { PropRenderer } from '../items/PropRenderer'
import type { EquippedClothing } from './ClothingManager'
import type { CharacterStateName } from './CharacterState'
import type { AvatarCustomization } from '../save/SaveSchema'

export type CharacterExpression =
  | 'neutral'
  | 'happy'
  | 'excited'
  | 'surprised'
  | 'curious'
  | 'sleepy'
  | 'sad'
  | 'eating'
  | 'drinking'

export class AvatarRenderer {
  private readonly scene: Phaser.Scene

  constructor(scene: Phaser.Scene) { this.scene = scene }

  render(
    outfit: EquippedClothing,
    state: CharacterStateName,
    customization?: AvatarCustomization,
    heldItemId?: string,
    expression?: CharacterExpression
  ): Phaser.GameObjects.Container {
    const root = this.scene.add.container(0, 0)
    const g = this.scene.add.graphics()
    root.add(g)

    const sitting = state === 'sitting'
    const sleeping = state === 'sleeping'

    // Determine effective expression
    const expr: CharacterExpression =
      expression ??
      (sleeping
        ? 'sleepy'
        : state === 'eating'
        ? 'eating'
        : state === 'playing'
        ? 'excited'
        : 'neutral')

    const top = outfit.top ? ClothingRegistry.get(outfit.top) : undefined
    const bottom = outfit.bottom ? ClothingRegistry.get(outfit.bottom) : undefined
    const dress = outfit.dress ? ClothingRegistry.get(outfit.dress) : undefined
    const hat = outfit.hat ? ClothingRegistry.get(outfit.hat) : undefined
    const shoes = outfit.shoes ? ClothingRegistry.get(outfit.shoes) : undefined
    const accessory = outfit.accessory ? ClothingRegistry.get(outfit.accessory) : undefined

    const skinColor = customization?.skinColor ?? 0xffe5d6
    const hairColor = customization?.hairColor ?? 0xffd96f
    const hairStyle = customization?.hairStyle ?? 'long_waves'
    const eyeColor = customization?.eyeColor ?? 0x663d63
    const blushColor = customization?.blushColor ?? 0xff8fc4

    // Signature 2.5D Soft Plum Outline & Shadow
    // Audit fix #3: unified with NPCBase, Pet, Furniture, PropRenderer.
    const OUTLINE = 0x663d63
    const OUTLINE_LIGHT = 0x78504b
    const OUTLINE_W = 1.8

    // Contact Ground Shadow
    g.fillStyle(OUTLINE_LIGHT, 0.18).fillEllipse(0, sitting ? 66 : 82, sitting ? 90 : 75, 16)

    // 1. BACK HAIR LAYER (Behind Head & Body)
    g.lineStyle(OUTLINE_W, OUTLINE)
    if (hairStyle === 'long_waves') {
      // Flowing wavy hair with soft organic curve
      g.fillStyle(hairColor)
      g.fillRoundedRect(-48, -50, 96, 120, { tl: 30, tr: 30, bl: 24, br: 24 })
        .strokeRoundedRect(-48, -50, 96, 120, { tl: 30, tr: 30, bl: 24, br: 24 })
      g.fillStyle(hairColor)
        .fillCircle(-38, 54, 18).strokeCircle(-38, 54, 18)
        .fillCircle(38, 54, 18).strokeCircle(38, 54, 18)
      // Hair wave depth shading
      g.fillStyle(0x000000, 0.08).fillRoundedRect(-44, 12, 88, 52, 18)
    } else if (hairStyle === 'twin_buns') {
      // Big voluminous twin buns with outlines
      g.fillStyle(hairColor).fillCircle(-42, -70, 26).strokeCircle(-42, -70, 26)
      g.fillStyle(hairColor).fillCircle(42, -70, 26).strokeCircle(42, -70, 26)
      // Pink ribbon hair ties on buns
      g.fillStyle(0xff8fc4).fillCircle(-42, -48, 7).strokeCircle(-42, -48, 7)
      g.fillStyle(0xff8fc4).fillCircle(42, -48, 7).strokeCircle(42, -48, 7)
      // Bun highlight arcs
      g.lineStyle(2, 0xffffff, 0.55)
      g.beginPath().arc(-44, -74, 15, 3.6, 5.2).strokePath()
      g.beginPath().arc(40, -74, 15, 3.6, 5.2).strokePath()
      g.lineStyle(OUTLINE_W, OUTLINE)
    } else if (hairStyle === 'ponytail') {
      g.fillStyle(hairColor).fillCircle(44, -72, 28).strokeCircle(44, -72, 28)
      g.fillStyle(hairColor).fillEllipse(50, -46, 22, 44).strokeEllipse(50, -46, 22, 44)
      g.fillStyle(0xff8fc4).fillCircle(32, -58, 8).strokeCircle(32, -58, 8)
    } else if (hairStyle === 'bob') {
      g.fillStyle(hairColor).fillRoundedRect(-50, -60, 100, 100, 28).strokeRoundedRect(-50, -60, 100, 100, 28)
    } else if (hairStyle === 'pixie') {
      g.fillStyle(hairColor).fillCircle(0, -50, 48).strokeCircle(0, -50, 48)
    }

    const seatedOrSleeping = sitting || sleeping

    // 2. LEGS & FEET
    if (!seatedOrSleeping) {
      // Left leg
      g.fillStyle(skinColor).fillRoundedRect(-28, 48, 20, 36, 9).strokeRoundedRect(-28, 48, 20, 36, 9)
      // Right leg
      g.fillStyle(skinColor).fillRoundedRect(8, 48, 20, 36, 9).strokeRoundedRect(8, 48, 20, 36, 9)
    }

    // 3. SHOES & SOCKS
    const shoeColor = shoes?.color ?? 0xffa8d3
    if (seatedOrSleeping) {
      // White frill socks
      g.fillStyle(0xffffff).fillRoundedRect(-42, 60, 38, 12, 5).strokeRoundedRect(-42, 60, 38, 12, 5)
      g.fillStyle(0xffffff).fillRoundedRect(4, 60, 38, 12, 5).strokeRoundedRect(4, 60, 38, 12, 5)
      // Mary Jane shoes
      g.fillStyle(shoeColor).fillRoundedRect(-44, 66, 42, 15, 7).strokeRoundedRect(-44, 66, 42, 15, 7)
      g.fillStyle(shoeColor).fillRoundedRect(2, 66, 42, 15, 7).strokeRoundedRect(2, 66, 42, 15, 7)
      // Shoes strap & gold button
      g.fillStyle(0xffd700).fillCircle(-24, 73, 2.5).fillCircle(22, 73, 2.5)
    } else {
      // White frill socks
      g.fillStyle(0xffffff).fillRoundedRect(-30, 68, 24, 12, 5).strokeRoundedRect(-30, 68, 24, 12, 5)
      g.fillStyle(0xffffff).fillRoundedRect(6, 68, 24, 12, 5).strokeRoundedRect(6, 68, 24, 12, 5)
      // Mary Jane rounded shoes
      g.fillStyle(shoeColor).fillRoundedRect(-32, 74, 28, 17, 8).strokeRoundedRect(-32, 74, 28, 17, 8)
      g.fillStyle(shoeColor).fillRoundedRect(4, 74, 28, 17, 8).strokeRoundedRect(4, 74, 28, 17, 8)
      // Shoes strap & gold button
      g.fillStyle(0xffd700).fillCircle(-18, 82, 2.5).fillCircle(18, 82, 2.5)
    }

    // 4. BODY & UNDERGARMENT BLOUSE
    g.fillStyle(0xffffff)
      .fillRoundedRect(-28, 4, 56, 48, { tl: 14, tr: 14, bl: 10, br: 10 })
      .strokeRoundedRect(-28, 4, 56, 48, { tl: 14, tr: 14, bl: 10, br: 10 })

    // Puffy sleeves
    g.fillStyle(0xffffff).fillCircle(-28, 12, 9).strokeCircle(-28, 12, 9)
    g.fillStyle(0xffffff).fillCircle(28, 12, 9).strokeCircle(28, 12, 9)

    // 5. BOTTOMS (if separates)
    if (!dress) {
      const bottomColor = bottom?.color ?? 0x89cde3
      if (seatedOrSleeping) {
        g.fillStyle(bottomColor).fillRoundedRect(-34, 48, 32, 22, 10).strokeRoundedRect(-34, 48, 32, 22, 10)
        g.fillStyle(bottomColor).fillRoundedRect(2, 48, 32, 22, 10).strokeRoundedRect(2, 48, 32, 22, 10)
      } else {
        g.fillStyle(bottomColor).fillRoundedRect(-30, 46, 26, 28, 10).strokeRoundedRect(-30, 46, 26, 28, 10)
        g.fillStyle(bottomColor).fillRoundedRect(4, 46, 26, 28, 10).strokeRoundedRect(4, 46, 28, 28, 10)
      }
    }

    // 6. TOP / DRESS MAIN LAYER
    const bodyColor = dress?.color ?? top?.color ?? 0xbee8f5
    if (dress) {
      const skirtBottomY = seatedOrSleeping ? 64 : 70
      g.fillStyle(bodyColor)
        .fillRoundedRect(-36, 10, 72, skirtBottomY - 10, { tl: 12, tr: 12, bl: 22, br: 22 })
        .strokeRoundedRect(-36, 10, 72, skirtBottomY - 10, { tl: 12, tr: 12, bl: 22, br: 22 })

      // Scalloped Ruffled Hem
      g.fillStyle(0xffffff)
      for (let rx = -36; rx <= 36; rx += 12) {
        g.fillCircle(rx, skirtBottomY + 1, 4.5)
      }

      // Signature Pinafore or Boutique Details
      if (dress.id === 'dress_bunny_pinafore' || dress.id === 'dress_blue_daisy') {
        const pinaforeColor = dress.id === 'dress_blue_daisy' ? 0x7eb2df : 0x89cde3
        // Bib
        g.fillStyle(pinaforeColor).fillRoundedRect(-22, 12, 44, 38, 9).strokeRoundedRect(-22, 12, 44, 38, 9)
        // Straps
        g.fillStyle(pinaforeColor).fillRoundedRect(-26, 4, 9, 22, 4).strokeRoundedRect(-26, 4, 9, 22, 4)
        g.fillStyle(pinaforeColor).fillRoundedRect(17, 4, 9, 22, 4).strokeRoundedRect(17, 4, 9, 22, 4)
        // Golden buttons
        g.fillStyle(0xffd700).fillCircle(-21, 20, 2.5).fillCircle(21, 20, 2.5)

        if (dress.id === 'dress_bunny_pinafore') {
          // Cute Bunny Pocket on Bib
          g.fillStyle(0xffffff).fillRoundedRect(-15, 26, 30, 22, 8).strokeRoundedRect(-15, 26, 30, 22, 8)
          // Bunny ears
          g.fillStyle(0xffffff).fillEllipse(-7, 21, 3.5, 7).strokeEllipse(-7, 21, 3.5, 7)
          g.fillStyle(0xffffff).fillEllipse(7, 21, 3.5, 7).strokeEllipse(7, 21, 3.5, 7)
          g.fillStyle(0xffa8d3).fillEllipse(-7, 22, 2, 4.5).fillEllipse(7, 22, 2, 4.5)
          // Bunny face
          g.fillStyle(OUTLINE).fillCircle(-4, 35, 1.2).fillCircle(4, 35, 1.2)
          g.fillStyle(0xff7ab8).fillEllipse(0, 38, 1.8, 1.2)
        } else {
          // Sweet Daisy Emblem
          g.fillStyle(0xffffff).fillCircle(0, 30, 5).fillCircle(-4, 27, 4).fillCircle(4, 27, 4).fillCircle(-4, 33, 4).fillCircle(4, 33, 4)
          g.fillStyle(0xffd700).fillCircle(0, 30, 3)
        }
      } else if (dress.id === 'dress_pink_gingham') {
        g.fillStyle(0xffffff, 0.95).fillRoundedRect(-12, seatedOrSleeping ? 22 : 20, 24, 18, 5)
        g.lineStyle(1.2, OUTLINE, 0.6).strokeRoundedRect(-12, seatedOrSleeping ? 22 : 20, 24, 18, 5)
        g.fillStyle(0xff6ea7)
        g.fillTriangle(-6, seatedOrSleeping ? 30 : 28, 0, seatedOrSleeping ? 33 : 31, -6, seatedOrSleeping ? 36 : 34)
        g.fillTriangle(6, seatedOrSleeping ? 30 : 28, 0, seatedOrSleeping ? 33 : 31, 6, seatedOrSleeping ? 36 : 34)
        g.fillStyle(0xffd700).fillCircle(0, seatedOrSleeping ? 33 : 31, 2)
      } else if (dress.id === 'dress_yellow_sunshine') {
        g.lineStyle(1.8, 0xffffff, 0.95)
        g.beginPath().arc(0, seatedOrSleeping ? 26 : 24, 11, 0.2, 2.94).strokePath()
        g.beginPath().arc(0, seatedOrSleeping ? 37 : 35, 14, 0.2, 2.94).strokePath()
        g.fillStyle(0xffffff).fillCircle(0, seatedOrSleeping ? 19 : 17, 3.2)
        g.fillStyle(0xffd700).fillCircle(0, seatedOrSleeping ? 19 : 17, 1.8)
      } else if (dress.id === 'dress_mint_floral') {
        g.fillStyle(0xffffff, 0.95).fillRoundedRect(-11, seatedOrSleeping ? 23 : 21, 22, 17, 5)
        g.lineStyle(1.2, OUTLINE, 0.6).strokeRoundedRect(-11, seatedOrSleeping ? 23 : 21, 22, 17, 5)
        g.fillStyle(0x78c99b).fillCircle(0, seatedOrSleeping ? 31 : 29, 3)
        g.fillStyle(0xffffff).fillCircle(0, seatedOrSleeping ? 31 : 29, 1.5)
      } else if (dress.id === 'dress_lavender_ruffle') {
        g.fillStyle(0xffffff, 0.9)
        for (let rx = -14; rx <= 14; rx += 7) {
          g.fillCircle(rx, seatedOrSleeping ? 47 : 49, 3.2)
        }
        g.fillStyle(0xb59fe8).fillCircle(0, seatedOrSleeping ? 23 : 21, 3)
      } else if (dress.id === 'dress_detective_cape') {
        // Detective Capelet & Double-breasted Coat
        g.fillStyle(0x996d47).fillRoundedRect(-41, 8, 82, 36, 12).strokeRoundedRect(-41, 8, 82, 36, 12)
        g.fillStyle(0xffd700)
          .fillCircle(-10, 20, 3).strokeCircle(-10, 20, 3)
          .fillCircle(-10, 32, 3).strokeCircle(-10, 32, 3)
          .fillCircle(10, 20, 3).strokeCircle(10, 20, 3)
          .fillCircle(10, 32, 3).strokeCircle(10, 32, 3)
      } else {
        g.fillStyle(0xff7ab8).fillCircle(0, 28, 5).fillCircle(-8, 28, 4).fillCircle(8, 28, 4)
      }

      // Signature Crossbody White Kitten Bag (if no conflicting accessory)
      if (!accessory || accessory.id === 'accessory_star_pin') {
        g.lineStyle(2, 0xffffff, 0.95).lineBetween(-18, 8, 18, 42)
        g.lineStyle(1.4, OUTLINE, 0.6).lineBetween(-18, 8, 18, 42)
        // Kitten bag body
        g.fillStyle(0xffffff).fillRoundedRect(12, seatedOrSleeping ? 34 : 38, 20, 16, 6).lineStyle(OUTLINE_W, OUTLINE).strokeRoundedRect(12, seatedOrSleeping ? 34 : 38, 20, 16, 6)
        // Kitten ears
        g.fillStyle(0xffffff).fillTriangle(13, seatedOrSleeping ? 34 : 38, 16, seatedOrSleeping ? 28 : 32, 19, seatedOrSleeping ? 34 : 38).strokeTriangle(13, seatedOrSleeping ? 34 : 38, 16, seatedOrSleeping ? 28 : 32, 19, seatedOrSleeping ? 34 : 38)
        g.fillStyle(0xffffff).fillTriangle(23, seatedOrSleeping ? 34 : 38, 26, seatedOrSleeping ? 28 : 32, 29, seatedOrSleeping ? 34 : 38).strokeTriangle(23, seatedOrSleeping ? 34 : 38, 26, seatedOrSleeping ? 28 : 32, 29, seatedOrSleeping ? 34 : 38)
        g.fillStyle(0xffa8d3).fillTriangle(14, seatedOrSleeping ? 34 : 38, 16, seatedOrSleeping ? 30 : 34, 18, seatedOrSleeping ? 34 : 38)
        g.fillStyle(0xffa8d3).fillTriangle(24, seatedOrSleeping ? 34 : 38, 26, seatedOrSleeping ? 30 : 34, 28, seatedOrSleeping ? 34 : 38)
        // Kitten face
        g.fillStyle(OUTLINE).fillCircle(17, seatedOrSleeping ? 41 : 45, 1).fillCircle(25, seatedOrSleeping ? 41 : 45, 1)
        g.fillStyle(0xff7ab8).fillCircle(21, seatedOrSleeping ? 43 : 47, 0.8)
      }
    } else {
      g.fillStyle(bodyColor).fillRoundedRect(-30, 8, 60, 40, 12).strokeRoundedRect(-30, 8, 60, 40, 12)
      g.fillStyle(top?.accent ?? 0xffffff).fillCircle(0, 25, 6)
    }

    // Sweet Peter Pan Blouse Collar
    g.fillStyle(0xffffff).fillEllipse(-12, 4, 14, 7).strokeEllipse(-12, 4, 14, 7)
    g.fillStyle(0xffffff).fillEllipse(12, 4, 14, 7).strokeEllipse(12, 4, 14, 7)
    g.fillStyle(0xffd700).fillCircle(0, 6, 2.5) // Collar gold brooch

    // 7. ARMS & HANDS (Pose-Aware)
    if (expr === 'happy' || expr === 'excited' || state === 'playing') {
      // Cheerful raised fists / celebration hands near cheeks (storybook chibi signature)
      g.fillStyle(skinColor).fillRoundedRect(-46, 8, 16, 32, 7).strokeRoundedRect(-46, 8, 16, 32, 7)
      g.fillStyle(skinColor).fillRoundedRect(30, 8, 16, 32, 7).strokeRoundedRect(30, 8, 16, 32, 7)
      g.fillStyle(skinColor).fillCircle(-38, 10, 8).strokeCircle(-38, 10, 8)
      g.fillStyle(skinColor).fillCircle(38, 10, 8).strokeCircle(38, 10, 8)
    } else if (sitting) {
      // Gentle seated hands resting on lap
      g.fillStyle(skinColor).fillRoundedRect(-38, 12, 16, 36, 7).strokeRoundedRect(-38, 12, 16, 36, 7)
      g.fillStyle(skinColor).fillRoundedRect(22, 12, 16, 36, 7).strokeRoundedRect(22, 12, 16, 36, 7)
      g.fillStyle(skinColor).fillCircle(-20, 46, 7.5).strokeCircle(-20, 46, 7.5)
      g.fillStyle(skinColor).fillCircle(20, 46, 7.5).strokeCircle(20, 46, 7.5)
    } else if (sleeping) {
      // Relaxed sleeping arms folded comfortably over chest
      g.fillStyle(skinColor).fillRoundedRect(-34, 12, 16, 28, 7).strokeRoundedRect(-34, 12, 16, 28, 7)
      g.fillStyle(skinColor).fillRoundedRect(18, 12, 16, 28, 7).strokeRoundedRect(18, 12, 16, 28, 7)
      g.fillStyle(skinColor).fillCircle(-12, 34, 6.5).strokeCircle(-12, 34, 6.5)
      g.fillStyle(skinColor).fillCircle(12, 34, 6.5).strokeCircle(12, 34, 6.5)
    } else {
      g.fillStyle(skinColor).fillRoundedRect(-48, 10, 16, 48, 8).strokeRoundedRect(-48, 10, 16, 48, 8)
      g.fillStyle(skinColor).fillRoundedRect(32, 10, 16, 48, 8).strokeRoundedRect(32, 10, 16, 48, 8)
      g.fillStyle(skinColor).fillCircle(-40, 56, 8).strokeCircle(-40, 56, 8)
      g.fillStyle(skinColor).fillCircle(40, 56, 8).strokeCircle(40, 56, 8)
    }

    // 8. BACK HEAD SCALP
    g.fillStyle(hairColor).fillCircle(0, -48, 48).strokeCircle(0, -48, 48)

    // 9. NECK & CHIBI FACE (Head ~48-50% height, rounded soft cheeks)
    g.fillStyle(skinColor).fillRoundedRect(-14, -6, 28, 16, 6)
    g.fillStyle(skinColor).fillCircle(0, -40, 46).strokeCircle(0, -40, 46)

    // Cute Chibi Ears
    g.fillStyle(skinColor).fillCircle(-46, -40, 8.5).strokeCircle(-46, -40, 8.5)
    g.fillStyle(skinColor).fillCircle(46, -40, 8.5).strokeCircle(46, -40, 8.5)
    g.fillStyle(0xffccd8).fillCircle(-46, -40, 4.5).fillCircle(46, -40, 4.5)

    // 10. EXPRESSIVE CHIBI EYES & BROWS
    if (expr === 'sleepy') {
      // Peaceful sleeping lashes
      g.lineStyle(3, OUTLINE).beginPath().arc(-23, -38, 11, 0.2, 2.94).strokePath()
      g.beginPath().arc(23, -38, 11, 0.2, 2.94).strokePath()
      // Relaxed brows
      g.lineStyle(1.8, OUTLINE_LIGHT).beginPath().arc(-23, -48, 10, 0.4, 2.7).strokePath()
      g.beginPath().arc(23, -48, 10, 0.4, 2.7).strokePath()
    } else if (expr === 'eating' || expr === 'happy') {
      // Happy / Laughing arched eyes
      g.lineStyle(3.2, OUTLINE).beginPath().arc(-23, -41, 11, 3.3, 6.1).strokePath()
      g.beginPath().arc(23, -41, 11, 3.3, 6.1).strokePath()
      // Cheerful high brows
      g.lineStyle(2, OUTLINE_LIGHT).beginPath().arc(-23, -53, 10, 3.4, 6.0).strokePath()
      g.beginPath().arc(23, -53, 10, 3.4, 6.0).strokePath()
    } else {
      const eyeH = expr === 'surprised' ? 30 : 27

      // Eye whites with gentle almond curve
      g.fillStyle(0xffffff).fillEllipse(-23, -39, 28, eyeH).fillEllipse(23, -39, 28, eyeH)

      // Upper anime eyelash line with double winged flicks
      g.lineStyle(3.2, OUTLINE).beginPath().arc(-23, -39, 14.5, 3.15, 6.15).strokePath()
      g.beginPath().arc(23, -39, 14.5, 3.15, 6.15).strokePath()
      g.lineBetween(-35, -46, -40, -50).lineBetween(35, -46, 40, -50)
      g.lineBetween(-36, -42, -41, -44).lineBetween(36, -42, 41, -44)

      // Large kawaii iris
      g.fillStyle(eyeColor).fillEllipse(-23, -39, 21, eyeH - 1)
      g.fillStyle(eyeColor).fillEllipse(23, -39, 21, eyeH - 1)

      // Amber / Gold bottom-iris translucence
      g.fillStyle(0xffbf91, 0.5).fillEllipse(-23, -31, 16, 9).fillEllipse(23, -31, 16, 9)

      // Inner dark pupil core
      g.fillStyle(0x351d38, 0.65).fillCircle(-24, -40, 5.5).fillCircle(24, -40, 5.5)

      // Double Catchlight Gloss Highlights
      // Primary top-left shine
      g.fillStyle(0xffffff).fillCircle(-27, -44, 4.4).fillCircle(21, -44, 4.4)
      // Secondary bottom-right micro-sparkle
      g.fillStyle(0xffffff).fillCircle(-21, -36, 2.5).fillCircle(27, -36, 2.5)

      // Star sparkle in excited state
      if (expr === 'excited') {
        g.fillStyle(0xffd700, 0.9).fillCircle(-23, -40, 3).fillCircle(23, -40, 3)
      }

      // Eyebrows based on expression
      g.lineStyle(2, OUTLINE_LIGHT)
      if (expr === 'curious') {
        // One brow raised
        g.beginPath().arc(-23, -55, 10, 3.3, 5.8).strokePath()
        g.beginPath().arc(23, -50, 10, 3.5, 6.1).strokePath()
      } else if (expr === 'sad') {
        // Downward sloping brows
        g.beginPath().arc(-23, -50, 11, 0.6, 2.6).strokePath()
        g.beginPath().arc(23, -50, 11, 0.6, 2.6).strokePath()
      } else {
        // Gentle curved brows
        g.beginPath().arc(-23, -52, 10, 3.4, 6.0).strokePath()
        g.beginPath().arc(23, -52, 10, 3.4, 6.0).strokePath()
      }
    }

    // 11. ROSY BLUSH CHEEKS WITH SHEEN CATCHLIGHTS
    g.fillStyle(blushColor, 0.65).fillEllipse(-32, -26, 13, 7).fillEllipse(32, -26, 13, 7)
    g.fillStyle(0xffffff, 0.8).fillCircle(-34, -27, 2.2).fillCircle(30, -27, 2.2)

    // 12. NOSE & MOUTH
    g.fillStyle(0xc79483).fillCircle(0, -30, 1.6) // Tiny warm nose dot

    if (expr === 'eating') {
      // Happy open chewing mouth with tongue and crumbs
      g.fillStyle(0xb3496c).fillRoundedRect(-8, -24, 16, 11, 5).lineStyle(1.5, OUTLINE).strokeRoundedRect(-8, -24, 16, 11, 5)
      g.fillStyle(0xff7ab8).fillCircle(0, -18, 4.5)
      g.fillStyle(0xffd700).fillCircle(9, -22, 2).fillCircle(-10, -20, 1.5).fillCircle(7, -28, 1.5)
    } else if (expr === 'happy' || expr === 'excited') {
      // Open radiant smile
      g.fillStyle(0xb3496c).fillRoundedRect(-7, -24, 14, 10, 5).lineStyle(1.5, OUTLINE).strokeRoundedRect(-7, -24, 14, 10, 5)
      g.fillStyle(0xff7ab8).fillCircle(0, -19, 4)
    } else if (expr === 'surprised') {
      // Cute round 'o' mouth
      g.lineStyle(2, OUTLINE).strokeCircle(0, -22, 4.5)
      g.fillStyle(0xb3496c).fillCircle(0, -22, 4)
    } else if (expr === 'sad') {
      // Soft downturned pout
      g.lineStyle(2.5, 0xb3496c).beginPath().arc(0, -18, 6, 3.5, 5.9).strokePath()
    } else if (expr === 'drinking') {
      // Sweet sip mouth
      g.fillStyle(0xb3496c).fillCircle(0, -22, 3)
    } else {
      // Sweet serene smile
      g.lineStyle(2.5, 0xb3496c).beginPath().arc(0, -24, 8.5, 0.25, 2.89).strokePath()
    }

    // 13. FOREHEAD BANGS & HAIR GLOSS
    g.lineStyle(OUTLINE_W, OUTLINE)
    g.fillStyle(hairColor)
      .fillCircle(-25, -67, 17).strokeCircle(-25, -67, 17)
      .fillCircle(0, -71, 19).strokeCircle(0, -71, 19)
      .fillCircle(25, -67, 17).strokeCircle(25, -67, 17)
    if (hairStyle === 'long_waves') {
      g.fillStyle(hairColor).fillRoundedRect(-47, -52, 14, 64, 7).strokeRoundedRect(-47, -52, 14, 64, 7)
      g.fillStyle(hairColor).fillRoundedRect(33, -52, 14, 64, 7).strokeRoundedRect(33, -52, 14, 64, 7)
    }

    // Curved translucent gloss ribbon
    g.fillStyle(0xffffff, 0.48).fillRoundedRect(-24, -77, 48, 6, 3)

    // Signature White Kitten Hair Clip
    if (!hat) {
      g.fillStyle(0xffffff).fillEllipse(0, -81, 17, 13).strokeEllipse(0, -81, 17, 13)
      g.fillStyle(0xffffff).fillTriangle(-7, -86, -4, -93, -1, -86).strokeTriangle(-7, -86, -4, -93, -1, -86)
      g.fillStyle(0xffffff).fillTriangle(1, -86, 4, -93, 7, -86).strokeTriangle(1, -86, 4, -93, 7, -86)
      g.fillStyle(0xffa8d3).fillTriangle(-6, -87, -4, -91, -2, -87)
      g.fillStyle(0xffa8d3).fillTriangle(2, -87, 4, -91, 6, -87)
      g.fillStyle(0x4b2a38).fillCircle(-3, -81, 1.2).fillCircle(3, -81, 1.2)
      g.fillStyle(0xff7ab8).fillCircle(0, -79, 0.8)
    }

    // 14. ACCESSORIES
    if (accessory?.id === 'glasses_heart') {
      g.lineStyle(3.5, accessory.color).strokeCircle(-24, -43, 15).strokeCircle(24, -43, 15).lineBetween(-9, -43, 9, -43)
    } else if (accessory) {
      g.fillStyle(accessory.color).fillCircle(28, 18, 9).fillTriangle(28, 5, 22, 14, 34, 14)
    }

    // 15. HATS & HEADWEAR
    g.lineStyle(OUTLINE_W, OUTLINE)
    if (hat?.id === 'hat_flower_pearl') {
      g.fillStyle(0xffffff).fillRoundedRect(-46, -78, 92, 8, 4).strokeRoundedRect(-46, -78, 92, 8, 4)
      const flowerColors = [0xffa8d3, 0xffd96f, 0xbee8f5, 0xcab8f1, 0xffa8d3]
      flowerColors.forEach((fc, idx) => {
        const fx = -32 + idx * 16
        g.fillStyle(fc).fillCircle(fx, -80, 6.5).strokeCircle(fx, -80, 6.5)
        g.fillStyle(0xffffff).fillCircle(fx, -80, 2.5)
      })
    } else if (hat?.id === 'hat_detective_cap') {
      g.fillStyle(0xc4a482).fillEllipse(0, -88, 98, 26).strokeEllipse(0, -88, 98, 26)
      g.fillStyle(0xc4a482).fillRoundedRect(-36, -114, 72, 32, 16).strokeRoundedRect(-36, -114, 72, 32, 16)
      g.fillStyle(0x5a3d28).fillRoundedRect(-8, -116, 16, 8, 4).fillRoundedRect(-40, -96, 14, 18, 5).fillRoundedRect(26, -96, 14, 18, 5)
    } else if (hat?.id === 'hat_star_tiara') {
      g.fillStyle(0xffd700).fillRoundedRect(-36, -80, 72, 8, 4).strokeRoundedRect(-36, -80, 72, 8, 4)
      g.fillStyle(0xffd700)
        .fillTriangle(-28, -80, -20, -98, -12, -80)
        .fillTriangle(-14, -80, 0, -106, 14, -80)
        .fillTriangle(12, -80, 20, -98, 28, -80)
      g.fillStyle(0xffffff).fillCircle(0, -96, 3.5).fillCircle(-20, -90, 2.5).fillCircle(20, -90, 2.5)
    } else if (hat?.id === 'hat_pirate_bandana') {
      g.fillStyle(0xd90429).fillEllipse(0, -84, 90, 28).strokeEllipse(0, -84, 90, 28)
      g.fillStyle(0xd90429).fillRoundedRect(-34, -108, 68, 28, 14).strokeRoundedRect(-34, -108, 68, 28, 14)
      g.fillStyle(0xd90429).fillCircle(40, -80, 9).fillTriangle(40, -80, 50, -70, 44, -62)
      g.fillStyle(0xffd700).fillCircle(0, -94, 5).fillCircle(0, -91, 2)
    } else if (hat) {
      g.fillStyle(hat.color).fillEllipse(0, -86, 94, 28).strokeEllipse(0, -86, 94, 28)
      g.fillStyle(hat.color).fillRoundedRect(-34, -112, 68, 30, 15).strokeRoundedRect(-34, -112, 68, 30, 15)
      g.fillStyle(hat.accent).fillCircle(24, -98, 7)
    }

    // 16. HELD ITEM IN HANDS (Rendered as Illustrated Prop)
    if (heldItemId && !sleeping) {
      const heldDef = ITEM_DEFINITIONS.find((it) => it.id === heldItemId)
      if (heldDef) {
        const itemX = 18
        const itemY = sitting ? 36 : 42
        // Draw illustrated prop
        PropRenderer.drawProp(g, heldDef.id, itemX, itemY, 0.75)
        // Cute little hands clasping around the item
        g.fillStyle(skinColor).fillCircle(itemX - 12, itemY + 6, 7).lineStyle(1.8, OUTLINE).strokeCircle(itemX - 12, itemY + 6, 7)
        g.fillStyle(skinColor).fillCircle(itemX + 12, itemY + 6, 6.5).lineStyle(1.8, OUTLINE).strokeCircle(itemX + 12, itemY + 6, 6.5)
      }
    }

    // 17. BLINK LIDS (Controlled dynamically)
    if (!sleeping && expr !== 'eating' && expr !== 'happy') {
      const lids = this.scene.add.graphics().setName('blink-lids').setVisible(false)
      lids.fillStyle(skinColor).fillEllipse(-23, -39, 31, 34).fillEllipse(23, -39, 31, 34)
      lids.lineStyle(2.5, OUTLINE).beginPath().arc(-23, -39, 11, 0.2, 2.94).strokePath()
      lids.beginPath().arc(23, -39, 11, 0.2, 2.94).strokePath()
      root.add(lids)
    }

    // Audit fix #8: sleeping pose. A full -90° rotation made the hero look
    // like she fell over. Instead, tilt gently, squat down slightly, and
    // squash so she reads as "curled up and dozing" while staying anchored
    // to the furniture sleep anchor.
    if (sleeping) {
      root.setAngle(-14)
      root.setScale(1, 0.92)
      root.setPosition(0, 14)
    }
    return root
  }
}
