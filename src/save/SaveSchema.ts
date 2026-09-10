import { FURNITURE_DEFINITIONS } from '../data/furniture'
import { DEFAULT_OUTFIT, type EquippedClothing } from '../characters/ClothingManager'
import type { InventoryState } from '../inventory/InventoryManager'
import type { RoomItemPlacement } from '../items/ItemManager'
import type { FurniturePlacement } from '../furniture/FurnitureManager'
import type { LocationId } from '../data/locations'

export const SAVE_VERSION = 5
export const LAYOUT_VERSION = 1
export const DEFAULT_FRIDGE: readonly string[] = ['milk_01', 'strawberry_01', 'ice_cream_01']
export type DurableCharacterState = 'standing' | 'sitting' | 'sleeping'

export type HairStyleName = 'twin_buns' | 'long_waves' | 'ponytail' | 'bob' | 'pixie'

export interface AvatarCustomization {
  skinColor: number
  hairStyle: HairStyleName
  hairColor: number
  eyeColor: number
  blushColor: number
}

export interface CharacterStats { happiness: number; energy: number; hunger: number; fun: number }
export interface CharacterSave {
  x: number
  y: number
  state: DurableCharacterState
  equipped: EquippedClothing
  stats: CharacterStats
  customization?: AvatarCustomization
  heldItemId?: string
}

export interface AdoptedPet {
  instanceId: string
  petId: string
  name: string
  location: LocationId
  x: number
  y: number
  hunger: number
  happiness: number
}

export interface GameSettings { muted: boolean; musicVolume: number; sfxVolume: number; showAnchors: boolean; reducedMotion: boolean }
export interface GameProgress { firstBoutiqueVisit: boolean; firstCheckout: boolean; firstPetAdopted?: boolean }
export interface GameSave {
  saveVersion: number
  layoutVersion: number
  starCoins: number
  currentLocation: LocationId
  currentRoom: 0 | 1 | 2
  character: CharacterSave
  inventory: InventoryState
  ownedClothing: string[]
  unlockedLocations: Record<string, boolean>
  progress: GameProgress
  roomItems: RoomItemPlacement[]
  furniture: FurniturePlacement[]
  settings: GameSettings
  pets: AdoptedPet[]
  minigames: Record<string, number>
  fridge?: string[]
}

const defaultFurniture: FurniturePlacement[] = FURNITURE_DEFINITIONS.map((item) => ({ instanceId: item.id, definitionId: item.id, x: item.x, y: item.y, rotation: 0 }))

export const DEFAULT_SAVE: GameSave = {
  saveVersion: SAVE_VERSION,
  layoutVersion: LAYOUT_VERSION,
  starCoins: 500,
  currentLocation: 'home',
  currentRoom: 0,
  character: {
    x: 620,
    y: 430,
    state: 'standing',
    equipped: { ...DEFAULT_OUTFIT },
    stats: { happiness: 80, energy: 80, hunger: 70, fun: 80 },
    customization: { skinColor: 0xffe5d6, hairStyle: 'long_waves', hairColor: 0xffe8a3, eyeColor: 0x663d63, blushColor: 0xff8fc4 },
  },
  inventory: { teddy_01: 1, banana_01: 2 },
  ownedClothing: ['dress_bunny_pinafore', 'hat_flower_pearl', 'shoes_ribbon_blue', 'top_strawberry', 'bottom_mint'],
  unlockedLocations: {
    town: true,
    home: true,
    clothing_boutique: true,
    supermarket: true,
    pet_shop: true,
    school: true,
    park: true,
    cafe: true,
    salon: true,
    toy_shop: true,
  },
  progress: { firstBoutiqueVisit: false, firstCheckout: false, firstPetAdopted: false },
  roomItems: [
    { instanceId: 'pillow_starter', itemId: 'pillow_01', x: 200, y: 320 },
    { instanceId: 'book_starter', itemId: 'book_01', x: 760, y: 420 },
    { instanceId: 'ball_starter', itemId: 'ball_01', x: 1460, y: 445 },
    { instanceId: 'apple_starter', itemId: 'apple_01', x: 2320, y: 330 },
    { instanceId: 'milk_starter', itemId: 'milk_01', x: 2380, y: 330 },
    { instanceId: 'juice_starter', itemId: 'juice_01', x: 2440, y: 330 },
    { instanceId: 'cake_starter', itemId: 'cake_01', x: 2500, y: 330 },
    { instanceId: 'cup_starter', itemId: 'cup_01', x: 2180, y: 350 },
  ],
  furniture: defaultFurniture,
  settings: { muted: false, musicVolume: .7, sfxVolume: .8, showAnchors: false, reducedMotion: false },
  pets: [],
  minigames: { supermarketScanner: 0, parkSandbox: 0 },
  fridge: [...DEFAULT_FRIDGE],
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null }

export function isGameSave(value: unknown): value is GameSave {
  if (!isRecord(value) || value.saveVersion !== SAVE_VERSION || value.layoutVersion !== LAYOUT_VERSION) return false
  const character = value.character
  return typeof value.starCoins === 'number' && value.starCoins >= 0
    && typeof value.currentLocation === 'string'
    && (value.currentRoom === 0 || value.currentRoom === 1 || value.currentRoom === 2)
    && isRecord(character) && typeof character.x === 'number' && typeof character.y === 'number'
    && ['standing', 'sitting', 'sleeping'].includes(String(character.state))
    && isRecord(character.equipped) && isRecord(character.stats)
    && isRecord(value.inventory) && Array.isArray(value.ownedClothing)
    && isRecord(value.unlockedLocations) && isRecord(value.progress)
    && Array.isArray(value.roomItems) && Array.isArray(value.furniture) && isRecord(value.settings)
    && Array.isArray(value.pets) && isRecord(value.minigames)
}

