import Phaser from 'phaser'
import { Pet } from './Pet'
import type { AdoptedPet } from '../save/SaveSchema'
import type { LocationId } from '../data/locations'
import { showToast } from '../ui/UIManager'
import { audioManager } from '../audio/AudioManager'

interface PetManagerOptions {
  location: LocationId
  onChange: (pets: AdoptedPet[]) => void
}

export class PetManager {
  private readonly scene: Phaser.Scene
  private readonly options: PetManagerOptions
  private pets: Pet[] = []

  constructor(scene: Phaser.Scene, petsData: readonly AdoptedPet[], options: PetManagerOptions) {
    this.scene = scene
    this.options = options
    const filtered = petsData.filter((p) => p.location === options.location)
    for (const data of filtered) {
      this.create(data)
    }
    this.bindInput()
  }

  create(data: AdoptedPet): Pet {
    const pet = new Pet(this.scene, data)
    this.pets.push(pet)
    return pet
  }

  all(): readonly Pet[] { return this.pets }

  handleItemOnPet(itemX: number, itemY: number, hunger = 20): boolean {
    for (const pet of this.pets) {
      if (Phaser.Math.Distance.Between(itemX, itemY, pet.x, pet.y) <= 65) {
        pet.feed(hunger)
        audioManager.play('eat')
        showToast(`${pet.definition.name} loved the treat! ♥`)
        this.options.onChange(this.snapshotAll())
        return true
      }
    }
    return false
  }

  snapshotAll(): AdoptedPet[] {
    return this.pets.map((pet) => pet.toData(this.options.location))
  }

  private followingPetId?: string

  isFollowing(): boolean {
    return Boolean(this.followingPetId)
  }

  toggleFollow(target?: { x: number; y: number }): boolean {
    if (this.pets.length === 0) {
      showToast('Adopt a pet from the Pet Shop first! 🐾')
      return false
    }

    if (this.followingPetId) {
      this.followingPetId = undefined
      audioManager.play('drop')
      showToast('Pet companion is staying here to rest! 💤')
      return false
    }

    const companion = this.pets[0]!
    this.followingPetId = companion.instanceId
    audioManager.play('chime')
    showToast(`${companion.definition.name} is now happily following you! 🐾♥`)

    if (target) {
      this.stepFollow(target)
    }
    return true
  }

  updateFollow(targetX: number, targetY: number): void {
    if (!this.followingPetId) return
    const pet = this.pets.find((p) => p.instanceId === this.followingPetId)
    if (!pet) return

    const dist = Phaser.Math.Distance.Between(pet.x, pet.y, targetX, targetY)
    if (dist > 85) {
      const angle = Phaser.Math.Angle.Between(pet.x, pet.y, targetX, targetY)
      pet.x += Math.cos(angle) * 3.5
      pet.y += Math.sin(angle) * 3.5
      // Cute hop bounce
      pet.y += Math.sin(Date.now() / 120) * 1.5
      pet.setDepth(150 + Math.round(pet.y))
    }
  }

  private stepFollow(target: { x: number; y: number }): void {
    this.updateFollow(target.x, target.y)
  }

  private bindInput(): void {
    let dragged = false
    this.scene.input.on(Phaser.Input.Events.DRAG_START, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (!(object instanceof Pet)) return
      dragged = true
      object.lastValid = { x: object.x, y: object.y }
      object.setScale(1.1).setDepth(4500)
    })

    this.scene.input.on(Phaser.Input.Events.DRAG, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject, x: number, y: number) => {
      if (!(object instanceof Pet)) return
      object.setPosition(Phaser.Math.Clamp(x, 40, 2840), Phaser.Math.Clamp(y, 220, 500))
    })

    this.scene.input.on(Phaser.Input.Events.DRAG_END, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (!(object instanceof Pet)) return
      object.setScale(1)
      object.setDepth(150 + Math.round(object.y))
      object.lastValid = { x: object.x, y: object.y }
      audioManager.play('drop')
      this.options.onChange(this.snapshotAll())
      this.scene.time.delayedCall(50, () => { dragged = false })
    })

    this.scene.input.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.GameObject) => {
      if (object instanceof Pet && !dragged) {
        object.petAnimal()
        audioManager.play('button')
        showToast(`Petted ${object.definition.name}! ♥`)
        this.options.onChange(this.snapshotAll())
        this.scene.game.events.emit('character:pet-reacted')
      }
    })
  }
}
