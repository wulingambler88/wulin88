import Phaser from 'phaser'
import { audioManager } from '../audio/AudioManager'
import { ITEM_DEFINITIONS } from '../data/items'
import { PropRenderer } from '../items/PropRenderer'
import { showToast } from '../ui/UIManager'
import { DEFAULT_FRIDGE } from '../save/SaveSchema'

interface InteractiveFridgeOptions {
  onItemRetrieved: (itemId: string, spawnX: number, spawnY: number) => void
  onStateChange?: () => void
}

export class InteractiveFridge extends Phaser.GameObjects.Container {
  private freezerOpen = false
  private fridgeOpen = false
  private storedItems: string[] = [...DEFAULT_FRIDGE]

  private bgGraphics!: Phaser.GameObjects.Graphics
  private interiorContainer!: Phaser.GameObjects.Container
  private topDoorContainer!: Phaser.GameObjects.Container
  private bottomDoorContainer!: Phaser.GameObjects.Container
  private itemIcons: Phaser.GameObjects.Container[] = []

  private readonly options: InteractiveFridgeOptions

  constructor(scene: Phaser.Scene, x: number, y: number, options: InteractiveFridgeOptions) {
    super(scene, x, y)
    this.options = options
    scene.add.existing(this)
    this.setDepth(200)

    this.createFridge()
  }

  getStoredItems(): string[] {
    return [...this.storedItems]
  }

  setStoredItems(items: string[]): void {
    this.storedItems = [...items]
    this.refreshStoredItems()
  }

  isAcceptingDrops(x: number, y: number): boolean {
    if (!this.fridgeOpen && !this.freezerOpen) return false
    return Math.abs(x - this.x) <= 90 && Math.abs(y - this.y) <= 120
  }

  storeItem(itemId: string): boolean {
    if (this.storedItems.length >= 6) {
      showToast('Fridge is full! Take something out first.')
      return false
    }
    this.storedItems.push(itemId)
    audioManager.play('drop')
    const def = ITEM_DEFINITIONS.find((it) => it.id === itemId)
    showToast(`Stored ${def?.name ?? 'item'} in fridge! ❄️`)
    this.refreshStoredItems()
    this.options.onStateChange?.()
    return true
  }

  private createFridge(): void {
    const w = 180
    const h = 250

    const OUTLINE = 0x663d63

    // Outer shadow
    const shadow = this.scene.add.graphics()
    shadow.fillStyle(OUTLINE, 0.16).fillEllipse(0, h / 2 + 10, w * 0.95, 24)
    this.add(shadow)

    // Main cabinet base (Retro Mint Enamel)
    this.bgGraphics = this.scene.add.graphics()
    this.bgGraphics.fillStyle(0x8ec4b7).fillRoundedRect(-w / 2, -h / 2, w, h, 20)
    this.bgGraphics.lineStyle(3, OUTLINE, 0.85).strokeRoundedRect(-w / 2, -h / 2, w, h, 20)
    // Chrome feet at bottom
    this.bgGraphics.fillStyle(0xdfe8ed).fillRoundedRect(-w / 2 + 18, h / 2 - 3, 20, 10, 3)
    this.bgGraphics.lineStyle(1.5, OUTLINE).strokeRoundedRect(-w / 2 + 18, h / 2 - 3, 20, 10, 3)
    this.bgGraphics.fillStyle(0xdfe8ed).fillRoundedRect(w / 2 - 38, h / 2 - 3, 20, 10, 3)
    this.bgGraphics.lineStyle(1.5, OUTLINE).strokeRoundedRect(w / 2 - 38, h / 2 - 3, 20, 10, 3)
    this.add(this.bgGraphics)

    // Interior cavity (revealed when open)
    this.interiorContainer = this.scene.add.container(0, 0)
    const ig = this.scene.add.graphics()
    // Top cavity (freezer)
    ig.fillStyle(0xdef3fa).fillRoundedRect(-w / 2 + 10, -h / 2 + 10, w - 20, 80, 12)
    ig.lineStyle(1.5, OUTLINE, 0.4).strokeRoundedRect(-w / 2 + 10, -h / 2 + 10, w - 20, 80, 12)
    // Freezer wire/glass shelf
    ig.fillStyle(0xbee2ee).fillRect(-w / 2 + 15, -h / 2 + 50, w - 30, 4)
    ig.fillStyle(0xffffff).fillRect(-w / 2 + 15, -h / 2 + 50, w - 30, 1.5)

    // Bottom cavity (fridge)
    ig.fillStyle(0xf7fcfd).fillRoundedRect(-w / 2 + 10, -h / 2 + 98, w - 20, 140, 12)
    ig.lineStyle(1.5, OUTLINE, 0.4).strokeRoundedRect(-w / 2 + 10, -h / 2 + 98, w - 20, 140, 12)
    // Shelf 1 (Tempered glass with aqua trim)
    ig.fillStyle(0xa4dced).fillRect(-w / 2 + 15, -h / 2 + 144, w - 30, 4)
    ig.fillStyle(0xffffff).fillRect(-w / 2 + 15, -h / 2 + 144, w - 30, 1.5)
    // Shelf 2
    ig.fillStyle(0xa4dced).fillRect(-w / 2 + 15, -h / 2 + 188, w - 30, 4)
    ig.fillStyle(0xffffff).fillRect(-w / 2 + 15, -h / 2 + 188, w - 30, 1.5)
    // Crisper produce drawer at bottom
    ig.fillStyle(0xccecf4, 0.7).fillRoundedRect(-w / 2 + 14, -h / 2 + 196, w - 28, 38, 6)
    ig.lineStyle(1.5, OUTLINE, 0.5).strokeRoundedRect(-w / 2 + 14, -h / 2 + 196, w - 28, 38, 6)

    this.interiorContainer.add(ig)
    this.add(this.interiorContainer)

    // Top Door (Freezer)
    this.topDoorContainer = this.scene.add.container(-w / 2, -h / 2)
    this.renderTopDoor(w, 86)
    this.add(this.topDoorContainer)

    // Bottom Door (Fridge)
    this.bottomDoorContainer = this.scene.add.container(-w / 2, -h / 2 + 92)
    this.renderBottomDoor(w, 150)
    this.add(this.bottomDoorContainer)

    this.refreshStoredItems()
  }

