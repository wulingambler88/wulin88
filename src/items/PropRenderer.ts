import Phaser from 'phaser'

const OUTLINE = 0x663d63

/**
 * PropRenderer
 * Illustrated vector art renderer for items, foods, drinks, toys, and stationery.
 * Replaces emoji text with consistent storybook art featuring warm outlines,
 * contact shadows, and soft highlights.
 */
export class PropRenderer {
  static drawProp(
    g: Phaser.GameObjects.Graphics,
    id: string,
    x = 0,
    y = 0,
    scale = 1
  ): void {
    g.save()
    g.translateCanvas(x, y)
    if (scale !== 1) {
      g.scaleCanvas(scale, scale)
    }

    // Contact ground shadow
    g.fillStyle(OUTLINE, 0.18).fillEllipse(0, 24, 46, 12)

    switch (id) {
      case 'apple_01': {
        // Red apple
        g.fillStyle(0xed3f58).fillCircle(0, 2, 21)
        g.fillStyle(0xd62846).fillCircle(5, 5, 17)
        // Indent & Stem
        g.lineStyle(3, 0x6e4726).beginPath().moveTo(0, -18).lineTo(4, -27).strokePath()
        // Leaf
        g.fillStyle(0x62c370).fillEllipse(-9, -20, 11, 6)
        g.lineStyle(1.5, OUTLINE).strokeEllipse(-9, -20, 11, 6)
        // Outline & Highlight
        g.lineStyle(2.5, OUTLINE).strokeCircle(0, 2, 21)
        g.fillStyle(0xffffff, 0.65).fillEllipse(-7, -7, 6, 10)
        break
      }

      case 'banana_01': {
        // Curved Banana
        g.lineStyle(18, 0xffd152).beginPath().arc(0, -6, 26, 0.8, 2.7).strokePath()
        g.lineStyle(20, OUTLINE).beginPath().arc(0, -6, 26, 0.8, 2.7).strokePath()
        g.lineStyle(16, 0xffde59).beginPath().arc(0, -6, 26, 0.8, 2.7).strokePath()
        // Tips
        g.fillStyle(0x705328).fillCircle(-18, 14, 4).fillCircle(19, 13, 3)
        // Soft shine
        g.lineStyle(3, 0xffffff, 0.6).beginPath().arc(0, -8, 22, 1.2, 2.3).strokePath()
        break
      }

      case 'milk_01': {
        // Milk carton
        g.fillStyle(0xbbe7f5).fillRoundedRect(-14, -18, 28, 40, 6)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-14, -18, 28, 40, 6)
        // Gable top
        g.fillStyle(0x92d3e8).fillTriangle(-14, -18, 0, -30, 14, -18)
        g.lineStyle(2.5, OUTLINE).strokeTriangle(-14, -18, 0, -30, 14, -18)
        // White label band & Cow patch / Heart
        g.fillStyle(0xffffff).fillRect(-12, -4, 24, 18)
        g.fillStyle(0xff8fc4).fillCircle(0, 5, 5)
        // Red striped straw
        g.lineStyle(4, 0xffffff).beginPath().moveTo(0, -28).lineTo(12, -40).strokePath()
        g.lineStyle(4, 0xf95368).beginPath().moveTo(4, -32).lineTo(8, -36).strokePath()
        break
      }

      case 'juice_01': {
        // Orange Juice Box
        g.fillStyle(0xff9f43).fillRoundedRect(-13, -16, 26, 38, 5)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-13, -16, 26, 38, 5)
        // Orange slice decal
        g.fillStyle(0xffffff).fillCircle(0, 3, 8)
        g.fillStyle(0xff8400).fillCircle(0, 3, 6)
        // Bendy straw
        g.lineStyle(3, 0xffd95a).beginPath().moveTo(-2, -16).lineTo(-2, -26).lineTo(8, -32).strokePath()
        break
      }

