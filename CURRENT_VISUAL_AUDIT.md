# Current Visual Audit (Prompt 8)

This visual audit evaluates the visual presentation, UI ergonomics, character animation, environmental depth, and mobile layout of **Qian Hui Avatar City** prior to Prompt 8 art direction polish.

Audit completed using automated Playwright captures on Desktop (`1280×720`) and Mobile (`844×390`).

---

## 1. Executive Summary

| Category | Current State | Target State (Prompt 8) |
|---|---|---|
| **Art Direction** | Functional prototype with bright pastel flat shapes | Cohesive "Soft Candy Town" 2.5D toy diorama aesthetic |
| **UI Icons** | Emoji-based (`🗺️`, `🏠`, `⭐`, `🎒`, `👗`, `✨`, `🐾`, `✏️`, `🧠`, `📜`) | Original unified vector icon set with candy styling |
| **Buttons & Controls** | Flat borders with basic hover states | Tactile candy 3D buttons with squash press feedback & 48px+ touch targets |
| **Character Animation** | Completely static idle pose; frozen eyes | Subtle breathing loop, natural randomized blinking (2.5–5s), drag squash-and-settle |
| **Environments** | Flat colored planes; objects appear pasted on | Layered dioramas: baseboard trim, floor plane, contact shadows, depth cues |
| **Scene Transitions** | Standard black camera fade (360ms) | Cheerful pastel iris / cloud wipe transition |
| **Mobile Ergonomics** | Crowded bottom bar on narrow viewports; emojis scale awkwardly | Safe-area padding, icon+label hierarchy, touch-optimized spacing |

---

## 2. Location-by-Location Audit

### 2.1 Town Map (`TownScene`)
- **Captured File**: `art-audit/before/desktop/01_town.png`, `art-audit/before/mobile/01_town.png`
- **Visual Strengths**: Friendly miniature layout, pastel roads, recognizable building silhouettes, animated floating clouds and moving car.
- **Visual Weaknesses**:
  - Buildings look like flat vector stickers without depth or contact shadows onto the grass.
  - Building badges combine emojis and plain text (`🏠 Home`, `👗 Boutique`).
  - Trees and bushes are flat 2D disks without volume or subtle wind sway.
  - Road markings and borders lack soft candy bevels.
  - Background sky is a flat gradient without atmospheric depth.

### 2.2 Home: Bedroom (`HomeScene` Room 0)
- **Captured File**: `art-audit/before/desktop/02_home_bedroom.png`, `art-audit/before/mobile/02_home_bedroom.png`
- **Visual Strengths**: Cute lavender/pink color palette, functional bed and vanity, clear room layout.
- **Visual Weaknesses**:
  - Flat wall and floor transition with no baseboard or skirting board.
  - Bed, wardrobe, and vanity cast no contact shadows onto the floor plane.
  - Window lacks soft light spill or pastel frame molding.
  - Loose room props (teddy bear, books) float on the floor without grounded contact shadows.

### 2.3 Home: Living Room (`HomeScene` Room 1)
- **Captured File**: `art-audit/before/desktop/03_home_living.png`, `art-audit/before/mobile/03_home_living.png`
- **Visual Strengths**: Cozy sofa, coffee table, potted plant, television prop.
- **Visual Weaknesses**:
  - The yellow wall lacks warmth and depth; feels like an unshaded polygon.
  - Sofa and coffee table have stark black/plum outlines that feel overly harsh.
  - Wall art and clock appear flat and disconnected from the room perspective.
  - Empty wall space on wider desktop viewports creates visual dead zones.

### 2.4 Home: Kitchen (`HomeScene` Room 2)
- **Captured File**: `art-audit/before/desktop/04_home_kitchen.png`, `art-audit/before/mobile/04_home_kitchen.png`
- **Visual Strengths**: Refrigerator, stove, dining table, kitchen cabinet styling.
- **Visual Weaknesses**:
  - Refrigerator and counters are stark rectangular blocks with minimal detail.
  - Food items sitting on tables or inside fridge lack depth and contact shadows.
  - Tile pattern on wall/floor is missing, making it feel less like a kitchen diorama.