  private renderTopDoor(w: number, doorH: number): void {
    this.topDoorContainer.removeAll(true)
    const OUTLINE = 0x663d63
    const tg = this.scene.add.graphics()

    // Door Shell (Retro Mint)
    tg.fillStyle(0x9ed3c7).fillRoundedRect(4, 4, w - 8, doorH, 16)
    tg.lineStyle(2.5, OUTLINE, 0.8).strokeRoundedRect(4, 4, w - 8, doorH, 16)

    // Glossy Specular Highlight on curved top
    tg.fillStyle(0xbfece2, 0.7).fillRoundedRect(8, 7, w - 16, 12, 6)

    // Bottom horizontal chrome trim accent
    tg.fillStyle(0xdfe8ed).fillRoundedRect(4, doorH - 4, w - 8, 4, 1)
    tg.fillStyle(0xffffff).fillRect(6, doorH - 4, w - 12, 1.5)
    tg.lineStyle(1, OUTLINE, 0.5).strokeRoundedRect(4, doorH - 4, w - 8, 4, 1)

    // Retro Script Chrome Emblem / Badge
    tg.fillStyle(0xedf4f8).fillRoundedRect(w / 2 - 28, doorH / 2 - 12, 56, 18, 5)
    tg.lineStyle(1.5, OUTLINE).strokeRoundedRect(w / 2 - 28, doorH / 2 - 12, 56, 18, 5)
    tg.fillStyle(0xffffff).fillRect(w / 2 - 26, doorH / 2 - 10, 52, 3)

    const badgeText = this.scene.add.text(w / 2, doorH / 2 - 3, '❄️ CHILL', {
      fontFamily: 'Trebuchet MS',
      fontSize: '10px',
      color: '#426860',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // Chunky Retro Chrome Pull Handle
    // Mount brackets
    tg.fillStyle(0x9ab0ba).fillRoundedRect(w - 24, doorH - 32, 6, 6, 2)
    tg.fillStyle(0x9ab0ba).fillRoundedRect(w - 24, doorH - 12, 6, 6, 2)
    // Chrome handle grip bar
    tg.fillStyle(0xdfe8ed).fillRoundedRect(w - 22, doorH - 34, 9, 28, 4)
    tg.lineStyle(1.5, OUTLINE).strokeRoundedRect(w - 22, doorH - 34, 9, 28, 4)
    // Handle white catchlight
    tg.fillStyle(0xffffff).fillRect(w - 20, doorH - 32, 2.5, 24)

    this.topDoorContainer.add([tg, badgeText])
    this.topDoorContainer.setSize(w, doorH).setInteractive(
      new Phaser.Geom.Rectangle(0, 0, w, doorH),
      Phaser.Geom.Rectangle.Contains
    )

    this.topDoorContainer.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event.stopPropagation()
      this.toggleFreezer()
    })
  }

