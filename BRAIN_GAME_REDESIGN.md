# Little Scholars Brain Games Hub Architecture & Redesign

## 1. Overview
The Little Scholars Brain Games Hub (`BrainHubModal.ts`) replaces isolated, generic placeholder minigames with an integrated, high-aesthetic educational suite designed specifically for preschool and early elementary players. It provides four distinct experiences: **Memory Garden**, **Quiz Academy**, **Puzzle Workshop**, and the **Honor Scrapbook**.

---

## 2. Component Architecture
`BrainHubModal` is implemented as a responsive glassmorphic modal overlay (`src/ui/BrainHubModal.ts`), equipped with:
- **Safety Pointer Shield**: Disables underlying Phaser scene inputs on modal open and restores them on close, preventing accidental clicks on underlying map locations.
- **Professor Owl Mascot**: Animated mascot header providing encouraging voice and speech bubbles.
- **Universal Tab Navigation**: Swift switching between all four game modules with state preservation.
- **Economic Integration**: Directly deposits won Star Coins into `playerState.currency` and updates achievements in `playerState.data.minigames`.

---

## 3. Game Modules

### A. Memory Garden (`tab="memory"`)
- **Concept**: A botanical card-matching game featuring cute fauna, flowers, and fruit illustrations.
- **Difficulty Tiers**:
  - *Junior*: 8 cards (4 pairs) — Ideal for quick preschool play. Payout: +15 ⭐.
  - *Explorer*: 12 cards (6 pairs) — Balanced challenge. Payout: +25 ⭐.
  - *Champion*: 16 cards (8 pairs) — Advanced matching. Payout: +35 ⭐.
- **Mechanics**:
  - Smooth card flip transition with card-back star embossing.
  - 650ms mismatch reveal delay with automatic flip-back.
  - Instant pair lock and chime SFX on successful match.
  - Celebratory confetti burst and victory dialogue upon clearing the deck.

### B. Quiz Academy (`tab="quiz"`)
- **Concept**: 10 curriculum-aligned questions covering colors, counting, animals, nature, and everyday logic.
- **Sample Question Bank**:
  1. *"What color do red and yellow make when mixed?"* (Orange)
  2. *"How many legs does a cute little kitten have?"* (4)
  3. *"Which of these is a healthy, crunchy fruit?"* (Crisp Apple)
  4. *"What shape is the bright full moon in the sky?"* (Circle)
  5. *"Where do fish love to swim and play?"* (Water)
- **Mechanics**:
  - 3 large, accessible answer buttons with emoji prompts.
  - Correct answer triggers green sparkle flash, chime SFX, and +5 ⭐ per question.
  - Incorrect answer gently highlights the right option with encouraging coaching ("Try again next time!").
  - Final report card awards Star Scholar badge.

### C. Puzzle Workshop (`tab="puzzle"`)
- **Concept**: $3 	imes 3$ sliding and tile placement picture puzzles featuring original game artwork:
  1. *Golden Kitten Garden*
  2. *Starlet Teddy Playroom*
  3. *Magic Town Carousel*
- **Mechanics**:
  - Visual tile grid with numbered guide hints for early learners.
  - Snap-to-target grid physics with soft drop shadow.
  - Audio confirmation and Star Coin bonus (+20 ⭐) upon completion.

### D. Honor Scrapbook (`tab="badges"`)
- **Concept**: Visual trophy wall celebrating academic and exploratory achievements.
- **8 Collectible Badges**:
  1. 🌸 **Green Thumb Memory**: Won a Memory Garden game.
  2. 🎓 **Star Scholar**: Scored 3+ correct in Quiz Academy.
  3. 🧩 **Master Builder**: Solved a Puzzle Workshop picture.
  4. 🐾 **Pet Whisperer**: Adopted and cared for a rescue pet.
  5. 👗 **Fashionista**: Tried on 5+ outfits in the Boutique or Wardrobe.
  6. 🛒 **Super Shopper**: Scanned and purchased 3+ supermarket items.
  7. ✂️ **Style Icon**: Got a salon haircut and color makeover.
  8. 🌟 **Grand Mayor**: Visited all 9 locations in Qian Hui Avatar City.
- **Live Tracking**: Badges display real-time progress bars and unlock celebration sparkles.

---

## 4. Verification & Testing
- **Automated Tests**: Fully covered by `tests/brain-hub.test.ts` (6 unit tests verifying card flipping, matching logic, quiz scoring, puzzle tile tracking, and badge unlocks).
- **Audit Screenshots**:
  - `screenshots_audit/02_BrainGames_Memory.png`
  - `screenshots_audit/03_BrainGames_Quiz.png`
  - `screenshots_audit/04_BrainGames_Puzzle.png`
  - `screenshots_audit/05_BrainGames_Badges.png`
