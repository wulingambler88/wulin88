export type ItemCategory = 'food' | 'toys' | 'other' | 'clothing' | 'furniture'

export interface ItemDefinition {
  id: string
  name: string
  category: ItemCategory
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

export const ITEM_DEFINITIONS: readonly ItemDefinition[] = [
  { id: 'apple_01', name: 'Apple', category: 'food', icon: '🍎', color: 0xf45f73, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'fruit'], metadata: { hunger: 15 }, price: 5, shop: 'supermarket' },
  { id: 'banana_01', name: 'Banana', category: 'food', icon: '🍌', color: 0xffd95a, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'fruit'], metadata: { hunger: 12 }, price: 4, shop: 'supermarket' },
  { id: 'milk_01', name: 'Milk', category: 'food', icon: '🥛', color: 0xb9e8f5, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'drink'], metadata: { hunger: 10 }, price: 12, shop: 'supermarket' },
  { id: 'juice_01', name: 'Juice', category: 'food', icon: '🧃', color: 0xffa45f, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'drink'], metadata: { hunger: 10 }, price: 10, shop: 'supermarket' },
  { id: 'cake_01', name: 'Cake', category: 'food', icon: '🍰', color: 0xff9dca, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'treat'], metadata: { hunger: 18 }, price: 25, shop: 'supermarket' },
  { id: 'orange_01', name: 'Orange', category: 'food', icon: '🍊', color: 0xffa348, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'fruit'], metadata: { hunger: 11 }, price: 6, shop: 'supermarket' },
  { id: 'strawberry_01', name: 'Strawberry', category: 'food', icon: '🍓', color: 0xf45f73, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'fruit'], metadata: { hunger: 8 }, price: 7, shop: 'supermarket' },
  { id: 'bread_01', name: 'Bread', category: 'food', icon: '🍞', color: 0xdba76d, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'meal'], metadata: { hunger: 16 }, price: 14, shop: 'supermarket' },
  { id: 'water_01', name: 'Water', category: 'food', icon: '💧', color: 0x79c7ec, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'drink'], metadata: { hunger: 5 }, price: 8, shop: 'supermarket' },
  { id: 'cookies_01', name: 'Cookies', category: 'food', icon: '🍪', color: 0xc98d62, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'snack'], metadata: { hunger: 10 }, price: 12, shop: 'supermarket' },
  { id: 'sandwich_01', name: 'Sandwich', category: 'food', icon: '🥪', color: 0xe8bd72, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'meal'], metadata: { hunger: 22 }, price: 20, shop: 'supermarket' },
  { id: 'cheese_01', name: 'Cheese', category: 'food', icon: '🧀', color: 0xffd95a, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'snack'], metadata: { hunger: 13 }, price: 15, shop: 'supermarket' },
  { id: 'yogurt_01', name: 'Yogurt', category: 'food', icon: '🥣', color: 0xffedf5, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'snack'], metadata: { hunger: 12 }, price: 13, shop: 'supermarket' },
  { id: 'ice_cream_01', name: 'Ice Cream', category: 'food', icon: '🍨', color: 0xf7b5dc, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'treat'], metadata: { hunger: 14 }, price: 18, shop: 'supermarket' },
  { id: 'cupcake_01', name: 'Cupcake', category: 'food', icon: '🧁', color: 0xe99bc8, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'treat'], metadata: { hunger: 15 }, price: 17, shop: 'supermarket' },
  { id: 'teddy_01', name: 'Teddy Bear', category: 'toys', icon: '🧸', color: 0xc98d62, draggable: true, stackable: false, maxStack: 1, interactions: ['pickup', 'place', 'play'], tags: ['toy', 'soft'], metadata: { fun: 12 } },
  { id: 'ball_01', name: 'Ball', category: 'toys', icon: '⚽', color: 0x8dbfea, draggable: true, stackable: false, maxStack: 1, interactions: ['pickup', 'place', 'play'], tags: ['toy', 'sport'], metadata: { fun: 14 } },
  { id: 'toy_robot_01', name: 'Wind-up Robot', category: 'toys', icon: '🤖', color: 0x79c7ec, draggable: true, stackable: false, maxStack: 1, interactions: ['pickup', 'place', 'play'], tags: ['toy'], metadata: { fun: 18 } },
  { id: 'toy_dino_01', name: 'Plush Dino', category: 'toys', icon: '🦕', color: 0x8fdcc8, draggable: true, stackable: false, maxStack: 1, interactions: ['pickup', 'place', 'play'], tags: ['toy'], metadata: { fun: 16 } },
  { id: 'toy_train_01', name: 'Toy Train', category: 'toys', icon: '🚂', color: 0xffd95a, draggable: true, stackable: false, maxStack: 1, interactions: ['pickup', 'place', 'play'], tags: ['toy'], metadata: { fun: 15 } },
  { id: 'park_kite_01', name: 'Rainbow Kite', category: 'toys', icon: '🪁', color: 0xff75a8, draggable: true, stackable: false, maxStack: 1, interactions: ['pickup', 'place', 'play'], tags: ['toy', 'outdoor'], metadata: { fun: 20 } },
  { id: 'park_frisbee_01', name: 'Flying Disc', category: 'toys', icon: '🥏', color: 0x79b7df, draggable: true, stackable: false, maxStack: 1, interactions: ['pickup', 'place', 'play'], tags: ['toy', 'outdoor'], metadata: { fun: 16 } },
  { id: 'cafe_tea_01', name: 'Fruit Tea', category: 'food', icon: '🫖', color: 0xff9ec7, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'drink'], metadata: { hunger: 10 } },
  { id: 'cafe_latte_01', name: 'Star Latte', category: 'food', icon: '☕', color: 0xdba76d, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'drink'], metadata: { hunger: 12 } },
  { id: 'cafe_croissant_01', name: 'Warm Croissant', category: 'food', icon: '🥐', color: 0xf4c27a, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'snack'], metadata: { hunger: 18 } },
  { id: 'pet_bone_01', name: 'Bone Treat', category: 'food', icon: '🦴', color: 0xfff2d6, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'pet'], metadata: { hunger: 15 } },
  { id: 'pet_carrot_01', name: 'Fresh Carrot', category: 'food', icon: '🥕', color: 0xffa45f, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'pet'], metadata: { hunger: 12 } },
  { id: 'pet_bowl_01', name: 'Pet Bowl', category: 'other', icon: '🥣', color: 0xffb8d9, draggable: true, stackable: false, maxStack: 1, interactions: ['pickup', 'place'], tags: ['pet'], metadata: {} },
  { id: 'school_notebook_01', name: 'Star Notebook', category: 'other', icon: '📒', color: 0xffd85e, draggable: true, stackable: true, maxStack: 5, interactions: ['pickup', 'place'], tags: ['school'], metadata: {} },
  { id: 'school_crayon_01', name: 'Rainbow Crayon', category: 'other', icon: '🖍️', color: 0xff7fac, draggable: true, stackable: true, maxStack: 5, interactions: ['pickup', 'place'], tags: ['school'], metadata: {} },
  { id: 'school_backpack_01', name: 'School Bag', category: 'other', icon: '🎒', color: 0x9d8ae8, draggable: true, stackable: false, maxStack: 1, interactions: ['pickup', 'place'], tags: ['school'], metadata: {} },
  { id: 'book_01', name: 'Book', category: 'other', icon: '📘', color: 0x8c9fe8, draggable: true, stackable: true, maxStack: 5, interactions: ['pickup', 'place'], tags: ['book'], metadata: {} },
  { id: 'cup_01', name: 'Cup', category: 'other', icon: '☕', color: 0xa9dfd4, draggable: true, stackable: true, maxStack: 5, interactions: ['pickup', 'place'], tags: ['cup'], metadata: {} },
  { id: 'pillow_01', name: 'Pillow', category: 'other', icon: '☁️', color: 0xe8d8ff, draggable: true, stackable: false, maxStack: 1, interactions: ['pickup', 'place'], tags: ['soft'], metadata: {} },
  { id: 'furniture_bed', name: 'Bed', category: 'furniture', icon: '🛏️', color: 0xcab8f1, draggable: true, stackable: true, maxStack: 5, interactions: ['place'], tags: ['furniture'], metadata: { furnitureType: 'bed' } },
  { id: 'furniture_chair', name: 'Chair', category: 'furniture', icon: '🪑', color: 0xa8ead7, draggable: true, stackable: true, maxStack: 5, interactions: ['place'], tags: ['furniture'], metadata: { furnitureType: 'chair' } },
  { id: 'furniture_sofa', name: 'Sofa', category: 'furniture', icon: '🛋️', color: 0xffb8d9, draggable: true, stackable: true, maxStack: 5, interactions: ['place'], tags: ['furniture'], metadata: { furnitureType: 'sofa' } },
  { id: 'furniture_table', name: 'Table', category: 'furniture', icon: '▰', color: 0xffd480, draggable: true, stackable: true, maxStack: 5, interactions: ['place'], tags: ['furniture'], metadata: { furnitureType: 'table' } },
  { id: 'furniture_wardrobe', name: 'Wardrobe', category: 'furniture', icon: '🚪', color: 0xffc5a5, draggable: true, stackable: true, maxStack: 5, interactions: ['place'], tags: ['furniture'], metadata: { furnitureType: 'wardrobe' } },
  { id: 'furniture_lamp', name: 'Lamp', category: 'furniture', icon: '💡', color: 0xffe47a, draggable: true, stackable: true, maxStack: 5, interactions: ['place'], tags: ['furniture'], metadata: { furnitureType: 'lamp' } },
  { id: 'furniture_rug', name: 'Rug', category: 'furniture', icon: '🟣', color: 0xffc7df, draggable: true, stackable: true, maxStack: 5, interactions: ['place'], tags: ['furniture'], metadata: { furnitureType: 'rug' } },
  { id: 'furniture_plant', name: 'Plant', category: 'furniture', icon: '🪴', color: 0x91d8a3, draggable: true, stackable: true, maxStack: 5, interactions: ['place'], tags: ['furniture'], metadata: { furnitureType: 'plant' } },
  { id: 'furniture_bookshelf', name: 'Bookshelf', category: 'furniture', icon: '📚', color: 0xd4a477, draggable: true, stackable: true, maxStack: 5, interactions: ['place'], tags: ['furniture'], metadata: { furnitureType: 'bookshelf' } },
  { id: 'furniture_tv', name: 'TV', category: 'furniture', icon: '📺', color: 0x8d7793, draggable: true, stackable: true, maxStack: 5, interactions: ['place'], tags: ['furniture'], metadata: { furnitureType: 'tv' } },
  { id: 'smoothie_apple_01', name: 'Apple Smoothie', category: 'food', icon: '🧃', color: 0x9be07d, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'drink', 'cooked'], metadata: { hunger: 22, fun: 15 } },
  { id: 'cake_strawberry_deluxe', name: 'Deluxe Strawberry Cake', category: 'food', icon: '🍰', color: 0xff8ebd, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'treat', 'cooked'], metadata: { hunger: 35, fun: 25 } },
  { id: 'french_toast_01', name: 'Golden French Toast', category: 'food', icon: '🍞', color: 0xf5be6c, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'meal', 'cooked'], metadata: { hunger: 28, fun: 20 } },
  { id: 'boba_strawberry_01', name: 'Strawberry Boba Tea', category: 'food', icon: '🧋', color: 0xffa4cc, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'drink', 'cooked'], metadata: { hunger: 20, fun: 25 } },
  { id: 'latte_caramel_01', name: 'Caramel Macchiato', category: 'food', icon: '☕', color: 0xc88f4e, draggable: true, stackable: true, maxStack: 10, interactions: ['pickup', 'place', 'eat'], tags: ['food', 'drink', 'cooked'], metadata: { hunger: 18, fun: 18 } },
]

export const ItemRegistry = new Map(ITEM_DEFINITIONS.map((item) => [item.id, item]))

export function getItemDefinition(id: string): ItemDefinition | undefined { return ItemRegistry.get(id) }
