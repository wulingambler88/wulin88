import type { LocationId } from './locations'

export interface TreasureClueStep {
  stepIndex: number
  location: LocationId
  locationName: string
  riddle: string
  hint: string
  propName: string
  propIcon: string
  x: number
  y: number
}

export interface TreasureReward {
  starCoins: number
  clothingIds: string[]
  title: string
  badgeName: string
  icon: string
}

export interface TreasureMystery {
  id: string
  title: string
  icon: string
  description: string
  steps: TreasureClueStep[]
  reward: TreasureReward
}

export const TREASURE_MYSTERIES: readonly TreasureMystery[] = [
  {
    id: 'mystery_golden_whisker',
    title: 'The Case of the Golden Whisker',
    icon: '🐾',
    description: 'A shiny golden collar has vanished! Follow the playful pawprints across town to find the Secret Treehouse Chest.',
    steps: [
      {
        stepIndex: 0,
        location: 'pet_shop',
        locationName: 'Pet Shop',
        riddle: 'Where puppies bark and kittens play, look near the comfy animal bed right away! 🐶',
        hint: 'Head to the Pet Shop in town and inspect the cuddly pet bed!',
        propName: 'Golden Pawprint Note',
        propIcon: '🐾',
        x: 320,
        y: 420,
      },
      {
        stepIndex: 1,
        location: 'park',
        locationName: 'Sunshine Park',
        riddle: 'Near the sunny slide and green trees tall, golden sparkles hide in the sandbox wall! 🏖️',
        hint: 'Go to the Park and search the golden sandbox!',
        propName: 'Brass Skeleton Key',
        propIcon: '🗝️',
        x: 680,
        y: 420,
      },
      {
        stepIndex: 2,
        location: 'park',
        locationName: 'Sunshine Park',
        riddle: 'You have the key! Under the flowering oak, open the Grand Secret Chest! 🌟',
        hint: 'Open the glowing Grand Treasure Chest in the Park!',
        propName: 'Grand Detective Chest',
        propIcon: '🧰',
        x: 380,
        y: 380,
      },
    ],
    reward: {
      starCoins: 75,
      clothingIds: ['hat_detective_cap', 'dress_detective_cape'],
      title: 'Master Detective Outfit',
      badgeName: 'Chief Inspector Badge',
      icon: '🕵️‍♀️',
    },
  },
  {
    id: 'mystery_starlight_tiara',
    title: 'The Mystery of the Starlight Tiara',
    icon: '👑',
    description: 'The ceremonial Starlight Tiara has been whisked away! Decode the clever riddles to recover the royal jewel.',
    steps: [
      {
        stepIndex: 0,
        location: 'school',
        locationName: 'Sunshine Academy',
        riddle: 'Where lessons are taught and chalk dust flies, search near the teacher desk for a surprise! 🏫',
        hint: 'Visit Sunshine Academy and check the teacher desk!',
        propName: 'Starlight Scroll',
        propIcon: '📜',
        x: 740,
        y: 340,
      },
      {
        stepIndex: 1,
        location: 'cafe',
        locationName: 'Honeycomb Bakery & Café',
        riddle: 'Where sweet honey tea and pastries gleam, look by the dining booth dream! 🧁',
        hint: 'Go to Honeycomb Café and check near the cozy dining booths!',
        propName: 'Jeweled Star Crest',
        propIcon: '⭐',
        x: 480,
        y: 430,
      },
      {
        stepIndex: 2,
        location: 'town',
        locationName: 'Town Square',
        riddle: 'Return to Town Square! The Starlight Chest glows beside the fountain! ⛲',
        hint: 'Find the glowing Royal Chest right in the Town Square!',
        propName: 'Royal Starlight Chest',
        propIcon: '💎',
        x: 480,
        y: 360,
      },
    ],
    reward: {
      starCoins: 80,
      clothingIds: ['hat_star_tiara'],
      title: 'Royal Starlight Tiara',
      badgeName: 'Starlight Royalty',
      icon: '👑',
    },
  },
  {
    id: 'mystery_pirate_stash',
    title: 'The Pirate Captain\'s Secret Stash',
    icon: '🏴‍☠️',
    description: 'Old Captain Redbeard left a secret doubloon cache in town! Follow the pirate markings to claim the bounty.',
    steps: [
      {
        stepIndex: 0,
        location: 'toy_shop',
        locationName: 'Starlet Toy Shop',
        riddle: 'Where colorful plushies and puzzles sit, search the green play mat every bit! 🧩',
        hint: 'Go to the Toy Shop and search the green play mat!',
        propName: 'Torn Treasure Map',
        propIcon: '🗺️',
        x: 520,
        y: 430,
      },
      {
        stepIndex: 1,
        location: 'supermarket',
        locationName: 'Fresh Supermarket',
        riddle: 'Near fresh red apples sweet and round, pirate skull markings can be found! 🍎',
        hint: 'Go to the Supermarket and check the fresh produce shelf!',
        propName: 'Gold Doubloon Token',
        propIcon: '🪙',
        x: 350,
        y: 380,
      },
      {
        stepIndex: 2,
        location: 'home',
        locationName: 'Home Garden',
        riddle: 'Follow the secret trail home! In your room sits the Pirate Captain\'s Treasure Chest! ⚓',
        hint: 'Head back to Home and open the Pirate Chest in the living room!',
        propName: 'Pirate Captain\'s Chest',
        propIcon: '🏴‍☠️',
        x: 1200,
        y: 420,
      },
    ],
    reward: {
      starCoins: 100,
      clothingIds: ['hat_pirate_bandana'],
      title: 'Captain\'s Pirate Bandana',
      badgeName: 'Pirate King Doubloon',
      icon: '🦜',
    },
  },
]

