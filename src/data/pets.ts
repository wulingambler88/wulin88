export type PetSpecies = 'puppy' | 'kitten' | 'bunny' | 'hamster' | 'panda'

export interface PetDefinition {
  id: string
  name: string
  species: PetSpecies
  icon: string
  color: number
  accent: number
  price: number
  favoriteFood: string
  sound: string
  description: string
}

export const PET_DEFINITIONS: readonly PetDefinition[] = [
  {
    id: 'pet_puppy',
    name: 'Buttercup Puppy',
    species: 'puppy',
    icon: '🐶',
    color: 0xffd98d,
    accent: 0xc88f4e,
    price: 120,
    favoriteFood: 'apple_01',
    sound: 'bark',
    description: 'A cheerful golden pup who wags its tail and loves cuddles.',
  },
  {
    id: 'pet_kitten',
    name: 'Mimi Kitten',
    species: 'kitten',
    icon: '🐱',
    color: 0xffb8d9,
    accent: 0xffffff,
    price: 130,
    favoriteFood: 'milk_01',
    sound: 'meow',
    description: 'A soft calico kitten that purrs when gently petted.',
  },
  {
    id: 'pet_bunny',
    name: 'Snowdrop Bunny',
    species: 'bunny',
    icon: '🐰',
    color: 0xffffff,
    accent: 0xffa8cc,
    price: 110,
    favoriteFood: 'strawberry_01',
    sound: 'squeak',
    description: 'A fluffy white bunny with cute twitchy ears and soft hops.',
  },
  {
    id: 'pet_hamster',
    name: 'Peanut Hamster',
    species: 'hamster',
    icon: '🐹',
    color: 0xf5b875,
    accent: 0xffeed2,
    price: 90,
    favoriteFood: 'cookies_01',
    sound: 'squeak',
    description: 'A tiny round hamster who stuffs its cheeks and scurries fast.',
  },
  {
    id: 'pet_panda',
    name: 'Bao Bao Panda',
    species: 'panda',
    icon: '🐼',
    color: 0xffffff,
    accent: 0x4a4453,
    price: 160,
    favoriteFood: 'cake_01',
    sound: 'squeak',
    description: 'A sweet baby panda who rolls around and loves taking naps.',
  },
]

export const PetRegistry = new Map<string, PetDefinition>(PET_DEFINITIONS.map((pet) => [pet.id, pet]))
export function getPetDefinition(id: string): PetDefinition | undefined { return PetRegistry.get(id) }
