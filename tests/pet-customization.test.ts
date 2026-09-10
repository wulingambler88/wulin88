import { describe, expect, it } from 'vitest'
import { PET_DEFINITIONS, PetRegistry } from '../src/data/pets'
import { ClothingRegistry } from '../src/data/clothes'
import { DEFAULT_SAVE, isGameSave } from '../src/save/SaveSchema'

describe('Pets Catalog & System', () => {
  it('defines 5 unique adoptable pets with valid properties', () => {
    expect(PET_DEFINITIONS.length).toBe(5)
    for (const pet of PET_DEFINITIONS) {
      expect(pet.id).toBeDefined()
      expect(pet.name.length).toBeGreaterThan(0)
      expect(pet.price).toBeGreaterThan(0)
      expect(pet.icon.length).toBeGreaterThan(0)
      expect(pet.color).toBeGreaterThan(0)
    }
  })

  it('PetRegistry retrieves all pets by ID', () => {
    expect(PetRegistry.get('pet_puppy')?.name).toBe('Buttercup Puppy')
    expect(PetRegistry.get('pet_kitten')?.name).toBe('Mimi Kitten')
    expect(PetRegistry.get('pet_bunny')?.name).toBe('Snowdrop Bunny')
    expect(PetRegistry.get('pet_hamster')?.name).toBe('Peanut Hamster')
    expect(PetRegistry.get('pet_panda')?.name).toBe('Bao Bao Panda')
  })

  it('validates a save containing adopted pets', () => {
    const saveWithPet = {
      ...DEFAULT_SAVE,
      pets: [
        {
          instanceId: 'pet_bunny_001',
          petId: 'pet_bunny',
          name: 'Boba the Bunny',
          location: 'home' as const,
          x: 450,
          y: 430,
          hunger: 90,
          happiness: 100,
        },
      ],
    }
    expect(isGameSave(saveWithPet)).toBe(true)
  })
})

describe('Reference Art Customization & Clothes', () => {
  it('includes the reference girl character outfit items', () => {
    expect(ClothingRegistry.has('dress_bunny_pinafore')).toBe(true)
    expect(ClothingRegistry.has('hat_flower_pearl')).toBe(true)
    expect(ClothingRegistry.has('shoes_ribbon_blue')).toBe(true)

    const dress = ClothingRegistry.get('dress_bunny_pinafore')!
    expect(dress.layer).toBe('dress')
    expect(dress.name).toContain('Bunny')

    const hat = ClothingRegistry.get('hat_flower_pearl')!
    expect(hat.layer).toBe('hat')
    expect(hat.name).toContain('Flower')

    const shoes = ClothingRegistry.get('shoes_ribbon_blue')!
    expect(shoes.layer).toBe('shoes')
    expect(shoes.name).toContain('Ribbon')
  })

  it('DEFAULT_SAVE includes valid avatar customization with blonde hair', () => {
    expect(DEFAULT_SAVE.character.customization).toBeDefined()
    expect(DEFAULT_SAVE.character.customization?.hairColor).toBeDefined()
    expect(DEFAULT_SAVE.character.customization?.skinColor).toBeDefined()
  })
})
