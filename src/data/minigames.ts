export type DifficultyTier = 'junior' | 'explorer' | 'champion'

export interface QuizQuestion {
  id: string
  tier: DifficultyTier
  category: 'math' | 'science' | 'words'
  question: string
  options: [string, string, string]
  correctIndex: number
  explanation: string
  icon: string
}

export interface BrainBadge {
  id: string
  name: string
  icon: string
  description: string
  requirement: string
}

export interface MemoryDeckCard {
  id: string
  icon: string
  label: string
}

export const MEMORY_CARDS: readonly MemoryDeckCard[] = [
  { id: 'pet_puppy', icon: '🐶', label: 'Puppy' },
  { id: 'pet_kitten', icon: '🐱', label: 'Kitten' },
  { id: 'pet_bunny', icon: '🐰', label: 'Bunny' },
  { id: 'pet_hamster', icon: '🐹', label: 'Hamster' },
  { id: 'pet_panda', icon: '🐼', label: 'Panda' },
  { id: 'fruit_apple', icon: '🍎', label: 'Apple' },
  { id: 'fruit_strawberry', icon: '🍓', label: 'Strawberry' },
  { id: 'fruit_banana', icon: '🍌', label: 'Banana' },
]

export const BRAIN_BADGES: readonly BrainBadge[] = [
  {
    id: 'badge_memory',
    name: 'Memory Master',
    icon: '🧠',
    description: 'Matched all pairs in the Memory Game!',
    requirement: 'Win 3 Memory Match games',
  },
  {
    id: 'badge_math',
    name: 'Math Wizard',
    icon: '📐',
    description: 'Answered math quiz questions with stellar accuracy!',
    requirement: 'Score 5 correct answers in Math Quiz',
  },
  {
    id: 'badge_puzzle',
    name: 'Puzzle Champion',
    icon: '🧩',
    description: 'Assembled all picture puzzle pieces perfectly!',
    requirement: 'Solve 2 Picture Puzzles',
  },
  {
    id: 'badge_scholar',
    name: 'Star Scholar',
    icon: '🎓',
    description: 'A brilliant student of Sunshine Academy!',
    requirement: 'Earn 50 ⭐ from Brain Games',
  },
]

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  // Junior (7-8 yo)
  {
    id: 'q_j_01',
    tier: 'junior',
    category: 'math',
    question: 'What is 7 + 8?',
    options: ['14', '15', '16'],
    correctIndex: 1,
    explanation: '7 + 8 = 15! Great addition!',
    icon: '➕',
  },
  {
    id: 'q_j_02',
    tier: 'junior',
    category: 'math',
    question: 'If you have 10 ⭐ coins and spend 4 ⭐, how many are left?',
    options: ['5', '6', '7'],
    correctIndex: 1,
    explanation: '10 - 4 = 6! Super math work!',
    icon: '➖',
  },
  {
    id: 'q_j_03',
    tier: 'junior',
    category: 'science',
    question: 'What do honeybees make from flowers?',
    options: ['Honey', 'Milk', 'Juice'],
    correctIndex: 0,
    explanation: 'Bees collect flower nectar and turn it into sweet honey! 🐝🍯',
    icon: '🐝',
  },
  {
    id: 'q_j_04',
    tier: 'junior',
    category: 'words',
    question: 'Which word is the OPPOSITE of "Hot"?',
    options: ['Warm', 'Cold', 'Spicy'],
    correctIndex: 1,
    explanation: 'Cold is the opposite of hot, like ice cream! 🍦',
    icon: '❄️',
  },
  {
    id: 'q_j_05',
    tier: 'junior',
    category: 'science',
    question: 'How many legs does a cute little spider have?',
    options: ['6', '8', '10'],
    correctIndex: 1,
    explanation: 'Spiders have 8 legs! Insects have 6! 🕷️',
    icon: '🕷️',
  },

  // Explorer (9-10 yo)
  {
    id: 'q_e_01',
    tier: 'explorer',
    category: 'math',
    question: 'What is 6 × 7?',
    options: ['40', '42', '44'],
    correctIndex: 1,
    explanation: '6 times 7 is 42! Multiplication star! ⭐',
    icon: '✖️',
  },
  {
    id: 'q_e_02',
    tier: 'explorer',
    category: 'math',
    question: 'A pizza is cut into 8 slices. If you eat 3, what fraction remains?',
    options: ['3/8', '5/8', '4/8'],
    correctIndex: 1,
    explanation: '8 - 3 = 5 slices left, which is 5/8 of the pizza! 🍕',
    icon: '🍕',
  },
  {
    id: 'q_e_03',
    tier: 'explorer',
    category: 'science',
    question: 'Which planet in our solar system is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter'],
    correctIndex: 1,
    explanation: 'Mars is called the Red Planet because of iron oxide on its surface! 🔴',
    icon: '🪐',
  },
  {
    id: 'q_e_04',
    tier: 'explorer',
    category: 'words',
    question: 'Choose the correct spelling:',
    options: ['Beautifull', 'Beautiful', 'Beautifule'],
    correctIndex: 1,
    explanation: 'B-E-A-U-T-I-F-U-L! Perfect spelling! 🌟',
    icon: '📖',
  },
  {
    id: 'q_e_05',
    tier: 'explorer',
    category: 'science',
    question: 'What gas do plants absorb from the air during photosynthesis?',
    options: ['Oxygen', 'Carbon Dioxide', 'Helium'],
    correctIndex: 1,
    explanation: 'Plants breathe in Carbon Dioxide and release fresh Oxygen! 🌿',
    icon: '🌱',
  },

  // Champion (11-12 yo)
  {
    id: 'q_c_01',
    tier: 'champion',
    category: 'math',
    question: 'What is 15% of 200?',
    options: ['25', '30', '35'],
    correctIndex: 1,
    explanation: '15% of 200 = (15 / 100) * 200 = 30! Genius! 🎯',
    icon: '📐',
  },
  {
    id: 'q_c_02',
    tier: 'champion',
    category: 'math',
    question: 'Solve for x: 3x + 9 = 24',
    options: ['4', '5', '6'],
    correctIndex: 1,
    explanation: '3x = 15, so x = 5! Algebraic mastery! 💫',
    icon: '🔢',
  },
  {
    id: 'q_c_03',
    tier: 'champion',
    category: 'science',
    question: 'What is the speed of light approximately in vacuum?',
    options: ['300,000 km/s', '150,000 km/s', '50,000 km/s'],
    correctIndex: 0,
    explanation: 'Light travels at about 300,000 kilometers per second! ⚡',
    icon: '💡',
  },
  {
    id: 'q_c_04',
    tier: 'champion',
    category: 'words',
    question: 'What literary device compares two things using "like" or "as"?',
    options: ['Metaphor', 'Simile', 'Hyperbole'],
    correctIndex: 1,
    explanation: 'A simile uses "like" or "as", such as "bright like a star"! 📚',
    icon: '✍️',
  },
  {
    id: 'q_c_05',
    tier: 'champion',
    category: 'science',
    question: 'Which human organ purifies blood and produces urine?',
    options: ['Heart', 'Kidneys', 'Lungs'],
    correctIndex: 1,
    explanation: 'The kidneys filter waste from our blood! 🩺',
    icon: '🔬',
  },
]

