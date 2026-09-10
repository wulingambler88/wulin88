import Phaser from 'phaser'
import { FURNITURE_DEFINITIONS, FurnitureRegistry, type FurnitureType } from '../data/furniture'
import { Furniture } from './Furniture'

export interface FurniturePlacement { instanceId: string; definitionId: string; x: number; y: number; rotation: number }
type ChangeCallback = (placements: FurniturePlacement[]) => void

export class FurnitureManager {
  private readonly scene: Phaser.Scene
  private readonly onChange: ChangeCallback
  private furniture: Furniture[] = []
  private history: FurniturePlacement[][] = []
  private future: FurniturePlacement[][] = []
  private editMode = false
  private selected?: Furniture

  constructor(scene: Phaser.Scene, placements: readonly FurniturePlacement[], onChange: ChangeCallback) {
    this.scene = scene
    this.onChange = onChange
    for (const placement of placements) this.createFromPlacement(placement)
    this.bindInput()
  }

  static defaults(): FurniturePlacement[] {
    return FURNITURE_DEFINITIONS.map((definition) => ({ instanceId: definition.id, definitionId: definition.id, x: definition.x, y: definition.y, rotation: 0 }))
  }

  setEditMode(active: boolean): void {
    this.editMode = active
    if (!active) { this.selected?.setSelected(false); this.selected = undefined }
    for (const item of this.furniture) this.scene.input.setDraggable(item, active)
  }

  isEditing(): boolean { return this.editMode }
  selectedId(): string | undefined { return this.selected?.instanceId }
  all(): readonly Furniture[] { return this.furniture }
  anchors(): ReturnType<Furniture['worldAnchors']> { return this.furniture.flatMap((item) => item.worldAnchors()) }
  snapshot(): FurniturePlacement[] { return this.furniture.map((item) => ({ instanceId: item.instanceId, definitionId: item.definition.id, x: item.x, y: item.y, rotation: item.rotation })) }

  add(type: FurnitureType, x: number, y: number): Furniture | undefined {
    const definition = FURNITURE_DEFINITIONS.find((entry) => entry.type === type)
    if (!definition) return undefined
    this.recordHistory()
    const placement = { instanceId: `${type}_${Date.now()}`, definitionId: definition.id, x, y, rotation: 0 }
    const item = this.createFromPlacement(placement)
    this.onChange(this.snapshot())
    return item
  }

  removeSelected(): FurnitureType | undefined {
    if (!this.selected) return undefined
    this.recordHistory()
    const type = this.selected.definition.type
    this.furniture = this.furniture.filter((item) => item !== this.selected)
    this.selected.destroy(true)
    this.selected = undefined
    this.onChange(this.snapshot())
    return type
  }

  undo(): void {
    const previous = this.history.pop()
    if (!previous) return
    this.future.push(this.snapshot())
    this.restore(previous)
  }

  redo(): void {
    const next = this.future.pop()
    if (!next) return
    this.history.push(this.snapshot())
    this.restore(next)
  }

  private createFromPlacement(placement: FurniturePlacement): Furniture {
    const definition = FurnitureRegistry.get(placement.definitionId) ?? FURNITURE_DEFINITIONS[0]!
    const item = new Furniture(this.scene, placement.instanceId, definition, placement.x, placement.y, placement.rotation)
    this.furniture.push(item)
    if (this.editMode) {
      this.scene.input.setDraggable(item, true)
    }
    return item
  }

  private recordHistory(): void { this.history.push(this.snapshot()); this.future = []; if (this.history.length > 20) this.history.shift() }

  private restore(placements: FurniturePlacement[]): void {
    for (const item of this.furniture) item.destroy(true)
    this.furniture = []
    for (const placement of placements) this.createFromPlacement(placement)
    this.setEditMode(this.editMode)
    this.onChange(this.snapshot())
  }

  private bindInput(): void {
    this.scene.input.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (!this.editMode || !(object instanceof Furniture)) return
      this.selected?.setSelected(false)
      this.selected = object
      object.setSelected(true)
    })
    this.scene.input.on(Phaser.Input.Events.DRAG_START, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (!this.editMode || !(object instanceof Furniture)) return
      this.recordHistory()
      object.setScale(1.04).setDepth(900)
    })
    this.scene.input.on(Phaser.Input.Events.DRAG, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject, x: number, y: number) => {
      if (!this.editMode || !(object instanceof Furniture)) return
      object.setPosition(Phaser.Math.Snap.To(Phaser.Math.Clamp(x, 35, 2845), 20), Phaser.Math.Snap.To(Phaser.Math.Clamp(y, 220, 485), 10))
    })
    this.scene.input.on(Phaser.Input.Events.DRAG_END, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (!this.editMode || !(object instanceof Furniture)) return
      object.setScale(1).setDepth(100 + Math.round(object.y))
      this.onChange(this.snapshot())
    })
  }
}