function migrateV2ToV3(value: Record<string, unknown>): Record<string, unknown> {
  const migrated = structuredClone(value)
  migrated.saveVersion = 3
  migrated.layoutVersion = LAYOUT_VERSION
  const furniture = Array.isArray(migrated.furniture) ? migrated.furniture : []
  const oldFurniture: Record<string, [number, number]> = { chair_main: [355, 365], wardrobe_main: [505, 300], rug_main: [320, 465], sofa_main: [770, 370], plant_main: [1140, 380], bookshelf_main: [670, 315], tv_main: [1045, 330], table_main: [1510, 390] }
  const nextFurniture = new Map(DEFAULT_SAVE.furniture.map((item) => [item.definitionId, item]))
  migrated.furniture = furniture.map((raw) => {
    if (!isRecord(raw) || typeof raw.definitionId !== 'string') return raw
    const old = oldFurniture[raw.definitionId]
    const next = nextFurniture.get(raw.definitionId)
    return old && next && raw.x === old[0] && raw.y === old[1] ? { ...raw, x: next.x, y: next.y } : raw
  })
  return migrated
}

function migrateV3ToV4(value: Record<string, unknown>): Record<string, unknown> {
  const migrated = structuredClone(value)
  migrated.saveVersion = 4
  migrated.layoutVersion = LAYOUT_VERSION
  migrated.starCoins = typeof value.starCoins === 'number' && value.starCoins >= 0 ? Math.floor(value.starCoins) : 500
  migrated.ownedClothing = Array.from(new Set([
    ...DEFAULT_SAVE.ownedClothing,
    ...(Array.isArray(value.ownedClothing) ? value.ownedClothing.filter((id): id is string => typeof id === 'string') : []),
    ...Object.values((isRecord(value.character) && isRecord(value.character.equipped)) ? value.character.equipped : {}).filter((id): id is string => typeof id === 'string'),
  ]))
  const unlocked = isRecord(value.unlockedLocations) ? Object.fromEntries(Object.entries(value.unlockedLocations).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean')) : {}
  migrated.unlockedLocations = { ...DEFAULT_SAVE.unlockedLocations, ...unlocked }
  migrated.progress = { ...DEFAULT_SAVE.progress, ...(isRecord(value.progress) ? value.progress : {}) }
  migrated.settings = { ...DEFAULT_SAVE.settings, ...(isRecord(value.settings) ? value.settings : {}) }
  if (isRecord(value.inventory)) {
    migrated.inventory = { ...(value.inventory as Record<string, number>) }
  }
  return migrated
}

function migrateV4ToV5(value: Record<string, unknown>): GameSave {
  const v4 = migrateV3ToV4(value)
  const migrated = { ...structuredClone(DEFAULT_SAVE), ...structuredClone(v4) } as unknown as GameSave
  migrated.saveVersion = SAVE_VERSION
  migrated.layoutVersion = LAYOUT_VERSION
  migrated.starCoins = typeof v4.starCoins === 'number' && v4.starCoins >= 0 ? Math.floor(v4.starCoins) : 500
  migrated.unlockedLocations = { ...DEFAULT_SAVE.unlockedLocations }
  migrated.pets = Array.isArray(value.pets) ? (value.pets as AdoptedPet[]) : []
  migrated.minigames = isRecord(value.minigames) ? (value.minigames as Record<string, number>) : { supermarketScanner: 0, parkSandbox: 0 }
  if (isRecord(value.character) && isRecord((value.character as Record<string, unknown>).customization)) {
    migrated.character.customization = (value.character as Record<string, unknown>).customization as unknown as AvatarCustomization
  } else {
    migrated.character.customization = { ...DEFAULT_SAVE.character.customization! }
  }
  return migrated
}

export function migrateSave(value: unknown): GameSave | undefined {
  if (isGameSave(value)) {
    return {
      ...value,
      unlockedLocations: { ...DEFAULT_SAVE.unlockedLocations, ...value.unlockedLocations },
      fridge: Array.isArray(value.fridge) ? value.fridge.filter((id): id is string => typeof id === 'string') : [...DEFAULT_FRIDGE],
    }
  }
  if (!isRecord(value)) return undefined
  if (value.saveVersion === 4) return migrateV4ToV5(value)
  if (value.saveVersion === 3) return migrateV4ToV5(migrateV3ToV4(value))
  if (value.saveVersion === 2) return migrateV4ToV5(migrateV3ToV4(migrateV2ToV3(value)))
  if (value.saveVersion !== 1 || !isRecord(value.character)) return undefined
  const pose = String(value.character.pose)
  const state: DurableCharacterState = pose === 'sitting' || pose === 'sleeping' ? pose : 'standing'
  const v3: Record<string, unknown> = {
    ...structuredClone(DEFAULT_SAVE),
    saveVersion: 3,
    starCoins: typeof value.starCoins === 'number' && value.starCoins >= 0 ? value.starCoins : DEFAULT_SAVE.starCoins,
    currentLocation: value.currentLocation === 'home' ? 'home' : 'town',
    character: {
      ...structuredClone(DEFAULT_SAVE.character),
      x: typeof value.character.x === 'number' ? value.character.x : DEFAULT_SAVE.character.x,
      y: typeof value.character.y === 'number' ? value.character.y : DEFAULT_SAVE.character.y,
      state,
    },
  }
  return migrateV4ToV5(migrateV3ToV4(v3))
}
