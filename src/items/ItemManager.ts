import Phaser from 'phaser'
import { getItemDefinition } from './ItemRegistry'
import { Item } from './Item'

export interface RoomItemPlacement { instanceId: string; itemId: string; x: number; y: number }

interface ItemManagerOptions {
  inventoryDropY: () => number | undefined
  onPickup: (itemId: string) => void
  onCharacterDrop: (item: Item) => boolean
  onChange: (items: RoomItemPlacement[]) => void
}

export class ItemManager {
  private readonly scene: Phaser.Scene
  private readonly options: ItemManagerOptions
  private items: Item[] = []

  constructor(scene: Phaser.Scene, placements: readonly RoomItemPlacement[], options: ItemManagerOptions) {
    this.scene = scene
    this.options = options
    for (const placement of placements) this.create(placement.itemId, placement.x, placement.y, placement.instanceId)
    this.bindInput()
  }

  create(itemId: string, x: number, y: number, instanceId = `${itemId}_${Date.now()}`): Item | undefined {
    const definition = getItemDefinition(itemId)
    if (!definition || definition.category === 'furniture') return undefined
    const item = new Item(this.scene, instanceId, definition, x, y)
    this.items.push(item)
    return item
  }

  remove(item: Item): void {
    this.items = this.items.filter((entry) => entry !== item)
    item.destroy(true)
    this.options.onChange(this.snapshot())
  }

  all(): readonly Item[] { return this.items }
  setDraggable(active: boolean): void { for (const item of this.items) this.scene.input.setDraggable(item, active) }
  snapshot(): RoomItemPlacement[] { return this.items.map((item) => ({ instanceId: item.instanceId, itemId: item.definition.id, x: item.x, y: item.y })) }

  private bindInput(): void {
    this.scene.input.on(Phaser.Input.Events.DRAG_START, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (!(object instanceof Item)) return
      object.lastValid = { x: object.x, y: object.y }
      object.setScale(1.12).setDepth(1200)
    })
    this.scene.input.on(Phaser.Input.Events.DRAG, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject, x: number, y: number) => {
      if (!(object instanceof Item)) return
      // BUG-13 fix: clamp the drag floor to 220 (the same bound DRAG_END uses
      // to validate placement) so an item can never rest in the 190-219 dead
      // zone and then snap back unexpectedly on release.
      object.setPosition(Phaser.Math.Clamp(x, 35, 2845), Phaser.Math.Clamp(y, 220, 500))
    })
    this.scene.input.on(Phaser.Input.Events.DRAG_END, (pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (!(object instanceof Item)) return
      object.setScale(1)
      object.setDepth(100 + Math.round(object.y))
      const inventoryY = this.options.inventoryDropY()
      if (inventoryY !== undefined && pointer.y >= inventoryY) {
        this.options.onPickup(object.definition.id)
        this.remove(object)
        return
      }
      if (this.options.onCharacterDrop(object)) return
      if (object.y < 220 || object.y > 500) {
        this.scene.tweens.add({ targets: object, x: object.lastValid.x, y: object.lastValid.y, duration: 220, ease: 'Back.Out' })
        return
      }
      object.lastValid = { x: object.x, y: object.y }
      this.options.onChange(this.snapshot())
    })
  }
}
