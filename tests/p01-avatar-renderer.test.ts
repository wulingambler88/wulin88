import { describe, expect, it, vi } from 'vitest'

vi.mock('phaser', () => {
  class MockContainer {
    readonly children: unknown[] = []
    add(child: unknown): this {
      this.children.push(child)
      return this
    }
    setAngle(): this { return this }
    setScale(): this { return this }
    setPosition(): this { return this }
    getByName(): null { return null }
  }

  class MockGraphics {
    fillStyle(): this { return this }
    lineStyle(): this { return this }
    fillRoundedRect(): this { return this }
    strokeRoundedRect(): this { return this }
    fillCircle(): this { return this }
    strokeCircle(): this { return this }
    fillEllipse(): this { return this }
    strokeEllipse(): this { return this }
    fillTriangle(): this { return this }
    strokeTriangle(): this { return this }
    lineBetween(): this { return this }
    beginPath(): this { return this }
    arc(): this { return this }
    strokePath(): this { return this }
    setName(): this { return this }
    setVisible(): this { return this }
  }

  return {
    default: {
      GameObjects: {
        Container: MockContainer,
        Graphics: MockGraphics,
      },
    },
  }
})

import { AvatarRenderer } from '../src/characters/AvatarRenderer'
import { createAvatarPortraitSVG } from '../src/theme/Icons'
import { HAIR_STYLES, HAIR_COLORS, SKIN_TONES, EYE_COLORS } from '../src/ui/CharacterCreatorModal'
import type { AvatarCustomization } from '../src/save/SaveSchema'
import type { EquippedClothing } from '../src/characters/ClothingManager'
import type Phaser from 'phaser'

interface MockGraphicsObj {
  fillStyle: () => MockGraphicsObj
  lineStyle: () => MockGraphicsObj
  fillRoundedRect: () => MockGraphicsObj
  strokeRoundedRect: () => MockGraphicsObj
  fillCircle: () => MockGraphicsObj
  strokeCircle: () => MockGraphicsObj
  fillEllipse: () => MockGraphicsObj
  strokeEllipse: () => MockGraphicsObj
  fillTriangle: () => MockGraphicsObj
  strokeTriangle: () => MockGraphicsObj
  lineBetween: () => MockGraphicsObj
  beginPath: () => MockGraphicsObj
  arc: () => MockGraphicsObj
  strokePath: () => MockGraphicsObj
  setName: () => MockGraphicsObj
  setVisible: () => MockGraphicsObj
}

interface MockContainerObj {
  children: unknown[]
  add: (child: unknown) => MockContainerObj
  setAngle: () => MockContainerObj
  setScale: () => MockContainerObj
  setPosition: () => MockContainerObj
  getByName: (name: string) => unknown
}

function createMockScene(): Phaser.Scene {
  const mockGraphics = (): MockGraphicsObj => {
    const g: MockGraphicsObj = {
      fillStyle: () => g,
      lineStyle: () => g,
      fillRoundedRect: () => g,
      strokeRoundedRect: () => g,
      fillCircle: () => g,
      strokeCircle: () => g,
      fillEllipse: () => g,
      strokeEllipse: () => g,
      fillTriangle: () => g,
      strokeTriangle: () => g,
      lineBetween: () => g,
      beginPath: () => g,
      arc: () => g,
      strokePath: () => g,
      setName: () => g,
      setVisible: () => g,
    }
    return g
  }

  const mockContainer = (): MockContainerObj => {
    const children: unknown[] = []
    const c: MockContainerObj = {
      children,
      add: (child: unknown) => { children.push(child); return c },
      setAngle: () => c,
      setScale: () => c,
      setPosition: () => c,
      getByName: () => null,
    }
    return c
  }

  return {
    add: {
      graphics: mockGraphics,
      container: mockContainer,
      image: () => ({ setDisplaySize: () => {} }),
    },
    textures: {
      exists: () => false,
    },
  } as unknown as Phaser.Scene
}

