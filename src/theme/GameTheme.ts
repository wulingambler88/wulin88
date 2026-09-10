/**
 * Central Game Theme Tokens for Qian Hui Avatar City
 * Based on the "Soft Candy Town" Art Direction (docs/art-target/01_ART_DIRECTION_BOARD.svg)
 */

export const GameTheme = {
  colors: {
    // Primary accents
    primary: '#FF8FC4',        // Strawberry pink
    primaryHover: '#FF7AB8',
    primaryPressed: '#E85B9E',
    
    // Supporting pastels
    sunGold: '#FFD96F',        // Currency, stars, achievements
    sunGoldHover: '#FFCE52',
    mint: '#A8EAD7',           // Nature, edit mode, owned items
    mintDark: '#2E7E69',
    skyBlue: '#BDEAF5',        // Town buildings, windows, water
    skyBlueDark: '#4AAFC9',
    lavender: '#CAB8F1',       // Mystery, magic, bedroom rugs
    lavenderDark: '#785FB5',
    peach: '#FFC4A8',          // Tables, bread, roofs
    peachDark: '#C77045',

    // Core neutrals & surfaces
    surfaceBase: '#FFFDF7',    // Cream white for cards, panels, bubbles
    surfaceWarm: '#FFF8EE',
    surfaceOverlay: 'rgba(255, 253, 247, 0.94)',
    backdrop: 'rgba(102, 61, 99, 0.45)', // Soft plum overlay instead of black

    // Outlines & Line Art (Soft Plum instead of harsh black)
    outline: '#663D63',        // Soft Plum Ink
    outlineLight: '#B38CAE',
    outlineDark: '#4A2A47',
    whiteBorder: '#FFFFFF',

    // Shadows & Depth
    shadowPlum: 'rgba(102, 61, 99, 0.18)',
    shadowPlumElevated: 'rgba(102, 61, 99, 0.12)',
    shadowSubtle: 'rgba(102, 61, 99, 0.08)',
  },

  radii: {
    pill: '9999px',
    modal: '26px',
    panel: '22px',
    card: '18px',
    button: '22px',
    iconBtn: '50%',
    badge: '14px',
    slot: '16px',
  },

  strokes: {
    thick: 3.0,     // Character silhouette, major UI borders
    medium: 2.0,    // Furniture, card outlines, building silhouettes
    fine: 1.5,      // Facial features, inner seams
    hairline: 1.0,  // Decorative background accents
  },

  typography: {
    fontFamily: "'Nunito', 'Quicksand', 'Segoe UI', system-ui, sans-serif",
    fontSizeXl: '24px',
    fontSizeLg: '18px',
    fontSizeMd: '15px',
    fontSizeSm: '13px',
    fontSizeXs: '11px',
    fontWeightBold: 800,
    fontWeightBlack: 900,
  },

  dimensions: {
    minTouchTarget: 44,
    preferredTouchTarget: 48,
    topBarHeight: 56,
    bottomBarHeight: 64,
  },
} as const

/**
 * Numeric outline colours for use in Phaser Graphics calls.
 * Audit fix #3: single source of truth for the soft-plum outline.
 */
export const OUTLINE_COLOR = 0x663d63
export const OUTLINE_LIGHT_COLOR = 0x78504b
