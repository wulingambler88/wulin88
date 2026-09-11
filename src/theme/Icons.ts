/**
 * Coherent SVG Vector Icon Family for Qian Hui Avatar City
 * Replaces all prototype emojis with bespoke, accessible vector assets.
 */

export const Icons = {
  // Brand / Star Coin
  star: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.9 8.3L22 9.2L16.8 14.1L18.1 21L12 17.6L5.9 21L7.2 14.1L2 9.2L9.1 8.3L12 2Z" fill="#FFD96F" stroke="#663D63" stroke-width="2" stroke-linejoin="round"/>
      <path d="M12 5L13.8 8.8L18 9.4L14.8 12.4L15.6 16.5L12 14.4L8.4 16.5L9.2 12.4L6 9.4L10.2 8.8L12 5Z" fill="#FFEAA8"/>
    </svg>
  `,

  // Navigation: Town Map
  town: `<img src="art/ui/icon-town.webp" alt="Town" style="width:100%;height:100%;object-fit:contain;" />`,

  // Navigation: Home
  home: `<img src="art/ui/icon-home.webp" alt="Home" style="width:100%;height:100%;object-fit:contain;" />`,

  // Clues / Detective Journal
  clues: `<img src="art/ui/icon-clues.webp" alt="Clues" style="width:100%;height:100%;object-fit:contain;" />`,

  // Brain Games Hub
  brain: `<img src="art/ui/icon-games.webp" alt="Games" style="width:100%;height:100%;object-fit:contain;" />`,

  // Bag / Inventory
  bag: `<img src="art/ui/icon-backpack.webp" alt="Bag" style="width:100%;height:100%;object-fit:contain;" />`,

  // Wardrobe / Dress
  dress: `<img src="art/ui/icon-dress.webp" alt="Dress" style="width:100%;height:100%;object-fit:contain;" />`,

  // Avatar Studio
  avatar: `<img src="art/ui/icon-avatar.webp" alt="Avatar" style="width:100%;height:100%;object-fit:contain;" />`,

  // Pet Whistle
  pet: `<img src="art/ui/icon-pet.webp" alt="Pet" style="width:100%;height:100%;object-fit:contain;" />`,

  // Edit Mode
  edit: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20L8 19L19 8L15 4L4 15L4 20Z" fill="#A8EAD7" stroke="#663D63" stroke-width="2" stroke-linejoin="round"/>
      <line x1="13.5" y1="5.5" x2="17.5" y2="9.5" stroke="#663D63" stroke-width="1.8"/>
    </svg>
  `,

  // Undo
  undo: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 9H15C17.8 9 20 11.2 20 14C20 16.8 17.8 19 15 19H8" stroke="#663D63" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M8 5L4 9L8 13" stroke="#663D63" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Redo
  redo: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 9H9C6.2 9 4 11.2 4 14C4 16.8 6.2 19 9 19H16" stroke="#663D63" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M16 5L20 9L16 13" stroke="#663D63" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Reset
  reset: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 12A8 8 0 1 1 17.6 6.3L20 8M20 3V8H15" stroke="#663D63" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // Sound On
  soundOn: `<img src="art/ui/icon-sound.webp" alt="Sound" style="width:100%;height:100%;object-fit:contain;" />`,

  // Sound Muted
  soundMuted: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 5L6 9H3C2.4 9 2 9.4 2 10V14C2 14.6 2.4 15 3 15H6L11 19V5Z" fill="#F0E8F0" stroke="#663D63" stroke-width="2" stroke-linejoin="round"/>
      <line x1="16" y1="9" x2="22" y2="15" stroke="#FF7AB8" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="22" y1="9" x2="16" y2="15" stroke="#FF7AB8" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `,

  // Sun
  sun: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" fill="#FFD96F" stroke="#663D63" stroke-width="2"/>
      <path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.9 4.9L6.3 6.3M17.7 17.7L19.1 19.1M4.9 19.1L6.3 17.7M17.7 6.3L19.1 4.9" stroke="#DE9F1D" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  sunset: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18H21" stroke="#663D63" stroke-width="2" stroke-linecap="round"/>
      <path d="M6 18A6 6 0 0 1 18 18" fill="#FFAA72" stroke="#663D63" stroke-width="2"/>
      <path d="M12 4V7M5.6 7.6L7.7 9.7M18.4 7.6L16.3 9.7M3 13H6M18 13H21" stroke="#DE7A44" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  // Moon
  moon: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.5 14C19.2 14.6 17.7 15 16 15C10.5 15 6 10.5 6 5C6 3.3 6.4 1.8 7 0.5C3.5 2.1 1 5.8 1 10C1 16.1 5.9 21 12 21C16.2 21 19.9 18.5 21.5 15C21.2 15 20.8 15 20.5 15Z" fill="#CAB8F1" stroke="#663D63" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `,

  // Close
  close: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#FF8FC4" stroke="#663D63" stroke-width="2"/>
      <line x1="8" y1="8" x2="16" y2="16" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="16" y1="8" x2="8" y2="16" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,

  // Basket / Shopping Cart
  basket: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 10L4 20H20L18 10H6Z" fill="#FFC4A8" stroke="#663D63" stroke-width="2" stroke-linejoin="round"/>
      <path d="M8 10V6C8 4.3 9.8 3 12 3C14.2 3 16 4.3 16 6V10" stroke="#663D63" stroke-width="2"/>
      <line x1="4" y1="14" x2="20" y2="14" stroke="#663D63" stroke-width="1.5"/>
    </svg>
  `,

  // Bedroom Room Tab
  bedroom: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="11" width="20" height="9" rx="3" fill="#CAB8F1" stroke="#663D63" stroke-width="2"/>
      <rect x="4" y="8" width="6" height="5" rx="2" fill="#FFFFFF" stroke="#663D63" stroke-width="1.5"/>
      <line x1="4" y1="20" x2="4" y2="23" stroke="#663D63" stroke-width="2" stroke-linecap="round"/>
      <line x1="20" y1="20" x2="20" y2="23" stroke="#663D63" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  // Living Room Tab
  livingRoom: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="6" width="14" height="12" rx="4" fill="#FFD96F" stroke="#663D63" stroke-width="2"/>
      <rect x="3" y="11" width="4" height="7" rx="2" fill="#FFEAA8" stroke="#663D63" stroke-width="1.5"/>
      <rect x="17" y="11" width="4" height="7" rx="2" fill="#FFEAA8" stroke="#663D63" stroke-width="1.5"/>
    </svg>
  `,

  // Kitchen Room Tab
  kitchen: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="14" r="6" fill="#A8EAD7" stroke="#663D63" stroke-width="2"/>
      <line x1="14" y1="10" x2="21" y2="3" stroke="#663D63" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="10" cy="14" r="2.5" fill="#FFD96F"/>
    </svg>
  `,

  // Needs Meter: Happiness
  statHappiness: `
    <svg viewBox="0 0 20 20" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" fill="#FFE5A3" stroke="#663D63" stroke-width="1.5"/>
      <circle cx="7" cy="8" r="1" fill="#663D63"/><circle cx="13" cy="8" r="1" fill="#663D63"/>
      <path d="M6.5 11.5Q10 15 13.5 11.5" stroke="#663D63" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,

  // Needs Meter: Energy
  statEnergy: `
    <svg viewBox="0 0 20 20" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 2L4 11H10L9 18L16 9H10L11 2Z" fill="#4AC3FF" stroke="#663D63" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  `,

  // Needs Meter: Hunger
  statHunger: `
    <svg viewBox="0 0 20 20" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="11.5" r="6.5" fill="#FF7AB8" stroke="#663D63" stroke-width="1.5"/>
      <path d="M10 5Q11 3 13 4" stroke="#52A44E" stroke-width="1.5" fill="none"/>
    </svg>
  `,

  // Needs Meter: Fun
  statFun: `
    <svg viewBox="0 0 20 20" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="10" cy="8.5" rx="6" ry="7" fill="#CAB8F1" stroke="#663D63" stroke-width="1.5"/>
      <path d="M10 15.5L8 19M10 15.5L12 19" stroke="#663D63" stroke-width="1.2"/>
    </svg>
  `,

  // Quests / Clipboard with notification badge
  quests: `<img src="art/ui/icon-quests.webp" alt="Quests" style="width:100%;height:100%;object-fit:contain;" />`,

  // Settings Gear
  settings: `
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.8 2.8H14.2L15 5.2C15.7 5.5 16.3 5.8 16.9 6.3L19.4 5.8L21.6 9.6L19.8 11.4C19.9 12.1 19.9 12.8 19.8 13.5L21.6 15.3L19.4 19.1L16.9 18.6C16.3 19.1 15.7 19.4 15 19.7L14.2 22.1H9.8L9 19.7C8.3 19.4 7.7 19.1 7.1 18.6L4.6 19.1L2.4 15.3L4.2 13.5C4.1 12.8 4.1 12.1 4.2 11.4L2.4 9.6L4.6 5.8L7.1 6.3C7.7 5.8 8.3 5.5 9 5.2L9.8 2.8Z" fill="#CAB8F1" stroke="#663D63" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="12" cy="12.45" r="3.2" fill="#FFFFFF" stroke="#663D63" stroke-width="1.6"/>
    </svg>
  `,

  // Build / Chair
  build: `<img src="art/ui/icon-build.webp" alt="Build" style="width:100%;height:100%;object-fit:contain;" />`,

  // Cute White Companion Kitten
  cat: `<img src="art/ui/icon-pet.webp" alt="Pet" style="width:100%;height:100%;object-fit:contain;" />`,

  // 3D Illustrated Daily Reward Gift Box
  giftBox: `<img src="art/ui/icon-daily-reward.webp" alt="Daily Gift" style="width:100%;height:100%;object-fit:contain;" />`,

  // Master Portrait: the same protagonist identity used in the world.
  qianHuiPortrait: `<svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="avatar-portrait-clip"><circle cx="40" cy="40" r="38"/></clipPath></defs><circle cx="40" cy="40" r="39" fill="#FFF0F5" stroke="#663D63" stroke-width="2"/><g clip-path="url(#avatar-portrait-clip)"><circle cx="15" cy="18" r="14" fill="#996340" stroke="#663D63" stroke-width="2"/><circle cx="65" cy="18" r="14" fill="#996340" stroke="#663D63" stroke-width="2"/><circle cx="18" cy="28" r="5" fill="#FF8FC4" stroke="#663D63" stroke-width="1.2"/><circle cx="62" cy="28" r="5" fill="#FF8FC4" stroke="#663D63" stroke-width="1.2"/><circle cx="40" cy="38" r="27" fill="#996340" stroke="#663D63" stroke-width="2"/><ellipse cx="40" cy="42" rx="22" ry="20" fill="#FFD7C6" stroke="#663D63" stroke-width="2"/><circle cx="17" cy="42" r="5" fill="#FFD7C6" stroke="#663D63" stroke-width="1.8"/><circle cx="63" cy="42" r="5" fill="#FFD7C6" stroke="#663D63" stroke-width="1.8"/><circle cx="17" cy="42" r="2.5" fill="#FFCCD8"/><circle cx="63" cy="42" r="2.5" fill="#FFCCD8"/><ellipse cx="30" cy="42" rx="5.5" ry="6.5" fill="#FFFFFF"/><ellipse cx="50" cy="42" rx="5.5" ry="6.5" fill="#FFFFFF"/><path d="M24 38 Q30 35 36 38" stroke="#663D63" stroke-width="2.2" stroke-linecap="round"/><path d="M44 38 Q50 35 56 38" stroke="#663D63" stroke-width="2.2" stroke-linecap="round"/><circle cx="30" cy="42" r="4" fill="#6C3F68"/><circle cx="50" cy="42" r="4" fill="#6C3F68"/><circle cx="28.5" cy="40" r="1.6" fill="#FFFFFF"/><circle cx="48.5" cy="40" r="1.6" fill="#FFFFFF"/><circle cx="31.5" cy="43.5" r="0.8" fill="#FFFFFF"/><circle cx="51.5" cy="43.5" r="0.8" fill="#FFFFFF"/><ellipse cx="25" cy="48" rx="4.5" ry="2.5" fill="#FF7E9F" fill-opacity="0.6"/><ellipse cx="55" cy="48" rx="4.5" ry="2.5" fill="#FF7E9F" fill-opacity="0.6"/><path d="M37 51 Q40 54 43 51" stroke="#B3496C" stroke-width="1.8" stroke-linecap="round"/><circle cx="28" cy="27" r="10" fill="#996340" stroke="#663D63" stroke-width="1.8"/><circle cx="40" cy="25" r="11" fill="#996340" stroke="#663D63" stroke-width="1.8"/><circle cx="52" cy="27" r="10" fill="#996340" stroke="#663D63" stroke-width="1.8"/><rect x="26" y="22" width="28" height="4" rx="2" fill="#FFFFFF" fill-opacity="0.5"/><ellipse cx="40" cy="18" rx="7" ry="5.5" fill="#FFFFFF" stroke="#663D63" stroke-width="1.5"/><polygon points="36,15 37.5,10 40,15" fill="#FFFFFF" stroke="#663D63" stroke-width="1.2"/><polygon points="40,15 42.5,10 44,15" fill="#FFFFFF" stroke="#663D63" stroke-width="1.2"/><circle cx="38" cy="18" r="0.8" fill="#663D63"/><circle cx="42" cy="18" r="0.8" fill="#663D63"/></g></svg>`,
} as const

