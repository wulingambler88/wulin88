import Phaser from 'phaser'
import { CLOTHING_DEFINITIONS, ClothingRegistry } from '../data/clothes'
import { ITEM_DEFINITIONS, getItemDefinition, type ItemCategory } from '../data/items'
import { playerState } from '../state/PlayerState'
import type { InventoryManager } from './InventoryManager'

type PanelCategory = 'all' | 'food' | 'clothing' | 'toys' | 'furniture'
type SpawnCallback = (itemId: string, worldX: number, worldY: number) => boolean

class InventorySlot extends Phaser.GameObjects.Container {
  readonly itemId: string
  home = { x: 0, y: 0 }

  constructor(scene: Phaser.Scene, itemId: string, label: string, icon: string, quantity: number, x: number, y: number) {
    super(scene, x, y)
    this.itemId = itemId
    this.home = { x, y }
    const g = scene.add.graphics().fillStyle(0xffffff, .94).fillRoundedRect(-42, -39, 84, 78, 16).lineStyle(3, 0xffc7df).strokeRoundedRect(-42, -39, 84, 78, 16)
    const iconText = scene.add.text(0, -9, icon, { fontFamily: 'Segoe UI Emoji', fontSize: '28px' }).setOrigin(.5)
    const nameText = scene.add.text(0, 22, label, { fontFamily: 'Trebuchet MS', fontSize: '11px', color: '#754c72', fontStyle: 'bold' }).setOrigin(.5)
    this.add([g, iconText, nameText])
    if (quantity > 1) this.add(scene.add.text(31, -29, String(quantity), { fontFamily: 'Trebuchet MS', fontSize: '12px', color: '#ffffff', backgroundColor: '#754c72', padding: { x: 5, y: 2 } }).setOrigin(.5))
    this.setSize(84, 78).setInteractive({ useHandCursor: true })
  }
}

export class InventoryPanel extends Phaser.GameObjects.Container {
  private readonly inventory: InventoryManager
  private readonly onSpawn: SpawnCallback
  private category: PanelCategory = 'all'
  private open = false
  private readonly openY = 374
  private readonly closedY = 530

  constructor(scene: Phaser.Scene, inventory: InventoryManager, onSpawn: SpawnCallback) {
    super(scene, 0, 530)
    this.inventory = inventory
    this.onSpawn = onSpawn
    scene.add.existing(this)
    this.setScrollFactor(0).setDepth(5000)
    this.renderPanel()
    this.bindDragging()
  }

  toggle(force?: boolean): void {
    this.open = force ?? !this.open
    this.scene.tweens.add({ targets: this, y: this.open ? this.openY : this.closedY, duration: 220, ease: 'Cubic.Out' })
  }

  isOpen(): boolean { return this.open }
  dropY(): number | undefined { return this.open ? this.openY : undefined }
  refresh(): void { this.renderPanel() }

  private renderPanel(): void {
    this.removeAll(true)
    const bg = this.scene.add.graphics().fillStyle(0xfff8e9, .98).fillRoundedRect(8, 0, 944, 166, 24).lineStyle(4, 0xffffff).strokeRoundedRect(8, 0, 944, 166, 24)
    this.add(bg)
    const categories: readonly PanelCategory[] = ['all', 'food', 'clothing', 'toys', 'furniture']
    categories.forEach((category, index) => {
      const active = category === this.category
      const tab = this.scene.add.text(34 + index * 104, 17, category.toUpperCase(), { fontFamily: 'Trebuchet MS', fontSize: '13px', color: active ? '#ffffff' : '#754c72', fontStyle: 'bold', backgroundColor: active ? '#dd5ca0' : '#f4dbe8', padding: { x: 11, y: 7 } }).setInteractive({ useHandCursor: true })
      tab.on('pointerdown', () => { this.category = category; this.renderPanel() })
      this.add(tab)
    })
    const entries = this.visibleEntries().slice(0, 9)
    entries.forEach((entry, index) => {
      const slot = new InventorySlot(this.scene, entry.id, entry.name, entry.icon, entry.quantity, 58 + index * 100, 104)
      this.scene.input.setDraggable(slot)
      this.add(slot)
    })
    if (entries.length === 0) this.add(this.scene.add.text(480, 104, 'Nothing here yet', { fontFamily: 'Trebuchet MS', fontSize: '18px', color: '#9a7895' }).setOrigin(.5))
  }

  private visibleEntries(): Array<{ id: string; name: string; icon: string; quantity: number; category: ItemCategory | 'clothing' }> {
    const itemEntries = ITEM_DEFINITIONS.filter((item) => this.inventory.quantity(item.id) > 0).map((item) => ({ id: item.id, name: item.name, icon: item.icon, quantity: this.inventory.quantity(item.id), category: item.category }))
    const clothingEntries = CLOTHING_DEFINITIONS.filter((item) => playerState.ownsClothing(item.id)).map((item) => ({
      id: item.id,
      name: item.name,
      icon: item.layer === 'hat' ? '🎩' : item.layer === 'dress' ? '👗' : item.layer === 'bottom' ? '🩳' : item.layer === 'shoes' ? '👟' : item.layer === 'accessory' ? '👓' : '👕',
      quantity: 1,
      category: 'clothing' as const,
    }))
    const all = [...itemEntries, ...clothingEntries]
    return this.category === 'all' ? all : all.filter((item) => item.category === this.category)
  }

  private bindDragging(): void {
    this.scene.input.on(Phaser.Input.Events.DRAG_START, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (!(object instanceof InventorySlot)) return
      object.setScale(1.1).setDepth(20)
    })
    this.scene.input.on(Phaser.Input.Events.DRAG, (pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (!(object instanceof InventorySlot)) return
      object.setPosition(pointer.x, pointer.y - this.y)
    })
    this.scene.input.on(Phaser.Input.Events.DRAG_END, (pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (!(object instanceof InventorySlot)) return
      object.setScale(1).setDepth(0)
      const worldX = pointer.worldX
      const worldY = pointer.worldY
      const clothing = ClothingRegistry.has(object.itemId)
      const item = getItemDefinition(object.itemId)
      const canSpawn = pointer.y < this.openY && (clothing || item !== undefined)
      if (canSpawn && this.onSpawn(object.itemId, worldX, worldY)) {
        this.renderPanel()
      } else {
        this.scene.tweens.add({ targets: object, x: object.home.x, y: object.home.y, duration: 180, ease: 'Back.Out' })
      }
    })
  }
}