export function getMysteryById(id: string): TreasureMystery | undefined {
  return TREASURE_MYSTERIES.find((m) => m.id === id)
}

export function generateDailyHunt(seedDay = 1): TreasureMystery {
  const locations: Array<{ id: LocationId; name: string; x: number; y: number }> = [
    { id: 'park', name: 'Park', x: 500, y: 410 },
    { id: 'cafe', name: 'Café', x: 420, y: 410 },
    { id: 'school', name: 'School', x: 520, y: 390 },
    { id: 'toy_shop', name: 'Toy Shop', x: 560, y: 420 },
    { id: 'supermarket', name: 'Supermarket', x: 460, y: 400 },
    { id: 'pet_shop', name: 'Pet Shop', x: 400, y: 410 },
  ]

  const locA = locations[seedDay % locations.length]!
  const locB = locations[(seedDay + 3) % locations.length]!

  return {
    id: `daily_hunt_${seedDay}`,
    title: `Daily Mystery Explorer #${seedDay}`,
    icon: '🧭',
    description: 'A special daily scavenger quest around town! Uncover hidden clues to earn bonus Star Coins.',
    steps: [
      {
        stepIndex: 0,
        location: locA.id,
        locationName: locA.name,
        riddle: `A sparkling clue is hiding in the ${locA.name}! Look closely at the props. ✨`,
        hint: `Visit the ${locA.name} and investigate the sparkling object!`,
        propName: 'Mysterious Note',
        propIcon: '🔍',
        x: locA.x,
        y: locA.y,
      },
      {
        stepIndex: 1,
        location: locB.id,
        locationName: locB.name,
        riddle: `The trail continues to the ${locB.name}! The Grand Explorer Chest awaits! 🎁`,
        hint: `Go to the ${locB.name} and open the Explorer Chest!`,
        propName: 'Explorer Treasure Chest',
        propIcon: '🧰',
        x: locB.x,
        y: locB.y,
      },
    ],
    reward: {
      starCoins: 50,
      clothingIds: [],
      title: 'Daily Explorer Bounty',
      badgeName: 'Daily Explorer Medal',
      icon: '⭐',
    },
  }
}