export function getQuestionsByTier(tier: DifficultyTier): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.tier === tier)
}

export interface PuzzleTile {
  targetIndex: number
  label: string
  icon: string
  bg: string
}

export interface PuzzleDefinition {
  id: string
  title: string
  gridSize: 2 | 3
  description: string
  tiles: PuzzleTile[]
}

export const PUZZLES: readonly PuzzleDefinition[] = [
  {
    id: 'puzzle_qian_hui',
    title: '🌸 Qian Hui & Bunny',
    gridSize: 2,
    description: 'Chibi Qian Hui wearing her flower wreath with baby bunny!',
    tiles: [
      { targetIndex: 0, label: 'Flower Wreath', icon: '🌸', bg: '#ffe5ec' },
      { targetIndex: 1, label: 'Bunny Ears', icon: '🐰', bg: '#e8f0fe' },
      { targetIndex: 2, label: 'Star Pinafore', icon: '⭐', bg: '#fff3cd' },
      { targetIndex: 3, label: 'Sparkle Shoes', icon: '🎀', bg: '#e8f5e9' },
    ],
  },
  {
    id: 'puzzle_pet_party',
    title: '🐾 Pet Playground',
    gridSize: 2,
    description: 'The town pets playing together in the sunshine garden!',
    tiles: [
      { targetIndex: 0, label: 'Playful Pup', icon: '🐶', bg: '#ffe8d6' },
      { targetIndex: 1, label: 'Curious Cat', icon: '🐱', bg: '#ede0d4' },
      { targetIndex: 2, label: 'Happy Hamster', icon: '🐹', bg: '#ddbea9' },
      { targetIndex: 3, label: 'Chubby Panda', icon: '🐼', bg: '#cb997e' },
    ],
  },
  {
    id: 'puzzle_sunshine_school',
    title: '🏫 Sunshine Academy',
    gridSize: 3,
    description: 'Our lovely classroom with chalkboard, books and easel!',
    tiles: [
      { targetIndex: 0, label: 'School Bell', icon: '🔔', bg: '#fefae0' },
      { targetIndex: 1, label: 'Chalkboard', icon: '📐', bg: '#e9edc9' },
      { targetIndex: 2, label: 'Clock', icon: '⏰', bg: '#ccd5ae' },
      { targetIndex: 3, label: 'Teacher Desk', icon: '🍎', bg: '#faedcd' },
      { targetIndex: 4, label: 'Story Book', icon: '📖', bg: '#d4a373' },
      { targetIndex: 5, label: 'Color Easel', icon: '🎨', bg: '#ffe5ec' },
      { targetIndex: 6, label: 'Backpack', icon: '🎒', bg: '#e8f0fe' },
      { targetIndex: 7, label: 'Gold Star', icon: '🌟', bg: '#fff3cd' },
      { targetIndex: 8, label: 'Diploma', icon: '🎓', bg: '#e8f5e9' },
    ],
  },
]

export interface MinigameStats {
  memoryMatches?: number
  quizCorrect?: number
  mathQuizCorrect?: number
  puzzlesSolved?: number
  brainCoinsEarned?: number
  [key: string]: number | undefined
}

export function evaluateBadges(stats: MinigameStats): string[] {
  const earned: string[] = []
  if ((stats.memoryMatches ?? 0) >= 3) {
    earned.push('badge_memory')
  }
  if ((stats.mathQuizCorrect ?? 0) >= 5 || (stats.quizCorrect ?? 0) >= 5) {
    earned.push('badge_math')
  }
  if ((stats.puzzlesSolved ?? 0) >= 2) {
    earned.push('badge_puzzle')
  }
  if ((stats.brainCoinsEarned ?? 0) >= 50) {
    earned.push('badge_scholar')
  }
  return earned
}
