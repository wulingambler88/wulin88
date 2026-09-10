export type FurnitureType = 'bed' | 'chair' | 'sofa' | 'table' | 'wardrobe' | 'lamp' | 'rug' | 'plant' | 'bookshelf' | 'tv'
export type FurnitureInteraction = 'sleep' | 'sit' | 'wardrobe' | 'surface' | 'none'

export interface FurnitureAnchor { id: string; x: number; y: number; state: 'sitting' | 'sleeping' }

export interface FurnitureDefinition {
  id: string
  name: string
  type: FurnitureType
  x: number
  y: number
  width: number
  height: number
  color: number
  interaction: FurnitureInteraction
  anchors: readonly FurnitureAnchor[]
  rotationAllowed: boolean
}

export const FURNITURE_DEFINITIONS: readonly FurnitureDefinition[] = [
  { id: 'bed_main', name: 'Cloud Bed', type: 'bed', x: 160, y: 345, width: 230, height: 130, color: 0xcab8f1, interaction: 'sleep', anchors: [{ id: 'sleep', x: 0, y: -20, state: 'sleeping' }], rotationAllowed: false },
  { id: 'chair_main', name: 'Mint Chair', type: 'chair', x: 470, y: 365, width: 105, height: 120, color: 0xa8ead7, interaction: 'sit', anchors: [{ id: 'sit', x: 0, y: -34, state: 'sitting' }], rotationAllowed: false },
  { id: 'wardrobe_main', name: 'Peach Wardrobe', type: 'wardrobe', x: 760, y: 300, width: 120, height: 205, color: 0xffc5a5, interaction: 'wardrobe', anchors: [], rotationAllowed: false },
  { id: 'lamp_main', name: 'Star Lamp', type: 'lamp', x: 55, y: 370, width: 60, height: 135, color: 0xffe47a, interaction: 'none', anchors: [], rotationAllowed: false },
  { id: 'rug_main', name: 'Berry Rug', type: 'rug', x: 450, y: 465, width: 330, height: 65, color: 0xffc7df, interaction: 'none', anchors: [], rotationAllowed: true },
  { id: 'sofa_main', name: 'Berry Sofa', type: 'sofa', x: 1190, y: 370, width: 250, height: 125, color: 0xffb8d9, interaction: 'sit', anchors: [{ id: 'sit-left', x: -55, y: -28, state: 'sitting' }, { id: 'sit-right', x: 55, y: -28, state: 'sitting' }], rotationAllowed: false },
  { id: 'plant_main', name: 'Happy Plant', type: 'plant', x: 1780, y: 380, width: 75, height: 125, color: 0x91d8a3, interaction: 'none', anchors: [], rotationAllowed: false },
  { id: 'bookshelf_main', name: 'Book Nook', type: 'bookshelf', x: 1045, y: 315, width: 95, height: 190, color: 0xd4a477, interaction: 'none', anchors: [], rotationAllowed: false },
  { id: 'tv_main', name: 'Star TV', type: 'tv', x: 1660, y: 330, width: 150, height: 125, color: 0x8d7793, interaction: 'none', anchors: [], rotationAllowed: false },
  { id: 'table_main', name: 'Kitchen Table', type: 'table', x: 2400, y: 390, width: 235, height: 105, color: 0xffd480, interaction: 'surface', anchors: [], rotationAllowed: true },
]

export const FurnitureRegistry = new Map(FURNITURE_DEFINITIONS.map((item) => [item.id, item]))
