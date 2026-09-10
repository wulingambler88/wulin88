import { describe, expect, it } from 'vitest'
import { resolveDropZone, type DropZoneDefinition } from '../src/interaction/DropZoneManager'

const zones: readonly DropZoneDefinition[] = [
  { id: 'floor', x: 0, y: 100, width: 300, height: 200, pose: 'standing', priority: 1 },
  { id: 'chair', x: 50, y: 120, width: 100, height: 100, pose: 'sitting', priority: 3 },
]

describe('resolveDropZone', () => {
  it('prefers a furniture zone over an overlapping floor zone', () => {
    expect(resolveDropZone(zones, { x: 80, y: 150 })?.id).toBe('chair')
  })

  it('returns undefined for an invalid drop', () => {
    expect(resolveDropZone(zones, { x: 400, y: 30 })).toBeUndefined()
  })
})
