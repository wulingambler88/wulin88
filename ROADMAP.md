# V0.1 Roadmap

## Milestone 1 — Core room interaction (implemented)

- Phaser/Vite/TypeScript foundation.
- PWA manifest and Android Capacitor project configuration.
- Boot, preload, town map, and bedroom scenes.
- Original placeholder character and room art.
- Mouse/touch character dragging.
- Floor, chair, and bed pose interactions.
- Invalid-drop return, automatic save/load, reset, responsive shell, and logic tests.

## Milestone 2 — Home vertical slice (implemented)

- Data-driven item registry.
- Ten starter room items: five foods, two toys, and three props.
- Layered avatar customization and expandable inventory drawer.
- Eating interaction and character expression feedback.
- Ten furniture items, edit mode, snapping, remove/place, undo/redo, and room-layout persistence.
- Living room and kitchen within Home.
- Accessibility and device-layout verification.
- Failure-safe audio manager, settings, debug anchors, and performance pass.
- Android packaging verification and installable PWA acceptance checks.

## Milestone 3 — Connected Playable Town (implemented)

- Centralized `LocationManager` and miniature town map (`TownScene`) with animated buildings and coming-soon indicators.
- Global Star Coin currency system (`CurrencyManager`) starting at 500 ⭐ with save persistence and animated HUD pill.
- Playable Clothing Boutique (`ClothingShopScene`): shopkeeper NPC with speech bubble, 21 items across 6 categories, real-time try-on preview, cancel/wear/buy flow, and wardrobe synchronization.
- Interactive Supermarket (`SupermarketScene`): cashier NPC, 15 food products, physical shelf-to-basket drag and tap interaction, `ShoppingCartManager`, line/total calculation, checkout, and exit confirmation.
- Complete core loop: Home → Town → Boutique (try/buy) → Supermarket (basket/checkout) → Home (inventory eating/outfit wearing) → Save → Reload.
- Save schema V4 migration preserving legacy V1, V2, and V3 saves, starCoins, inventory quantities, and owned outfits.
- Comprehensive automated test suite (11 test files, 40 tests) for currency, cart, purchase, navigation, and save migrations.

## Milestone 4 — Complete Town Life & Character Studio (implemented)

- 2.5D Reference Character Customization:
  - 5 distinctive hairstyles (`long_waves` with soft bangs matching reference art, `twin_buns`, `ponytail`, `bob`, `pixie`).
  - Reference girl outfit: blue bunny pinafore dress (`dress_bunny_pinafore`), pearl flower wreath headband (`hat_flower_pearl`), and lace ribbon shoes (`shoes_ribbon_blue`).
  - Dynamic hair color palette, skin tones, eye colors, and blushing cheeks.
- Adoptable Pets System (`src/pets`):
  - Catalog of 5 adoptable pets: Buttercup Puppy 🐶, Mimi Kitten 🐱, Snowdrop Bunny 🐰, Peanut Hamster 🐹, and Bao Bao Panda 🐼.
  - Interactive Pet Shop (`PetShopScene`) with cozy adoption pens, animated shopkeeper, and adoption confirmation.
  - Full `PetManager` integration in `HomeScene`: pets roam rooms, can be petted (hearts fly, happiness increases), fed treats, and placed on furniture.
- Complete 9-Location Playable Town:
  - `TownScene`: Unlocked entrance portals to all 9 town buildings.
  - `ParkScene`: Interactive playground swings, animated slide, and sandbox treasure-digging minigame for bonus Star Coins.
  - `CafeScene`: Honeycomb Bakery & Café with interactive espresso & tea brewing stations, pastry display, and cozy dining booths.
  - `SalonScene`: Makeover studio with styling chair and real-time hairstyle and hair dye color palette.
  - `ToyShopScene`: Interactive toy displays, testing play mat, and cheerful shopkeeper.
  - `SchoolScene`: Sunshine Academy classroom with cycling chalkboard lessons (math, spelling, nature, music), art easel painting, study desks, and ringing school bell.
- Save Schema V5 Upgrade:
  - Sequential migrations supporting V1→V2→V3→V4→V5.
  - Full persistence of adopted pets, avatar customization, unlocked locations, minigame high scores, and Star Coins.
- Comprehensive Verification:
  - 12 Vitest test files (45 unit tests) passing.
  - 0 TypeScript compiler errors (`pnpm check`).
  - 0 ESLint warnings or errors (`pnpm lint`).
  - Clean production PWA build (`pnpm build`).

## Milestone 6 — World redesign (implemented)

- [x] Baseline audit and before captures
- [x] Layered terrain, distinct storefront, furniture and room-shell art
- [x] Larger hero, blink/held-item fixes, residents and ambient touch feedback
- [x] Portrait-led SVG HUD, contextual shop panels, settings and fixed daily gift
- [x] Save ordering compatibility and 82-test suite
- [x] Finished venue-specific raster dressing and resolved return-to-town navigation timings

## Milestone 7 — Visual Consistency + Gameplay Integration Master Pass (implemented)