  private renderBottomDoor(w: number, doorH: number): void {
    this.bottomDoorContainer.removeAll(true)
    const OUTLINE = 0x663d63
    const bg = this.scene.add.graphics()

    // Door Shell (Retro Mint)
    bg.fillStyle(0x9ed3c7).fillRoundedRect(4, 4, w - 8, doorH, 16)
    bg.lineStyle(2.5, OUTLINE, 0.8).strokeRoundedRect(4, 4, w - 8, doorH, 16)

    // Top horizontal chrome trim
    bg.fillStyle(0xdfe8ed).fillRoundedRect(4, 4, w - 8, 4, 1)
    bg.fillStyle(0xffffff).fillRect(6, 4, w - 12, 1.5)
    bg.lineStyle(1, OUTLINE, 0.5).strokeRoundedRect(4, 4, w - 8, 4, 1)

    // Left curved specular sheen
    bg.fillStyle(0xbfece2, 0.55).fillRoundedRect(7, 12, 12, doorH - 24, 6)

    // Chunky Retro Chrome Pull Handle
    // Mount brackets
    bg.fillStyle(0x9ab0ba).fillRoundedRect(w - 24, 18, 6, 6, 2)
    bg.fillStyle(0x9ab0ba).fillRoundedRect(w - 24, 52, 6, 6, 2)
    // Chrome handle grip bar
    bg.fillStyle(0xdfe8ed).fillRoundedRect(w - 22, 16, 9, 42, 4)
    bg.lineStyle(1.5, OUTLINE).strokeRoundedRect(w - 22, 16, 9, 42, 4)
    // Handle catchlight
    bg.fillStyle(0xffffff).fillRect(w - 20, 18, 2.5, 38)

    // --- Storybook Kitchen Magnets ---
    // 1. Calico Cat Head Magnet at (40, 36)
    // Ears
    bg.fillStyle(0x6b3f23).fillTriangle(30, 30, 35, 20, 40, 30)
    bg.fillStyle(0xfa9f42).fillTriangle(44, 30, 49, 20, 54, 30)
    bg.fillStyle(0xffb8d1).fillTriangle(32, 29, 35, 23, 38, 29).fillTriangle(46, 29, 49, 23, 52, 29)
    // Face
    bg.fillStyle(0xfa9f42).fillCircle(42, 36, 12)
    bg.lineStyle(1.5, OUTLINE).strokeCircle(42, 36, 12)
    // Brown eye patch
    bg.fillStyle(0x6b3f23).fillCircle(38, 34, 5)
    // Eyes & Nose
    bg.fillStyle(0x38271d).fillCircle(38, 35, 1.5).fillCircle(46, 35, 1.5)
    bg.fillStyle(0xff6b8b).fillTriangle(41, 38, 43, 38, 42, 40)

    // 2. Glossy Strawberry Magnet at (88, 48)
    bg.fillStyle(0xf94144).fillCircle(85, 46, 5).fillCircle(91, 46, 5).fillTriangle(81, 47, 95, 47, 88, 59)
    bg.lineStyle(1.2, OUTLINE).strokeCircle(85, 46, 5).strokeCircle(91, 46, 5).strokeTriangle(81, 47, 95, 47, 88, 59)
    // Seeds
    bg.fillStyle(0xffe169).fillCircle(85, 49, 0.8).fillCircle(91, 49, 0.8).fillCircle(88, 53, 0.8)
    // Green Calyx
    bg.fillStyle(0x2a9d8f).fillTriangle(83, 44, 88, 47, 85, 41).fillTriangle(93, 44, 88, 47, 91, 41)

    // 3. Pinned Recipe Note at (32, 72)
    // Tilted memo paper
    bg.fillStyle(OUTLINE, 0.12).fillRoundedRect(34, 72, 54, 46, 4) // Drop shadow
    bg.fillStyle(0xfffaea).fillRoundedRect(32, 70, 54, 46, 4)
    bg.lineStyle(1.2, OUTLINE, 0.6).strokeRoundedRect(32, 70, 54, 46, 4)
    // Ruled lines on note
    bg.fillStyle(0xceddd6).fillRect(36, 84, 44, 2).fillRect(36, 92, 36, 2).fillRect(36, 100, 40, 2)
    // Heart sketch
    bg.fillStyle(0xff85a1).fillCircle(40, 77, 2).fillCircle(44, 77, 2).fillTriangle(38, 78, 46, 78, 42, 82)
    // Lavender pushpin at top-center (58, 69)
    bg.fillStyle(0x9d4edd).fillCircle(58, 69, 4)
    bg.fillStyle(0xffffff).fillCircle(57, 68, 1.5)
    bg.lineStyle(1, OUTLINE).strokeCircle(58, 69, 4)

    this.bottomDoorContainer.add(bg)
    this.bottomDoorContainer.setSize(w, doorH).setInteractive(
      new Phaser.Geom.Rectangle(0, 0, w, doorH),
      Phaser.Geom.Rectangle.Contains
    )

    this.bottomDoorContainer.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      ptr.event.stopPropagation()
      this.toggleFridge()
    })
  }

  toggleFreezer(): void {
    this.freezerOpen = !this.freezerOpen
    audioManager.play('switch')
    this.scene.tweens.add({
      targets: this.topDoorContainer,
      scaleX: this.freezerOpen ? 0.15 : 1.0,
      duration: 180,
      ease: 'Back.easeOut',
    })
    showToast(this.freezerOpen ? 'Freezer Opened! ❄️' : 'Freezer Closed')
    this.options.onStateChange?.()
  }

  toggleFridge(): void {
    this.fridgeOpen = !this.fridgeOpen
    audioManager.play('switch')
    this.scene.tweens.add({
      targets: this.bottomDoorContainer,
      scaleX: this.fridgeOpen ? 0.15 : 1.0,
      duration: 180,
      ease: 'Back.easeOut',
    })
    showToast(this.fridgeOpen ? 'Fridge Opened! Grab a snack or store groceries!' : 'Fridge Closed')
    this.options.onStateChange?.()
  }

  private refreshStoredItems(): void {
    this.itemIcons.forEach((c) => c.destroy())
    this.itemIcons = []

    // Coordinates for slots inside fridge
    const slotPositions = [
      { x: -35, y: -80 }, // Freezer slot 1
      { x: 35, y: -80 },  // Freezer slot 2
      { x: -45, y: 5 },   // Fridge shelf 1 left
      { x: 45, y: 5 },    // Fridge shelf 1 right
      { x: -45, y: 60 },  // Fridge shelf 2 left
      { x: 45, y: 60 },   // Fridge shelf 2 right
    ]

    this.storedItems.forEach((itemId, idx) => {
      const pos = slotPositions[idx]
      if (!pos) return
      const def = ITEM_DEFINITIONS.find((it) => it.id === itemId)
      if (!def) return

      const itemCont = this.scene.add.container(pos.x, pos.y)
      const bg = this.scene.add.graphics()
      bg.fillStyle(0xffffff, 0.9).fillCircle(0, 0, 18)
      bg.lineStyle(2, 0x663d63, 0.6).strokeCircle(0, 0, 18)
      PropRenderer.drawProp(bg, itemId, 0, 0, 0.7)

      itemCont.add(bg).setSize(36, 36).setInteractive({ useHandCursor: true })
      itemCont.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
        ptr.event.stopPropagation()
        this.retrieveItem(idx)
      })

      this.interiorContainer.add(itemCont)
      this.itemIcons.push(itemCont)
    })
  }

  private retrieveItem(index: number): void {
    if (index < 0 || index >= this.storedItems.length) return
    const [retrieved] = this.storedItems.splice(index, 1)
    if (!retrieved) return

    audioManager.play('pickup')
    const def = ITEM_DEFINITIONS.find((it) => it.id === retrieved)
    showToast(`Took ${def?.name ?? 'item'} from fridge!`)
    this.refreshStoredItems()
    this.options.onItemRetrieved(retrieved, this.x + 120, this.y + 40)
    this.options.onStateChange?.()
  }
}

