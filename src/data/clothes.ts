export type ClothingLayer = 'top' | 'bottom' | 'dress' | 'hat' | 'shoes' | 'accessory'

export interface ClothingDefinition {
  id: string
  name: string
  layer: ClothingLayer
  color: number
  accent: number
  price: number
  shop: 'clothing_boutique'
  available: boolean
  icon?: string
}

export const CLOTHING_DEFINITIONS: readonly ClothingDefinition[] = [
  // Signature Boutique Rack Dresses (Illustrated)
  { id: 'dress_blue_daisy', name: 'Blue Daisy Pinafore', layer: 'dress', color: 0x7eb2df, accent: 0xffffff, price: 65, shop: 'clothing_boutique', available: true, icon: 'art/clothing/dress-blue-daisy.webp' },
  { id: 'dress_yellow_sunshine', name: 'Sunshine Tiered Dress', layer: 'dress', color: 0xffe270, accent: 0xffffff, price: 70, shop: 'clothing_boutique', available: true, icon: 'art/clothing/dress-yellow-sunshine.webp' },
  { id: 'dress_pink_gingham', name: 'Pink Gingham Bow Dress', layer: 'dress', color: 0xff9ec7, accent: 0xffffff, price: 75, shop: 'clothing_boutique', available: true, icon: 'art/clothing/dress-pink-gingham.webp' },
  { id: 'dress_mint_floral', name: 'Mint Meadow Dress', layer: 'dress', color: 0x78c99b, accent: 0xffffff, price: 68, shop: 'clothing_boutique', available: true, icon: 'art/clothing/dress-mint-floral.webp' },
  { id: 'dress_lavender_ruffle', name: 'Lavender Ruffled Dress', layer: 'dress', color: 0xb59fe8, accent: 0xffffff, price: 80, shop: 'clothing_boutique', available: true, icon: 'art/clothing/dress-lavender-ruffle.webp' },

  // Boutique Shoes (Illustrated)
  { id: 'shoes_pink_maryjane', name: 'Pink Mary Janes', layer: 'shoes', color: 0xff9ec7, accent: 0xffffff, price: 35, shop: 'clothing_boutique', available: true, icon: 'art/clothing/shoes-pink-maryjane.webp' },
  { id: 'shoes_yellow_strap', name: 'Yellow Strap Pumps', layer: 'shoes', color: 0xffd96f, accent: 0xffffff, price: 35, shop: 'clothing_boutique', available: true, icon: 'art/clothing/shoes-yellow-strap.webp' },
  { id: 'shoes_white_ribbon', name: 'White Ribbon Flats', layer: 'shoes', color: 0xffffff, accent: 0xf5e6ea, price: 38, shop: 'clothing_boutique', available: true, icon: 'art/clothing/shoes-white-ribbon.webp' },

  // Original Wardrobe Items
  { id: 'top_strawberry', name: 'Strawberry Top', layer: 'top', color: 0xff8fc4, accent: 0xffffff, price: 28, shop: 'clothing_boutique', available: true },
  { id: 'top_sunshine', name: 'Sunshine Top', layer: 'top', color: 0xffd96f, accent: 0xff8fc4, price: 30, shop: 'clothing_boutique', available: true },
  { id: 'top_mint', name: 'Mint Top', layer: 'top', color: 0x8fdcc8, accent: 0xffffff, price: 32, shop: 'clothing_boutique', available: true },
  { id: 'top_cloud_blue', name: 'Cloud Shirt', layer: 'top', color: 0x79c7ec, accent: 0xffffff, price: 36, shop: 'clothing_boutique', available: true },
  { id: 'top_rose_stripe', name: 'Rose Stripe Top', layer: 'top', color: 0xf08db5, accent: 0xffe7f1, price: 42, shop: 'clothing_boutique', available: true },
  { id: 'bottom_mint', name: 'Mint Shorts', layer: 'bottom', color: 0x8ad7ca, accent: 0xffffff, price: 25, shop: 'clothing_boutique', available: true },
  { id: 'bottom_denim', name: 'Sky Jeans', layer: 'bottom', color: 0x79b7df, accent: 0xffffff, price: 34, shop: 'clothing_boutique', available: true },
  { id: 'bottom_lavender', name: 'Lavender Skirt', layer: 'bottom', color: 0xb69be8, accent: 0xffffff, price: 38, shop: 'clothing_boutique', available: true },
  { id: 'bottom_cocoa', name: 'Cocoa Trousers', layer: 'bottom', color: 0xb58674, accent: 0xffe8db, price: 40, shop: 'clothing_boutique', available: true },
  { id: 'dress_peach', name: 'Peach Dress', layer: 'dress', color: 0xffae92, accent: 0xffffff, price: 55, shop: 'clothing_boutique', available: true },
  { id: 'dress_star', name: 'Star Dress', layer: 'dress', color: 0x9d8ae8, accent: 0xffe47a, price: 72, shop: 'clothing_boutique', available: true },
  { id: 'dress_meadow', name: 'Meadow Dress', layer: 'dress', color: 0x80d6aa, accent: 0xffffdd, price: 64, shop: 'clothing_boutique', available: true },
  { id: 'hat_beret', name: 'Berry Beret', layer: 'hat', color: 0xc56898, accent: 0xffffff, price: 35, shop: 'clothing_boutique', available: true },
  { id: 'hat_sun', name: 'Sunny Hat', layer: 'hat', color: 0xffd96f, accent: 0xff8fc4, price: 40, shop: 'clothing_boutique', available: true },
  { id: 'hat_cat', name: 'Cat Ear Headband', layer: 'hat', color: 0xff9fbe, accent: 0xffffff, price: 48, shop: 'clothing_boutique', available: true },
  { id: 'hat_cloud', name: 'Cloud Cap', layer: 'hat', color: 0xaedff4, accent: 0xffffff, price: 44, shop: 'clothing_boutique', available: true },
  { id: 'shoes_mint', name: 'Mint Sneakers', layer: 'shoes', color: 0x8ad7ca, accent: 0xffffff, price: 30, shop: 'clothing_boutique', available: true },
  { id: 'shoes_strawberry', name: 'Berry Shoes', layer: 'shoes', color: 0xff7fac, accent: 0xffffff, price: 34, shop: 'clothing_boutique', available: true },
  { id: 'shoes_star', name: 'Star Boots', layer: 'shoes', color: 0x8f80d8, accent: 0xffe47a, price: 52, shop: 'clothing_boutique', available: true },
  { id: 'dress_bunny_pinafore', name: 'Bunny Pinafore Dress', layer: 'dress', color: 0xbeddf2, accent: 0xfff9ea, price: 65, shop: 'clothing_boutique', available: true, icon: 'art/clothing/dress-blue-daisy.webp' },
  { id: 'hat_flower_pearl', name: 'Flower Pearl Wreath', layer: 'hat', color: 0xffd96f, accent: 0xffffff, price: 42, shop: 'clothing_boutique', available: true },
  { id: 'shoes_ribbon_blue', name: 'Pastel Ribbon Shoes', layer: 'shoes', color: 0xbfe3f7, accent: 0xffffff, price: 32, shop: 'clothing_boutique', available: true, icon: 'art/clothing/shoes-white-ribbon.webp' },
  { id: 'glasses_heart', name: 'Heart Glasses', layer: 'accessory', color: 0xff75a8, accent: 0xffffff, price: 45, shop: 'clothing_boutique', available: true },
  { id: 'accessory_star_pin', name: 'Star Pin', layer: 'accessory', color: 0xffd34f, accent: 0xffffff, price: 24, shop: 'clothing_boutique', available: true },
  { id: 'hat_detective_cap', name: 'Detective Deerstalker', layer: 'hat', color: 0xc4a482, accent: 0x5a3d28, price: 0, shop: 'clothing_boutique', available: false },
  { id: 'dress_detective_cape', name: 'Detective Trench & Cape', layer: 'dress', color: 0xb58a63, accent: 0xffd166, price: 0, shop: 'clothing_boutique', available: false },
  { id: 'hat_star_tiara', name: 'Royal Starlight Tiara', layer: 'hat', color: 0xffd700, accent: 0xffffff, price: 0, shop: 'clothing_boutique', available: false },
  { id: 'hat_pirate_bandana', name: 'Captain Pirate Bandana', layer: 'hat', color: 0xd90429, accent: 0xffd700, price: 0, shop: 'clothing_boutique', available: false },
]

export const ClothingRegistry = new Map(CLOTHING_DEFINITIONS.map((item) => [item.id, item]))
