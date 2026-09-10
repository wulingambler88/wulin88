# Project Architecture

Qian Hui Avatar City is a client-only Phaser 3 game wrapped by a small HTML/CSS interface. Vite builds the responsive PWA, Capacitor packages that same build for Android, and the game uses versioned local saves. The runtime contains no LLM, public chat, advertising, payment, or child account system.

## Runtime layers

- `src/game`: Phaser configuration and startup.
- `src/minigames`: pure data catalogs for educational brain games (memory deck, chalkboard quiz questions across 3 tiers and 3 subjects, picture jigsaw puzzles, collectible badges).
- `src/scenes`: independently loaded world locations (`BootScene`, `PreloadScene`, `TownScene`, `HomeScene`, `ClothingShopScene`, `SupermarketScene`, `PetShopScene`, `ParkScene`, `CafeScene`, `SalonScene`, `ToyShopScene`, `SchoolScene`). Scenes own presentation, not durable data contracts.
- `src/navigation`: centralized `LocationManager` for destination routing, lock transitions, and location status checks.
- `src/characters`: modular avatar rendering (`AvatarRenderer`), poses, 5 hairstyles (`long_waves`, `twin_buns`, `ponytail`, `bob`, `pixie`), color customization, and clothing layers.
- `src/pets`: `Pet` game object and `PetManager` handling roaming, feeding, petting hearts, and adoption persistence.
- `src/data`: item, clothing, pet, location, and furniture catalogs.
- `src/economy`: `CurrencyManager` managing player Star Coins balance with strict non-negative guards.
- `src/shops`: `ShoppingCartManager` and `ShopPurchaseService` handling boutique try-on/preview, unique clothing ownership, shopping cart lines, and supermarket checkout.
- `src/state`: centralized `PlayerState` holding active player data, synchronizing save, currency, inventory, pets, and clothing.
- `src/items`, `src/inventory`, `src/furniture`: reusable world-object managers and UI.
- `src/interaction`: reusable pointer, drag, and drop-zone rules.
- `src/audio`: failure-safe sound feedback with custom synthesizer tones.
- `src/save`: versioned save schema with sequential migration pipeline (V1→V2→V3→V4→V5).
- `src/ui`: accessible HTML overlay feedback and reusable `SpeechBubble` component.
- `tests`: deterministic logic tests.

Scenes transition by key (`TownScene`, `HomeScene`, `ClothingShopScene`, `SupermarketScene`, `PetShopScene`, `ParkScene`, `CafeScene`, `SalonScene`, `ToyShopScene`, `SchoolScene`). Home is one 2880×540 horizontal world split into three 960-wide rooms where adopted pets freely roam and interact. Town connects all 9 playable buildings with animated feedback and interactive entrance portals. The fixed 960×540 logical canvas scales with `Phaser.Scale.FIT`, preserving composition across phone, tablet, and desktop sizes.

## Key decisions

- Touch and mouse share Phaser pointer events.
- Centralized `LocationManager` guards scene transitions against rapid double-taps and handles 360ms polished fades.
- Global `PlayerState` synchronizes currency (`CurrencyManager`), inventory (`InventoryManager`), owned clothing, equipped outfit, adopted pets, and unlocked locations across all scenes without refreshing the page.
- Try-on preview in `ClothingShopScene` creates a temporary preview state without destroying previously equipped clothes; cancel restores the original outfit, and buy verifies balance before persisting.
- Supermarket shopping basket in `ShoppingCartManager` tracks quantities and total cost, supporting both tap-to-add and dragging into the cart, with checkout validation and safe exit prompts.
- Pet adoption in `PetShopScene` integrates directly with `PetManager` and `HomeScene`, allowing adopted puppies, kittens, bunnies, hamsters, and pandas to be petted, fed treats, and placed in rooms.
- Brain-training educational hub (`BrainHubModal`) accessible anywhere via top/bottom navigation bar, chalkboard in `SchoolScene`, or toy play mat in `ToyShopScene`.
- Memory Card Match with 3 difficulty tiers (Junior 8 cards, Explorer 12 cards, Champion 16 cards), flip animations, pair tracking, and star coin rewards.
- Chalkboard Quiz with 3 difficulty tiers (Junior 7-8yo, Explorer 9-10yo, Champion 11-12yo) and 3 categories (Math, Science/Nature, Words/Spelling) providing instant positive feedback and explanations.
- Picture Tile Puzzle with kid-friendly click-to-swap mechanics across 2x2 and 3x3 grids depicting Qian Hui, pets, and Sunshine Academy.
- Brain Badges & Trophy Scrapbook tracking 4 collectible badges (`badge_memory`, `badge_math`, `badge_puzzle`, `badge_scholar`) with shiny gold medals and live player brain stats.
- Makeover salon in `SalonScene` allows real-time hairstyle and hair color switching with instant character preview and save persistence.
- Park playground features functional interactive swings, animated slide, and sandbox treasure-digging minigame for Star Coins.
- Sunshine Academy school classroom features interactive chalkboard lessons, paint easel, study desks, and ringing school bell.
- Honeycomb Café provides interactive beverage brewing stations and cozy dining booths.
- Purchased items immediately integrate with the global inventory and wardrobe, allowing bought clothing to be worn at Home and bought food to be eaten with happy feedback.
- Meaningful changes are debounced or immediately saved into a validated local save. Sequential migrations support V1→V2→V3→V4→V5.
- World-object depth is recalculated from Y, with explicit pose overrides only where interaction requires one.
- Original vector artwork generated at runtime with pastel sticker-book identity matching the 2.5D reference character art and responsive mobile HUD.