      case 'cake_01': {
        // Shortcake slice
        g.fillStyle(0xffeed9).fillTriangle(-20, 18, 22, 18, 0, -18)
        g.lineStyle(2.5, OUTLINE).strokeTriangle(-20, 18, 22, 18, 0, -18)
        // Pink strawberry cream layers
        g.fillStyle(0xff9ec7).fillRect(-16, 2, 32, 5)
        // White whipped cream dollop
        g.fillStyle(0xffffff).fillCircle(0, -18, 8).lineStyle(2, OUTLINE).strokeCircle(0, -18, 8)
        // Whole glossy strawberry on top
        g.fillStyle(0xf94144).fillCircle(0, -24, 6)
        g.fillStyle(0x43aa8b).fillTriangle(-3, -29, 0, -33, 3, -29)
        break
      }

      case 'orange_01': {
        g.fillStyle(0xff9233).fillCircle(0, 2, 20)
        g.fillStyle(0xed7818).fillCircle(4, 5, 16)
        g.lineStyle(2.5, OUTLINE).strokeCircle(0, 2, 20)
        // Green stem button & leaf
        g.fillStyle(0x3a7d44).fillCircle(0, -17, 3)
        g.fillStyle(0x62c370).fillEllipse(8, -20, 9, 5)
        // Highlight
        g.fillStyle(0xffffff, 0.55).fillCircle(-6, -6, 5)
        break
      }

      case 'strawberry_01': {
        // Heart-shaped plump strawberry
        g.fillStyle(0xf72545).fillTriangle(-16, -6, 16, -6, 0, 22)
        g.fillStyle(0xf72545).fillCircle(-8, -6, 10).fillCircle(8, -6, 10)
        g.lineStyle(2.5, OUTLINE)
          .strokeTriangle(-16, -6, 16, -6, 0, 22)
          .strokeCircle(-8, -6, 10).strokeCircle(8, -6, 10)
        // Golden seeds
        g.fillStyle(0xffd166)
          .fillCircle(-6, 2, 1.2).fillCircle(6, 2, 1.2)
          .fillCircle(0, 10, 1.2).fillCircle(-1, -1, 1.2)
        // Green calyx leaves
        g.fillStyle(0x2a9d8f).fillTriangle(-12, -14, 0, -7, -4, -18).fillTriangle(12, -14, 0, -7, 4, -18)
        break
      }

