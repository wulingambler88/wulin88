import type Phaser from 'phaser'
import { LocationRegistry, type LocationDefinition, type LocationId } from '../data/locations'

export class LocationManager {
  private transitioning = false
  private safetyTimer: ReturnType<typeof setTimeout> | null = null

  get(id: LocationId): LocationDefinition | undefined { return LocationRegistry.get(id) }
  isAvailable(id: LocationId, unlocked: Record<string, boolean>): boolean {
    const location = this.get(id)
    return Boolean(location?.sceneKey && location.status === 'unlocked' && unlocked[id])
  }
  status(id: LocationId): LocationDefinition['status'] | undefined { return this.get(id)?.status }

  navigate(scene: Phaser.Scene, id: LocationId, unlocked: Record<string, boolean>, onStart?: () => void): boolean {
    const location = this.get(id)
    if (this.transitioning || !location?.sceneKey || !this.isAvailable(id, unlocked)) {
      return false
    }
    this.transitioning = true
    onStart?.()

    if (this.safetyTimer) clearTimeout(this.safetyTimer)
    this.safetyTimer = setTimeout(() => {
      this.transitioning = false
    }, 500)

    try {
      scene.cameras.main.fadeOut(200, 255, 248, 233)
    } catch {
      // ignore
    }

    setTimeout(() => {
      if (this.safetyTimer) clearTimeout(this.safetyTimer)
      this.transitioning = false
      try {
        scene.scene.start(location.sceneKey!)
      } catch (err) {
        console.error('[LocationManager] Failed to start scene:', err)
      }
    }, 210)

    return true
  }

  resetLock(): void {
    if (this.safetyTimer) clearTimeout(this.safetyTimer)
    this.transitioning = false
  }
}

export const locationManager = new LocationManager()
