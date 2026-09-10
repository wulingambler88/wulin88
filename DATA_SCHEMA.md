# Data Schemas

## Save V5

```ts
interface GameSaveV5 {
  saveVersion: 5
  layoutVersion: 1
  starCoins: number
  currentLocation: 'town' | 'home' | 'clothing_boutique' | 'supermarket' | 'pet_shop' | 'cafe' | 'school' | 'park' | 'salon' | 'toy_shop'
  currentRoom: 0 | 1 | 2
  character: {
    x: number
    y: number
    state: 'standing' | 'sitting' | 'sleeping'
    equipped: {
      top: string | null
      bottom: string | null
      dress: string | null
      hat: string | null
      shoes: string | null
      accessory: string | null
    }
    stats: { happiness: number; energy: number; hunger: number; fun: number }
    customization?: {
      skinColor: number
      hairStyle: 'twin_buns' | 'long_waves' | 'ponytail' | 'bob' | 'pixie'
      hairColor: number
      eyeColor: number
      blushColor: number
    }
  }
  inventory: Record<string, number>
  ownedClothing: string[]
  pets: Array<{
    instanceId: string
    petId: string
    name: string
    location: LocationId
    x: number
    y: number
    hunger: number
    happiness: number
  }>
  minigames: Record<string, number>
  unlockedLocations: Record<string, boolean>
  progress: { firstBoutiqueVisit: boolean; firstCheckout: boolean; firstPetAdopted?: boolean }
  roomItems: Array<{ instanceId: string; itemId: string; x: number; y: number }>
  furniture: Array<{ instanceId: string; definitionId: string; x: number; y: number; rotation: number }>
  settings: { muted: boolean; musicVolume: number; sfxVolume: number; showAnchors: boolean; reducedMotion: boolean }
}
```

The loader validates and normalizes every field, falls back safely to defaults, and migrates older saves sequentially (V1→V2→V3→V4→V5). Writes are debounced after meaningful actions or saved immediately on purchase/checkout/equip/adopt.

## Pet definition

```ts
interface PetDefinition {
  id: string
  name: string
  species: 'puppy' | 'kitten' | 'bunny' | 'hamster' | 'panda'
  icon: string
  color: number
  accent: number
  price: number
  favoriteFood: string
  sound: string
  description: string
}
```

## Clothing definition

```ts
interface ClothingDefinition {
  id: string
  name: string
  layer: 'top' | 'bottom' | 'dress' | 'hat' | 'shoes' | 'accessory'
  color: number
  accent: number
  price: number
  shop: 'clothing_boutique'
  available: boolean
}
```

## Location definition

```ts
interface LocationDefinition {
  id: LocationId
  name: string
  shortName: string
  sceneKey?: string
  icon: string
  status: 'unlocked' | 'locked' | 'comingSoon'
  x: number
  y: number
  color: number
}
```

## Item definition

```ts
interface ItemDefinition {
  id: string
  name: string
  category: 'food' | 'toys' | 'other' | 'clothing' | 'furniture'
  icon: string
  color: number
  draggable: boolean
  stackable: boolean
  maxStack: number
  interactions: readonly ('pickup' | 'place' | 'eat' | 'play' | 'wear')[]
  tags: readonly string[]
  metadata: Readonly<Record<string, string | number | boolean>>
  price?: number
  shop?: 'supermarket'
}
```

Item, clothing, location, and furniture catalogs live in `src/data` and are consumed by generic managers. Furniture definitions also carry type, edit/rotation flags, dimensions, and precise interaction anchors.