### 2.5 Clothing Boutique (`ClothingShopScene`)
- **Captured File**: `art-audit/before/desktop/05_clothing_boutique.png`, `art-audit/before/mobile/05_clothing_boutique.png`
- **Visual Strengths**: Boutique shopkeeper NPC with greeting bubble, clothing racks, mirror, try-on preview.
- **Visual Weaknesses**:
  - Clothing rack is flat and minimal; hangers look rudimentary.
  - Mirror reflection is a flat cyan polygon rather than a shimmering glass surface.
  - The clothing catalogue panel on the right is an HTML grid with emojis (`👗`, `🩳`, `👟`) and plain cards rather than a boutique fashion rack.

### 2.6 Supermarket (`SupermarketScene`)
- **Captured File**: `art-audit/before/desktop/06_supermarket.png`, `art-audit/before/mobile/06_supermarket.png`
- **Visual Strengths**: Friendly cashier NPC, multiple product shelves, physical grocery basket.
- **Visual Weaknesses**:
  - Products on shelves are represented by raw unicode emojis (`🍎`, `🍌`, `🥛`, `🍓`), creating an inconsistent visual style.
  - Shelves are basic rectangular boxes without perspective or store signage.
  - The checkout cart panel feels like an e-commerce checkout sidebar rather than an interactive toy shopping basket.

### 2.7 Pet Shop (`PetShopScene`)
- **Captured File**: `art-audit/before/desktop/07_pet_shop.png`, `art-audit/before/mobile/07_pet_shop.png`
- **Visual Strengths**: 5 adoptable pets (puppy, kitten, bunny, hamster, panda) with custom colors.
- **Visual Weaknesses**:
  - Adoption pens are basic flat rounded boxes on the floor.
  - Pets are frozen when not being petted; lack breathing, ear twitching, or tail wagging idle animations.
  - Floor and walls are monochrome mint with no toy store charm.

### 2.8 Park Playground (`ParkScene`)
- **Captured File**: `art-audit/before/desktop/08_park.png`, `art-audit/before/mobile/08_park.png`
- **Visual Strengths**: Interactive swings, slide with character descent, sandbox coin digging.
- **Visual Weaknesses**:
  - Swing set and slide structures are flat line-art graphics without tactile toy materials.
  - Sandbox is an untextured yellow patch on green ground.
  - Park background is an empty sky with no gentle rolling hills, distant trees, or park benches.

### 2.9 Honeycomb Café (`CafeScene`)
- **Captured File**: `art-audit/before/desktop/09_cafe.png`, `art-audit/before/mobile/09_cafe.png`
- **Visual Strengths**: Warm bakery counter, espresso machine, dining booths.
- **Visual Weaknesses**:
  - Espresso machine lacks animated steam particles or brewing feedback.
  - Bakery display case is a flat polygon without transparent glass gloss highlights.
  - Lighting is identical to outdoor scenes; lacks warm café ambiance.

### 2.10 Makeover Salon (`SalonScene`)
- **Captured File**: `art-audit/before/desktop/10_salon.png`, `art-audit/before/mobile/10_salon.png`
- **Visual Strengths**: Salon chair, instant hairstyle and hair color preview.
- **Visual Weaknesses**:
  - Salon chair looks 2D flat rather than a plush swivel chair.
  - Mirror has no soft vanity lights or reflection gradient.
  - Tool station has simple stick scissors and comb.

### 2.11 Starlet Wonder Toy Shop (`ToyShopScene`)
- **Captured File**: `art-audit/before/desktop/11_toy_shop.png`, `art-audit/before/mobile/11_toy_shop.png`
- **Visual Strengths**: Interactive play mat, robot and teddy bear props.
- **Visual Weaknesses**:
  - Shelves look clinical and empty.
  - Play mat lacks rounded borders, foam tile textures, or toy markings.