export function createAvatarPortraitSVG(custom?: {
  hairStyle?: string
  hairColor?: number
  skinColor?: number
  eyeColor?: number
  blushColor?: number
}): string {
  const hairStyle = custom?.hairStyle ?? 'twin_buns'
  const hairColorHex = custom?.hairColor ? '#' + custom.hairColor.toString(16).padStart(6, '0') : '#996340'
  const skinColorHex = custom?.skinColor ? '#' + custom.skinColor.toString(16).padStart(6, '0') : '#ffd7c6'
  const eyeColorHex = custom?.eyeColor ? '#' + custom.eyeColor.toString(16).padStart(6, '0') : '#6c3f68'
  const blushColorHex = custom?.blushColor ? '#' + custom.blushColor.toString(16).padStart(6, '0') : '#ff7e9f'

  let backHairSVG = ''
  if (hairStyle === 'twin_buns') {
    backHairSVG = `
      <circle cx="15" cy="18" r="14" fill="${hairColorHex}" stroke="#663D63" stroke-width="2"/>
      <circle cx="65" cy="18" r="14" fill="${hairColorHex}" stroke="#663D63" stroke-width="2"/>
      <circle cx="18" cy="28" r="5" fill="#FF8FC4" stroke="#663D63" stroke-width="1.2"/>
      <circle cx="62" cy="28" r="5" fill="#FF8FC4" stroke="#663D63" stroke-width="1.2"/>
    `
  } else if (hairStyle === 'long_waves') {
    backHairSVG = `
      <path d="M14 36 C8 55 10 72 20 78 C28 66 26 50 26 36 Z" fill="${hairColorHex}" stroke="#663D63" stroke-width="2"/>
      <path d="M66 36 C72 55 70 72 60 78 C52 66 54 50 54 36 Z" fill="${hairColorHex}" stroke="#663D63" stroke-width="2"/>
    `
  } else if (hairStyle === 'ponytail') {
    backHairSVG = `
      <circle cx="65" cy="18" r="15" fill="${hairColorHex}" stroke="#663D63" stroke-width="2"/>
      <ellipse cx="69" cy="34" rx="11" ry="20" fill="${hairColorHex}" stroke="#663D63" stroke-width="2"/>
      <circle cx="58" cy="26" r="5" fill="#FF8FC4" stroke="#663D63" stroke-width="1.2"/>
    `
  } else if (hairStyle === 'bob') {
    backHairSVG = `
      <rect x="15" y="24" width="50" height="42" rx="14" fill="${hairColorHex}" stroke="#663D63" stroke-width="2"/>
    `
  } else if (hairStyle === 'pixie') {
    backHairSVG = `
      <circle cx="40" cy="36" r="26" fill="${hairColorHex}" stroke="#663D63" stroke-width="2"/>
    `
  }

  return `<svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="avatar-portrait-clip"><circle cx="40" cy="40" r="38"/></clipPath></defs><circle cx="40" cy="40" r="39" fill="#FFF0F5" stroke="#663D63" stroke-width="2"/><g clip-path="url(#avatar-portrait-clip)">${backHairSVG}<!-- Scalp --><circle cx="40" cy="38" r="27" fill="${hairColorHex}" stroke="#663D63" stroke-width="2"/><!-- Face --><ellipse cx="40" cy="42" rx="22" ry="20" fill="${skinColorHex}" stroke="#663D63" stroke-width="2"/><!-- Ears --><circle cx="17" cy="42" r="5" fill="${skinColorHex}" stroke="#663D63" stroke-width="1.8"/><circle cx="63" cy="42" r="5" fill="${skinColorHex}" stroke="#663D63" stroke-width="1.8"/><circle cx="17" cy="42" r="2.5" fill="#FFCCD8"/><circle cx="63" cy="42" r="2.5" fill="#FFCCD8"/><!-- Eyes --><ellipse cx="30" cy="42" rx="5.5" ry="6.5" fill="#FFFFFF"/><ellipse cx="50" cy="42" rx="5.5" ry="6.5" fill="#FFFFFF"/><path d="M24 38 Q30 35 36 38" stroke="#663D63" stroke-width="2.2" stroke-linecap="round"/><path d="M44 38 Q50 35 56 38" stroke="#663D63" stroke-width="2.2" stroke-linecap="round"/><circle cx="30" cy="42" r="4" fill="${eyeColorHex}"/><circle cx="50" cy="42" r="4" fill="${eyeColorHex}"/><circle cx="28.5" cy="40" r="1.6" fill="#FFFFFF"/><circle cx="48.5" cy="40" r="1.6" fill="#FFFFFF"/><circle cx="31.5" cy="43.5" r="0.8" fill="#FFFFFF"/><circle cx="51.5" cy="43.5" r="0.8" fill="#FFFFFF"/><!-- Blush --><ellipse cx="25" cy="48" rx="4.5" ry="2.5" fill="${blushColorHex}" fill-opacity="0.6"/><ellipse cx="55" cy="48" rx="4.5" ry="2.5" fill="${blushColorHex}" fill-opacity="0.6"/><!-- Mouth --><path d="M37 51 Q40 54 43 51" stroke="#B3496C" stroke-width="1.8" stroke-linecap="round"/><!-- Forehead Bangs --><circle cx="28" cy="27" r="10" fill="${hairColorHex}" stroke="#663D63" stroke-width="1.8"/><circle cx="40" cy="25" r="11" fill="${hairColorHex}" stroke="#663D63" stroke-width="1.8"/><circle cx="52" cy="27" r="10" fill="${hairColorHex}" stroke="#663D63" stroke-width="1.8"/><!-- Hair Gloss --><rect x="26" y="22" width="28" height="4" rx="2" fill="#FFFFFF" fill-opacity="0.5"/><!-- Kitten Hair Clip --><ellipse cx="40" cy="18" rx="7" ry="5.5" fill="#FFFFFF" stroke="#663D63" stroke-width="1.5"/><polygon points="36,15 37.5,10 40,15" fill="#FFFFFF" stroke="#663D63" stroke-width="1.2"/><polygon points="40,15 42.5,10 44,15" fill="#FFFFFF" stroke="#663D63" stroke-width="1.2"/><circle cx="38" cy="18" r="0.8" fill="#663D63"/><circle cx="42" cy="18" r="0.8" fill="#663D63"/></g></svg>`
}