      case 'bread_01': {
        // Warm bread loaf
        g.fillStyle(0xdba76d).fillRoundedRect(-20, -10, 40, 28, 12)
        g.fillStyle(0xba8148).fillRoundedRect(-22, -12, 44, 18, 10)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-22, -12, 44, 30, 12)
        // Scoring slashes
        g.lineStyle(2.5, 0xfff3d6).lineBetween(-10, -6, -4, 4).lineBetween(4, -6, 10, 4)
        break
      }

      case 'water_01': {
        // Clear water bottle
        g.fillStyle(0xcae9ff, 0.7).fillRoundedRect(-11, -16, 22, 38, 7)
        g.fillStyle(0x79c7ec).fillRoundedRect(-10, -4, 20, 24, 5)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-11, -16, 22, 38, 7)
        // Cap
        g.fillStyle(0x3a86ff).fillRoundedRect(-7, -24, 14, 9, 3).lineStyle(2, OUTLINE).strokeRoundedRect(-7, -24, 14, 9, 3)
        // Catchlight
        g.fillStyle(0xffffff, 0.75).fillRect(-7, -12, 3, 26)
        break
      }

      case 'cookies_01': {
        // Chocolate chip cookie
        g.fillStyle(0xd49b6a).fillCircle(0, 3, 20)
        g.lineStyle(2.5, OUTLINE).strokeCircle(0, 3, 20)
        // Choc chips
        g.fillStyle(0x543217)
          .fillCircle(-7, -4, 3.5).fillCircle(8, -2, 3.2)
          .fillCircle(-3, 10, 3.5).fillCircle(7, 9, 3)
          .fillCircle(1, 2, 2.5)
        break
      }

      case 'sandwich_01': {
        // Triangle club sandwich
        g.fillStyle(0xe8bd72).fillTriangle(-20, 16, 20, 16, 0, -16)
        g.lineStyle(2.5, OUTLINE).strokeTriangle(-20, 16, 20, 16, 0, -16)
        // Greens & Cheese filling peeking out
        g.fillStyle(0x70e000).fillRect(-14, 4, 28, 4)
        g.fillStyle(0xffd000).fillRect(-16, 8, 32, 4)
        g.fillStyle(0xe63946).fillRect(-12, 12, 24, 3)
        break
      }

      case 'cheese_01': {
        // Swiss cheese wedge
        g.fillStyle(0xffd000).fillTriangle(-18, 16, 20, 16, 0, -16)
        g.lineStyle(2.5, OUTLINE).strokeTriangle(-18, 16, 20, 16, 0, -16)
        // Holes
        g.fillStyle(0xdf9f00)
          .fillCircle(-4, 6, 4).fillCircle(8, 8, 3.5).fillCircle(2, -4, 2.5)
        break
      }

      case 'yogurt_01': {
        g.fillStyle(0xfff0f5).fillRoundedRect(-14, -10, 28, 30, 6)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-14, -10, 28, 30, 6)
        // Peel-back foil lid
        g.fillStyle(0xff7597).fillRoundedRect(-16, -15, 32, 7, 3)
        // Berry emblem
        g.fillStyle(0xc77dff).fillCircle(0, 6, 6)
        break
      }

      case 'ice_cream_01': {
        // Waffle cone
        g.fillStyle(0xdda15e).fillTriangle(-12, 2, 12, 2, 0, 26)
        g.lineStyle(2, OUTLINE).strokeTriangle(-12, 2, 12, 2, 0, 26)
        // Pink scoop with swirl
        g.fillStyle(0xffa8cf).fillCircle(0, -4, 16)
        g.lineStyle(2.5, OUTLINE).strokeCircle(0, -4, 16)
        // Cherry on top
        g.fillStyle(0xd90429).fillCircle(0, -22, 5)
        break
      }

      case 'cupcake_01': {
        // Wrapper base
        g.fillStyle(0x8ecae6).fillTriangle(-14, 18, 14, 18, 0, 6)
        g.fillStyle(0x8ecae6).fillRoundedRect(-14, 4, 28, 14, 3)
        g.lineStyle(2, OUTLINE).strokeRoundedRect(-14, 4, 28, 14, 3)
        // Swirled pink frosting
        g.fillStyle(0xffb3c6).fillCircle(0, -2, 16)
        g.lineStyle(2.5, OUTLINE).strokeCircle(0, -2, 16)
        // Sprinkles
        g.fillStyle(0xffd166).fillRect(-5, -6, 4, 2).fillRect(4, -4, 2, 4)
        break
      }

      case 'cafe_croissant_01': {
        // Crescent croissant
        g.fillStyle(0xe29547).fillEllipse(0, 4, 38, 20)
        g.lineStyle(2.5, OUTLINE).strokeEllipse(0, 4, 38, 20)
        g.fillStyle(0xfad089).fillEllipse(0, 2, 28, 14)
        g.lineStyle(2, 0xc07a33).beginPath().arc(-6, 2, 8, 3.2, 5.8).strokePath()
        g.lineStyle(2, 0xc07a33).beginPath().arc(6, 2, 8, 3.2, 5.8).strokePath()
        break
      }

      case 'cafe_latte_01':
      case 'cafe_tea_01':
      case 'cup_01': {
        // Ceramic mug with heart latte art
        g.fillStyle(0xffffff).fillRoundedRect(-16, -12, 32, 32, 8)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-16, -12, 32, 32, 8)
        // Handle
        g.lineStyle(3, OUTLINE).beginPath().arc(16, 4, 8, -Math.PI / 2, Math.PI / 2).strokePath()
        // Coffee surface & Foam heart
        g.fillStyle(0x8a5832).fillEllipse(0, -8, 26, 8)
        g.fillStyle(0xffffff).fillCircle(-3, -8, 3).fillCircle(3, -8, 3).fillTriangle(-5, -7, 5, -7, 0, -4)
        break
      }

      case 'pet_bone_01': {
        // Biscuit bone
        g.fillStyle(0xffedd8).fillRoundedRect(-14, -5, 28, 10, 4)
        g.fillCircle(-14, -6, 5).fillCircle(-14, 6, 5)
        g.fillCircle(14, -6, 5).fillCircle(14, 6, 5)
        g.lineStyle(2, OUTLINE).strokeRoundedRect(-14, -5, 28, 10, 4)
        break
      }

      case 'pet_carrot_01': {
        // Bright orange carrot
        g.fillStyle(0xff7700).fillTriangle(-14, -6, 14, -6, 0, 24)
        g.lineStyle(2.5, OUTLINE).strokeTriangle(-14, -6, 14, -6, 0, 24)
        // Leafy top
        g.fillStyle(0x38b000).fillRoundedRect(-3, -22, 6, 16, 3).fillRoundedRect(-8, -18, 5, 12, 2).fillRoundedRect(3, -18, 5, 12, 2)
        break
      }

      case 'teddy_01': {
        // Illustrated Teddy Bear
        // Ears
        g.fillStyle(0xb5805c).fillCircle(-15, -16, 9).fillCircle(15, -16, 9)
        g.fillStyle(0xffd5b8).fillCircle(-15, -16, 5).fillCircle(15, -16, 5)
        g.lineStyle(2, OUTLINE).strokeCircle(-15, -16, 9).strokeCircle(15, -16, 9)
        // Body
        g.fillStyle(0xc88f4e).fillRoundedRect(-18, -4, 36, 30, 12)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-18, -4, 36, 30, 12)
        // Head
        g.fillStyle(0xc88f4e).fillCircle(0, -6, 17)
        g.lineStyle(2.5, OUTLINE).strokeCircle(0, -6, 17)
        // Snout & Nose
        g.fillStyle(0xffeed9).fillEllipse(0, -2, 11, 8)
        g.fillStyle(0x3a2312).fillCircle(0, -4, 2.5)
        // Button Eyes
        g.fillStyle(0x3a2312).fillCircle(-6, -9, 2.5).fillCircle(6, -9, 2.5)
        // Cute red bowtie
        g.fillStyle(0xf94144).fillTriangle(-8, 9, -2, 12, -8, 15).fillTriangle(8, 9, 2, 12, 8, 15).fillCircle(0, 12, 2.5)
        break
      }

      case 'ball_01': {
        // Storybook 3D Pastel Star Play Ball
        // Spherical base body
        g.fillStyle(0x64c4ed).fillCircle(0, 2, 21)
        g.fillStyle(0x8ae0f9).fillCircle(-3, -1, 18)
        g.lineStyle(2.5, OUTLINE).strokeCircle(0, 2, 21)

        // Curved pastel peach-pink equator band
        g.lineStyle(6, 0xffb5a7).beginPath().arc(0, 2, 19, 0.2, Math.PI - 0.2, false).strokePath()
        g.lineStyle(1.5, OUTLINE, 0.45).beginPath().arc(0, 2, 16, 0.2, Math.PI - 0.2, false).strokePath()

        // Embossed golden 5-point star emblem in center
        g.fillStyle(0xffd166)
          .fillTriangle(0, -6, -4, 4, 4, 4)
          .fillTriangle(-7, -2, 7, -2, 0, 7)
          .fillCircle(0, 1, 4.5)
        g.lineStyle(1.5, OUTLINE).strokeCircle(0, 1, 5)

        // Spherical glass specular highlight
        g.lineStyle(3, 0xffffff, 0.85).beginPath().arc(-3, -1, 14, 3.6, 4.6).strokePath()
        g.fillStyle(0xffffff, 0.9).fillCircle(-7, -5, 2.5)
        break
      }

      case 'toy_robot_01': {
        // Wind-up Retro Robot
        // Antenna
        g.lineStyle(3, 0xffd166).lineBetween(0, -18, 0, -26)
        g.fillStyle(0xef476f).fillCircle(0, -28, 4)
        // Head
        g.fillStyle(0x118ab2).fillRoundedRect(-14, -18, 28, 20, 5)
        g.lineStyle(2, OUTLINE).strokeRoundedRect(-14, -18, 28, 20, 5)
        // Square yellow eyes
        g.fillStyle(0xffd166).fillRect(-10, -13, 6, 5).fillRect(4, -13, 6, 5)
        // Body
        g.fillStyle(0x073b4c).fillRoundedRect(-16, 4, 32, 22, 6)
        g.lineStyle(2, OUTLINE).strokeRoundedRect(-16, 4, 32, 22, 6)
        // Chest meter
        g.fillStyle(0x06d6a0).fillRect(-9, 8, 18, 7)
        break
      }

      case 'toy_dino_01': {
        // Cute green dinosaur
        g.fillStyle(0x52b788).fillCircle(0, 0, 18).fillCircle(12, -12, 10)
        g.lineStyle(2.5, OUTLINE).strokeCircle(0, 0, 18)
        // Back spikes
        g.fillStyle(0xffd166).fillTriangle(-12, -14, -6, -24, 0, -14).fillTriangle(-4, -14, 2, -22, 8, -14)
        // Eye & Cheerful smile
        g.fillStyle(0x1b4332).fillCircle(14, -14, 2)
        break
      }

      case 'toy_train_01': {
        // Wooden train engine
        g.fillStyle(0xe63946).fillRoundedRect(-18, 0, 36, 18, 4)
        g.fillStyle(0x457b9d).fillRoundedRect(2, -16, 16, 20, 4)
        g.lineStyle(2, OUTLINE).strokeRoundedRect(-18, 0, 36, 18, 4)
        // Wheels
        g.fillStyle(0xffd166).fillCircle(-10, 18, 5).fillCircle(10, 18, 5)
        // Smokestack
        g.fillStyle(0x1d3557).fillRect(-14, -12, 6, 12)
        break
      }

      case 'park_kite_01': {
        // Diamond kite with ribbons
        g.fillStyle(0xff70a6).fillTriangle(0, -22, -16, 0, 16, 0)
        g.fillStyle(0x70d6ff).fillTriangle(-16, 0, 16, 0, 0, 24)
        g.lineStyle(2, OUTLINE).beginPath().moveTo(0, -22).lineTo(-16, 0).lineTo(0, 24).lineTo(16, 0).closePath().strokePath()
        // Tail
        g.lineStyle(2, OUTLINE).beginPath().moveTo(0, 24).lineTo(6, 32).lineTo(-4, 38).strokePath()
        g.fillStyle(0xffd670).fillCircle(6, 32, 2.5).fillCircle(-4, 38, 2.5)
        break
      }

      case 'park_frisbee_01': {
        g.fillStyle(0x48cae4).fillEllipse(0, 4, 38, 16)
        g.fillStyle(0x0096c7).fillEllipse(0, 2, 28, 10)
        g.lineStyle(2.5, OUTLINE).strokeEllipse(0, 4, 38, 16)
        break
      }

      case 'book_01':
      case 'school_notebook_01': {
        // Ornate Fairytale Storybook / Magical Grimoire
        // Hardcover base (Lapis Leather)
        g.fillStyle(0x2f3e66).fillRoundedRect(-16, -20, 32, 42, 5)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-16, -20, 32, 42, 5)

        // Deckled cream page block at right edge
        g.fillStyle(0xfff9eb).fillRoundedRect(9, -17, 5, 36, 2)
        g.lineStyle(1.2, OUTLINE, 0.5).strokeRoundedRect(9, -17, 5, 36, 2)
        g.fillStyle(0xded3be).fillRect(11, -14, 1.5, 30)

        // Spine with gilded horizontal ribs
        g.fillStyle(0x212c49).fillRect(-16, -20, 7, 42)
        g.fillStyle(0xffd166)
          .fillRect(-16, -12, 6, 2)
          .fillRect(-16, 0, 6, 2)
          .fillRect(-16, 12, 6, 2)

        // Red satin ribbon bookmark dangling from bottom
        g.fillStyle(0xe63946).fillRect(-1, 18, 5, 8)
        g.fillStyle(0xe63946).fillTriangle(-1, 26, 4, 26, 1.5, 23)

        // Gold filigree corner protectors
        g.fillStyle(0xffd166)
          .fillTriangle(4, -18, 12, -18, 12, -10)
          .fillTriangle(4, 18, 12, 18, 12, 10)

        // Celestial Gold Foil Medallion in center
        g.fillStyle(0xffd166).fillCircle(1, 0, 8)
        g.lineStyle(1.2, OUTLINE).strokeCircle(1, 0, 8)
        g.fillStyle(0x1e2746).fillCircle(1, 0, 6)
        // Center twinkling star
        g.fillStyle(0xfffaee).fillCircle(1, 0, 2.5)
        g.fillStyle(0xffd166)
          .fillCircle(1, -3, 1)
          .fillCircle(1, 3, 1)
          .fillCircle(-2, 0, 1)
          .fillCircle(4, 0, 1)
        break
      }

      case 'school_crayon_01': {
        // Bright crayon
        g.fillStyle(0xff5964).fillRoundedRect(-6, -16, 12, 34, 3)
        g.fillTriangle(-6, -16, 6, -16, 0, -26)
        g.lineStyle(2, OUTLINE).strokeRoundedRect(-6, -16, 12, 34, 3)
        // Paper wrapper
        g.fillStyle(0x35a7ff).fillRect(-6, -6, 12, 16)
        break
      }

      case 'school_backpack_01': {
        // School backpack
        g.fillStyle(0x7209b7).fillRoundedRect(-16, -16, 32, 38, 8)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-16, -16, 32, 38, 8)
        // Front pouch & buckle
        g.fillStyle(0xb5179e).fillRoundedRect(-12, 4, 24, 14, 4)
        g.fillStyle(0xffd166).fillCircle(0, 10, 3)
        break
      }

      case 'pillow_01': {
        // Soft cloud pillow
        g.fillStyle(0xffd6ff).fillRoundedRect(-22, -10, 44, 26, 12)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-22, -10, 44, 26, 12)
        g.fillStyle(0xffffff, 0.6).fillEllipse(0, 2, 30, 14)
        break
      }

      case 'pet_bowl_01': {
        // Ceramic pet bowl with paw
        g.fillStyle(0xffafcc).fillEllipse(0, 10, 36, 16)
        g.lineStyle(2.5, OUTLINE).strokeEllipse(0, 10, 36, 16)
        g.fillStyle(0x705328).fillEllipse(0, 6, 28, 10) // Kibble inside
        break
      }

      // --- Cooked / Recipe Items (Audit fix #2) ---

      case 'smoothie_apple_01': {
        // Tall glass with green apple smoothie
        g.fillStyle(0xddf4fb, 0.85).fillRoundedRect(-10, -22, 20, 40, 4)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-10, -22, 20, 40, 4)
        // Green smoothie fill
        g.fillStyle(0x9be07d).fillRoundedRect(-8, -8, 16, 24, 3)
        // Apple slice garnish on rim
        g.fillStyle(0xed3f58).fillCircle(8, -20, 5)
        g.fillStyle(0xffffff, 0.5).fillCircle(8, -20, 2)
        // Straw
        g.lineStyle(3, 0xff8fc4).lineBetween(-3, -22, -6, -34)
        // Foam top
        g.fillStyle(0xffffff, 0.8).fillEllipse(0, -8, 16, 5)
        break
      }

      case 'cake_strawberry_deluxe': {
        // Layered strawberry cake slice
        g.fillStyle(0xfff0f5).fillTriangle(-22, 20, 24, 20, 0, -20)
        g.lineStyle(2.5, OUTLINE).strokeTriangle(-22, 20, 24, 20, 0, -20)
        // Pink cream layers
        g.fillStyle(0xff8ebd).fillRect(-18, 4, 36, 5)
        g.fillStyle(0xff8ebd).fillRect(-14, -6, 28, 4)
        // Sponge layers
        g.fillStyle(0xf5be6c).fillRect(-18, 9, 36, 5)
        g.fillStyle(0xf5be6c).fillRect(-14, -2, 28, 4)
        // Strawberry on top
        g.fillStyle(0xf45f73).fillCircle(0, -20, 7)
        g.lineStyle(1.5, OUTLINE).strokeCircle(0, -20, 7)
        g.fillStyle(0x62c370).fillEllipse(0, -26, 6, 3)
        // Whipped cream dollop
        g.fillStyle(0xffffff).fillCircle(-6, -14, 4).fillCircle(6, -14, 4)
        break
      }

      case 'french_toast_01': {
        // Golden french toast stack
        g.fillStyle(0xf5be6c).fillRoundedRect(-18, -4, 36, 12, 4)
        g.fillStyle(0xe8a84c).fillRoundedRect(-16, -12, 32, 10, 4)
        g.fillStyle(0xf5be6c).fillRoundedRect(-14, -19, 28, 9, 4)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-18, -4, 36, 12, 4)
        g.lineStyle(2, OUTLINE).strokeRoundedRect(-16, -12, 32, 10, 4)
        g.lineStyle(2, OUTLINE).strokeRoundedRect(-14, -19, 28, 9, 4)
        // Butter pat on top
        g.fillStyle(0xffd96f).fillRoundedRect(-5, -24, 10, 6, 2)
        g.lineStyle(1.5, OUTLINE).strokeRoundedRect(-5, -24, 10, 6, 2)
        // Syrup drizzle
        g.lineStyle(2, 0xc88f4e, 0.7).beginPath().moveTo(-12, -4).lineTo(-14, 6).strokePath()
        g.lineStyle(2, 0xc88f4e, 0.7).beginPath().moveTo(10, -4).lineTo(12, 6).strokePath()
        break
      }

      case 'boba_strawberry_01': {
        // Strawberry boba tea cup
        g.fillStyle(0xffd6e8, 0.9).fillRoundedRect(-11, -18, 22, 38, 5)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-11, -18, 22, 38, 5)
        // Pink strawberry milk fill
        g.fillStyle(0xffa4cc).fillRoundedRect(-9, -6, 18, 24, 3)
        // Tapioca pearls at bottom
        g.fillStyle(0x3a2312)
          .fillCircle(-4, 14, 3).fillCircle(3, 15, 3).fillCircle(0, 10, 3)
          .fillCircle(-5, 10, 2.5).fillCircle(5, 11, 2.5)
        // Dome lid
        g.fillStyle(0xffffff, 0.6).fillEllipse(0, -18, 22, 7)
        g.lineStyle(2, OUTLINE).strokeEllipse(0, -18, 22, 7)
        // Wide straw
        g.fillStyle(0xff75a8).fillRoundedRect(-2, -34, 5, 18, 2)
        g.lineStyle(1.5, OUTLINE).strokeRoundedRect(-2, -34, 5, 18, 2)
        break
      }

      case 'latte_caramel_01': {
        // Cozy caramel macchiato mug
        g.fillStyle(0xfff8ee).fillRoundedRect(-14, -10, 28, 28, 6)
        g.lineStyle(2.5, OUTLINE).strokeRoundedRect(-14, -10, 28, 28, 6)
        // Handle
        g.lineStyle(4, 0xfff8ee).beginPath().arc(16, 4, 8, -1.2, 1.2).strokePath()
        g.lineStyle(2.5, OUTLINE).beginPath().arc(16, 4, 8, -1.2, 1.2).strokePath()
        // Coffee surface
        g.fillStyle(0xc88f4e).fillEllipse(0, -10, 24, 8)
        g.lineStyle(2, OUTLINE).strokeEllipse(0, -10, 24, 8)
        // Latte art heart
        g.fillStyle(0xfff8ee).fillCircle(-3, -10, 3).fillCircle(3, -10, 3)
        g.fillStyle(0xfff8ee).fillTriangle(-5, -8, 5, -8, 0, -4)
        // Steam wisps
        g.lineStyle(2, 0xffffff, 0.5).beginPath().moveTo(-4, -18).lineTo(-5, -26).strokePath()
        g.lineStyle(2, 0xffffff, 0.5).beginPath().moveTo(4, -18).lineTo(5, -26).strokePath()
        // Cookie crumble on top
        g.fillStyle(0xc98d62).fillCircle(-6, -12, 2).fillCircle(7, -13, 1.5)
        break
      }

      default: {
        // Fallback charming gift/star orb
        g.fillStyle(0xffd166).fillCircle(0, 2, 18)
        g.lineStyle(2.5, OUTLINE).strokeCircle(0, 2, 18)
        g.fillStyle(0xffffff, 0.65).fillCircle(-5, -4, 5)
        break
      }
    }

    g.restore()
  }
}
