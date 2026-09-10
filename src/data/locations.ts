export type LocationId = 'town' | 'home' | 'clothing_boutique' | 'supermarket' | 'pet_shop' | 'cafe' | 'school' | 'park' | 'salon' | 'toy_shop'
export type LocationStatus = 'unlocked' | 'locked' | 'comingSoon'

export interface LocationDefinition {
  id: LocationId
  name: string
  shortName: string
  sceneKey?: string
  icon: string
  status: LocationStatus
  x: number
  y: number
  color: number
}

export const LOCATION_DEFINITIONS: readonly LocationDefinition[] = [
  { id: 'home', name: 'Home', shortName: 'HOME', sceneKey: 'HomeScene', icon: '🏠', status: 'unlocked', x: 487, y: 272, color: 0xff91c7 },
  { id: 'clothing_boutique', name: 'Clothing Boutique', shortName: 'BOUTIQUE', sceneKey: 'ClothingShopScene', icon: '👗', status: 'unlocked', x: 232, y: 278, color: 0xcab8f1 },
  { id: 'supermarket', name: 'Supermarket', shortName: 'MARKET', sceneKey: 'SupermarketScene', icon: '🛒', status: 'unlocked', x: 735, y: 278, color: 0xa8ead7 },
  { id: 'pet_shop', name: 'Pet Shop', shortName: 'PET SHOP', sceneKey: 'PetShopScene', icon: '🐾', status: 'unlocked', x: 152, y: 136, color: 0xffb8d9 },
  { id: 'school', name: 'School', shortName: 'SCHOOL', sceneKey: 'SchoolScene', icon: '🏫', status: 'unlocked', x: 376, y: 133, color: 0xffd96f },
  { id: 'park', name: 'Park', shortName: 'PARK', sceneKey: 'ParkScene', icon: '🌳', status: 'unlocked', x: 609, y: 140, color: 0x9ee3b4 },
  { id: 'cafe', name: 'Café', shortName: 'CAFÉ', sceneKey: 'CafeScene', icon: '☕', status: 'unlocked', x: 834, y: 140, color: 0xffc5a5 },
  { id: 'salon', name: 'Salon', shortName: 'SALON', sceneKey: 'SalonScene', icon: '💇', status: 'unlocked', x: 785, y: 382, color: 0xbdeaf5 },
  { id: 'toy_shop', name: 'Toy Shop', shortName: 'TOY SHOP', sceneKey: 'ToyShopScene', icon: '🧸', status: 'unlocked', x: 177, y: 382, color: 0xffd6e9 },
]

const TOWN_LOCATION: LocationDefinition = { id: 'town', name: 'Town Map', shortName: 'TOWN', sceneKey: 'TownScene', icon: '🗺️', status: 'unlocked', x: 0, y: 0, color: 0xbdeaf5 }
export const LocationRegistry = new Map<LocationId, LocationDefinition>([[TOWN_LOCATION.id, TOWN_LOCATION], ...LOCATION_DEFINITIONS.map((location) => [location.id, location] as [LocationId, LocationDefinition])])