### 2.12 Sunshine Academy School (`SchoolScene`)
- **Captured File**: `art-audit/before/desktop/12_school.png`, `art-audit/before/mobile/12_school.png`
- **Visual Strengths**: Cycling chalkboard lessons (math, nature, spelling), paint easel, student desks, school bell.
- **Visual Weaknesses**:
  - Chalkboard frame is a plain thin border without wooden texture or chalk ledge with chalk sticks.
  - School desks are plain brown boxes.
  - Room feels overly wide on desktop with large empty floor expanses.

---

## 3. UI & Ergonomics Audit

### 3.1 Main HUD & Top Bar
- Uses emojis (`⭐`, `📜`, `🧠`, `☀️`, `🔊`) in circular buttons.
- Needs meters (`😊`, `⚡`, `🍎`, `🎈`) crowd the top bar on mobile screens narrower than 480px.
- Star Coin pill has basic text styling without coin sheen or tactile depth.

### 3.2 Bottom Navigation Bar
- Contains up to 8 buttons simultaneously in Home (`Town`, `Home`, `Clues`, `Games`, `Bag`, `Dress`, `Avatar`, `Pet`, `Edit`).
- On mobile devices (`844×390`), button labels compress and touch targets become narrow (under 40px in some orientations).
- Icons are unicode emojis which render inconsistently across Windows, Android, and iOS.

### 3.3 Modals (Brain Hub, Clues Journal, Character Creator, Wardrobe)
- Modal backdrops are semi-transparent black overlays that obscure the cozy game world.
- Tabs and cards use rectangular corners and web-style border lines rather than rounded candy buttons.
- Close buttons are small `×` text spans instead of rounded, friendly circle buttons.

---

## 4. Character Presentation & Animation Audit

- **Avatar Proportions**: Chibi ratio is generally cute (45% head, 35% body, 20% legs), but when standing next to doors and supermarket shelves, scale needs fine-tuning.
- **Idle Motion**: When untouched, the character is 100% motionless. Needs a gentle 2.5–3s breathing cycle.
- **Blinking**: Character eyes remain permanently wide open with static highlights. Natural 2.5–5s blinks are absent.
- **Dragging**: When picked up, the character moves 1:1 with pointer without any elevation scale (needs `1.04x`) or shadow offset. When dropped, the character teleports to the anchor without squash-and-stretch.
- **Interactions**: Sitting and sleeping transitions snap instantly to the target coordinates without smooth tweening.

---

## 5. Summary of Priority Polish Items for Prompt 8

1. **Brand New Original Vector Icon System**: Replace all 18+ emojis in HUD, bottom bar, and shop cards with custom SVG icons (Star, Town Map, Home, Bag, Dress, Avatar Studio, Pet Whistle, Edit Mode, Undo, Redo, Clues, Brain Hub, Basket, Close, Sound, Sun/Moon).
2. **Candy Toy UI Design System**:
   - Candy pill buttons with press compression (`scale(0.95)`).
   - Creamy surfaces (`#FFFDF7`), pastel candy accents, and soft dark-plum outlines (`#663D63`).
   - Minimum 48px touch targets on mobile with safe-area spacing.
3. **Character Life & Micro-Animations**:
   - Add idle breathing tween (`scaleY: 1.015` over 2.8s loop).
   - Add randomized eye blink timer (2.5–5.5s with occasional double-blink).
   - Add drag pickup lift (`scale: 1.04`, shadow expands) and drop squash-settle (`1.04` → `0.97` → `1.01` → `1.00`).
   - Add smooth sitting/sleeping positional interpolation.
4. **Environmental Layering & Contact Shadows**:
   - Add soft radial contact shadows under character feet, pets, and key furniture items.
   - Add baseboard / skirting trim to all indoor scenes to ground the back walls onto the floor planes.
   - Add ambient room details (rugs, wall trims, subtle window light).
5. **Polished Scene Transitions**:
   - Implement pastel iris / cloud wipe transition across all 10 scenes, replacing the stark black fade.
   - Centralize motion tokens (`src/theme/MotionTokens.ts`) for consistent UI and scene timings.