- [x] Universal Chibi dollhouse character standard: 2.5 head proportions, layered hair with back-locks and side-bangs, glossy expressive eyes, flower wreath headband, and blue bunny pinafore dress.
- [x] Universal NPC and Pet standard: matching chibi proportions for Maya (Salon), Oliver (Supermarket), Daisy (Pet Shop), Leo (Café), Emma (School), Sparky (Toy Shop), and all 5 pets (Buttercup, Mimi, Snowdrop, Peanut, Bao Bao).
- [x] Complete 9-Location Visual Pass:
  - `TownScene`: Hand-painted illustrated town map with animated town residents, cobblestone paths, water canals, flower gardens, and interactive location pills.
  - `HomeScene`: Multi-room dollhouse with cozy wallpaper, sunlight drapes, parquet floors, interactive bed, armchair, floral rug, and wardrobe.
  - `ClothingShopScene`: Cloudberry Boutique with wooden dress rack, shoe shelf, baroque mirror, potted monstera, and shopkeeper speech bubble.
  - `SupermarketScene`: Sunny Basket Market with 3-tier grocery shelves, price badges, produce stand with striped awning, cashier counter, and Oliver NPC.
  - `PetShopScene`: Pawprints Pet Boutique with 5 pet adoption beds, price labels, adoption counter, and Daisy NPC.
  - `CafeScene`: Honeycomb Bakery & Café with barista Leo, blackboard menu, espresso machine, pastry cloche, and booth seating.
  - `SalonScene`: Sparkle & Snip Salon with lighted Hollywood vanity mirror, shampoo basin, stylist Maya, and real-time haircut/dye controls.
  - `ToyShopScene`: Starlet Wonder Toy Shop with toy display shelves, plushies, robots, play mat, and Sparky NPC.
  - `SchoolScene`: Sunshine Academy with cycling lesson blackboard, paint easel, study desks, and teacher Emma.
  - `ParkScene`: Sunny Meadow Park with playground slide, swings, and sandbox treasure-digging.
- [x] Core Needs System Integration: Happiness, Energy, Hunger, and Fun HUD meters (0–100) dynamically reacting to food, sleep, pets, and brain games.
- [x] Brain Academy Hub Modal: Full modal overlay with 4 educational tabs (Memory Garden, Quiz Academy, Puzzle Workshop, Honor Scrapbook) with input shielding to prevent canvas click bleed.
- [x] Wardrobe & Build Mode: Quick-placement furniture tray (Undo, Redo, Remove), multi-category wardrobe drawer, and Surprise Me randomizer.
- [x] Responsive layout verification: Full desktop (1280×720), iPhone 14/15 (844×390), and iPhone 15 Pro Max (932×430) support.
- [x] Quality & Verification: 83 Vitest tests passing (100%), 0 TypeScript errors (`pnpm check`), clean production build with PWA service worker. All 19 audit screenshots captured and verified in `screenshots_audit/`.

## Milestone 5 — Kids 7+ Brain Training Minigames & Educational Hub (implemented)

- Brain Training Studio Hub (`BrainHubModal`):
  - Accessible from anywhere via top bar 🧠 Brain button and bottom bar navigation.
  - In-world physical triggers: interactive Chalkboard in `SchoolScene` and Play Mat in `ToyShopScene`.
  - Four tabbed game modes tailored for young learners aged 7-12.
- Memory Match Game:
  - 3 difficulty tiers: Junior (8 cards = 4 pairs), Explorer (12 cards = 6 pairs), Champion (16 cards = 8 pairs).
  - Smooth 3D-perspective card flip animations and chime feedback on match.
  - Flips and pairs counters with 15–35 ⭐ Star Coin rewards and celebration banners.
- Chalkboard Quiz:
  - Age-adaptive difficulty tiers: Junior (7–8yo), Explorer (9–10yo), Champion (11–12yo).
  - 3 educational categories: ➕ Math, 🌿 Science & Nature, 📚 Words & Spelling.
  - Interactive multiple-choice cards with instant color feedback (soft green/red), helpful explanations, and star coin payouts.
- Picture Tile Puzzle:
  - Jigsaw puzzles of cute chibi art (Qian Hui & Bunny 2×2, Pet Playground 2×2, Sunshine Academy 3×3).
  - Kid-friendly click-to-swap mechanic (tap first tile to highlight, tap second tile to swap).
  - Victory celebration and 25 ⭐ Star Coin reward upon assembling all tiles correctly.
- Brain Badges & Scrapbook:
  - 4 collectible golden achievement badges:
    - 🧠 Memory Master (`badge_memory`): Win 3 Memory Match games.
    - 📐 Math Wizard (`badge_math`): Score 5 correct answers in Math Quiz.
    - 🧩 Puzzle Champion (`badge_puzzle`): Solve 2 Picture Puzzles.
    - 🎓 Star Scholar (`badge_scholar`): Earn 50 ⭐ from Brain Games.
  - Live player brain stats: memory wins, quiz correct count, puzzles solved, and brain coins earned.
- Quality & Verification:
  - 16 Vitest test files (62 unit tests) passing with 100% data and logic validation.
  - 0 TypeScript errors (`pnpm check`).
  - 0 ESLint warnings (`pnpm lint`).
  - Clean production PWA build (`pnpm build`).