describe('P01: AvatarRenderer and Customization System', () => {
  const scene = createMockScene()
  const renderer = new AvatarRenderer(scene)

  it('renders without error across all 5 hairstyles', () => {
    for (const style of HAIR_STYLES) {
      const custom: AvatarCustomization = {
        hairStyle: style.id,
        hairColor: 0xffd96f,
        skinColor: 0xffd7c6,
        eyeColor: 0x6c3f68,
        blushColor: 0xff7e9f,
      }
      const outfit: EquippedClothing = { top: 'top_strawberry' }
      const container = renderer.render(outfit, 'standing', custom)
      expect(container).toBeDefined()
    }
  })

  it('renders all 6 hair colors without altering player identity (including pastel lavender / purple)', () => {
    for (const color of HAIR_COLORS) {
      const custom: AvatarCustomization = {
        hairStyle: 'twin_buns',
        hairColor: color.hex,
        skinColor: 0xffd7c6,
        eyeColor: 0x6c3f68,
        blushColor: 0xff7e9f,
      }
      const outfit: EquippedClothing = { dress: 'dress_blue_daisy' }
      const container = renderer.render(outfit, 'standing', custom)
      expect(container).toBeDefined()

      // SVG Portrait must also strictly preserve player hair color
      const svg = createAvatarPortraitSVG(custom)
      const expectedHex = '#' + color.hex.toString(16).padStart(6, '0')
      expect(svg.toLowerCase()).toContain(expectedHex.toLowerCase())
    }
  })

  it('renders all skin tones and eye colors faithfully', () => {
    for (const skin of SKIN_TONES) {
      for (const eye of EYE_COLORS) {
        const custom: AvatarCustomization = {
          hairStyle: 'long_waves',
          hairColor: 0xb89fe8, // Pastel lavender / purple
          skinColor: skin.hex,
          eyeColor: eye.hex,
          blushColor: 0xff7e9f,
        }
        const container = renderer.render({}, 'standing', custom)
        expect(container).toBeDefined()

        const svg = createAvatarPortraitSVG(custom)
        expect(svg).toContain('#' + skin.hex.toString(16).padStart(6, '0'))
        expect(svg).toContain('#' + eye.hex.toString(16).padStart(6, '0'))
      }
    }
  })

  it('supports all poses: standing, sitting, sleeping, and reactions', () => {
    const states = ['standing', 'sitting', 'sleeping', 'eating', 'playing'] as const
    const custom: AvatarCustomization = {
      hairStyle: 'twin_buns',
      hairColor: 0xb89fe8,
      skinColor: 0xffd7c6,
      eyeColor: 0x6c3f68,
      blushColor: 0xff7e9f,
    }

    for (const state of states) {
      const container = renderer.render({ dress: 'dress_bunny_pinafore' }, state, custom)
      expect(container).toBeDefined()
    }
  })

  it('renders diverse outfits without style disruption', () => {
    const custom: AvatarCustomization = {
      hairStyle: 'twin_buns',
      hairColor: 0x996340,
      skinColor: 0xffd7c6,
      eyeColor: 0x6c3f68,
      blushColor: 0xff7e9f,
    }

    const testOutfits: EquippedClothing[] = [
      { dress: 'dress_blue_daisy', shoes: 'shoes_pink_maryjane' },
      { dress: 'dress_bunny_pinafore', hat: 'hat_cat' },
      { dress: 'dress_detective_cape', hat: 'hat_detective_cap' },
      { top: 'top_strawberry', bottom: 'bottom_denim', shoes: 'shoes_mint' },
      { top: 'top_sunshine', bottom: 'bottom_lavender', hat: 'hat_beret', accessory: 'glasses_heart' },
    ]

    for (const outfit of testOutfits) {
      const container = renderer.render(outfit, 'standing', custom)
      expect(container).toBeDefined()
    }
  })
})
