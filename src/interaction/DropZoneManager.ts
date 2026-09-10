import type { DurableCharacterState } from '../save/SaveSchema'

export interface DropZoneDefinition {
  id: 'floor' | 'chair' | 'bed'
  x: number
  y: number
  width: number
  height: number
  pose: DurableCharacterState
  snapX?: number
  snapY?: number
  priority: number
}

export interface Point { x: number; y: number }

export function containsPoint(zone: DropZoneDefinition, point: Point): boolean {
  return point.x >= zone.x && point.x <= zone.x + zone.width
    && point.y >= zone.y && point.y <= zone.y + zone.height
}

export function resolveDropZone(zones: readonly DropZoneDefinition[], point: Point): DropZoneDefinition | undefined {
  return zones.filter((zone) => containsPoint(zone, point)).sort((a, b) => b.priority - a.priority)[0]
}
