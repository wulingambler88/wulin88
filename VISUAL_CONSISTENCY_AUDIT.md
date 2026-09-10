# Visual Consistency Audit — Qian Hui Avatar City

Date: 2026-09-05  
Milestone: Visual Consistency + Gameplay Integration Master Pass  
Engine: Phaser 3.90 + Vite + TypeScript  

---

## 1. Executive Summary

A comprehensive visual audit was conducted across all 12 game scenes, modals, interactive props, character rendering systems, and UI components.

The audit confirms the primary problem identified in the brief:
> **The game currently contains TWO visual languages:**
> 1. **NEW Illustrated Style**: Storybook textures, soft pastel palettes (cream, peach, mint, sky, lavender), warm outlines (`0x78504b`), soft contact shadows, layered terrain, and illustrated shop facades.
> 2. **OLD Prototype Style**: Flat vector geometry (`fillRect`), production emoji strings (`🍎`, `🧸`, `🐶`, `☕`, `✂️`), raw text smileys (`◕‿◕`), thin mechanical outlines, and form-like UI panels.

To establish **ONE COHERENT WORLD**, all prototype elements must be upgraded to the shared illustrated language while strictly preserving separate hitboxes, drop zones, interaction anchors, and gameplay contracts.

---

## 2. Location-by-Location Visual Classification

Classification Keys:
- **NEW / ACCEPTABLE**: Meets the illustrated storybook standard; maintain and polish.
- **OLD / REPLACE**: Flat vector geometry, emoji, or prototype placeholder; requires visual redesign.
- **MIXED / NEEDS INTEGRATION**: Partially illustrated but juxtaposed with prototype elements; requires unification.

---

### Scene 1: Town Map (`TownScene`)

| Element | Status | Current Implementation | Action Required |
|---|---|---|---|
| Terrain & Paths | **NEW** | Layered dirt path, grass mounds, stone border | Keep; add ambient butterfly/leaf flutter |
| Building Storefronts | **NEW** | Independent illustrated sprite atlas (`buildings-v1.png`) | Keep; hitboxes already calibrated |
| Boardwalk Pier & Pond | **NEW** | Wooden plank deck with lily pads & water ripples | Keep |
| Companion Kitten & Ducky | **NEW** | Vector-drawn illustrated chibi pets with ear/tail bob | Keep; match new pet sprite standard |
| Ambient Residents | **MIXED** | Chibi bodies but simple circular heads | Upgrade to reusable illustrated NPC base |
| Lamp Post & Fountain | **NEW** | Layered graphics with tap-to-toggle warm light & splash | Keep |
| Town Banner & Profile Card | **NEW** | Glassmorphic card, Lv. 8 progress bar, Star Coin pill | Keep |

---

### Scene 2: Home — Bedroom (`HomeScene` Room 0)

| Element | Status | Current Implementation | Action Required |
|---|---|---|---|
| Wallpaper & Flooring | **NEW** | Storybook wall & wood floor from `rooms-v1.png` | Keep |
| Bed | **NEW** | Illustrated pastel bed sprite (`world-furniture`) | Keep; enhance sleep animation + "Zzz" VFX |
| Lamp | **MIXED** | Interactive lamp toggles warm light, but base is simple | Add room tint darkening when turned off |
| Armchair & Rug | **NEW** | Illustrated furniture sprites with sitting anchor | Keep |
| Wardrobe | **MIXED** | Furniture sprite exists, but opens plain HTML panel | Connect to new Visual Wardrobe experience |
| Mirror | **NEW** | Wall mirror with sparkle reaction on tap | Keep |
| Books & Plushie | **OLD** | Starter props use emoji text (`🧸`, `📘`) in circle | Replace with illustrated prop rendering |

---

### Scene 3: Home — Living Room (`HomeScene` Room 1)

| Element | Status | Current Implementation | Action Required |
|---|---|---|---|
| Wallpaper & Flooring | **NEW** | Storybook wall & parquet floor (`rooms-v1.png`) | Keep |
| Sofa | **NEW** | Illustrated 2-seater pastel couch | Keep; add cozy sit/reading pose |
| TV Console | **MIXED** | Sprite exists, but tap channel change needs more visual screens | Add 3 cute illustrated animated channels |
| Bookshelf | **MIXED** | Illustrated shelf; tapping currently only toasts | Tap to spawn readable/holdable illustrated book |
| Indoor Plant | **MIXED** | Illustrated potted fiddle leaf; static | Add interactive leaf rustle tween on tap |
| Ball Prop | **OLD** | Vector soccer ball emoji (`⚽`) | Replace with illustrated bounceable pastel ball |

---

### Scene 4: Home — Kitchen (`HomeScene` Room 2)

| Element | Status | Current Implementation | Action Required |
|---|---|---|---|
| Wallpaper & Flooring | **NEW** | Tile wall & check floor (`rooms-v1.png`) | Keep |
| Kitchen Counter & Cabinets | **NEW** | Peach cabinet with marble top & chrome handles | Keep |
| Fridge (`InteractiveFridge`) | **MIXED** | Opens drawer, but items inside use emoji strings | Replace food icons with illustrated food items |
| Sink (`InteractiveSink`) | **NEW** | Interactive tap with running water stream & bubbles | Keep |
| Cooking Stove | **OLD** | Simple vector burners; frying pan is prototype circle | Replace with illustrated pan, sizzle particles |
| Blender | **OLD** | Basic geometric shape with emoji fruit | Replace with illustrated smoothie blender |
| Food & Drink Props | **OLD** | Milk, apple, banana rendered as emoji text | Upgrade to shared illustrated food asset system |

---

### Scene 5: Clothing Boutique (`ClothingShopScene`)

| Element | Status | Current Implementation | Action Required |
|---|---|---|---|
| Boutique Interior Shell | **NEW** | Illustrated clothing boutique backdrop | Keep |
| Clothing Racks | **NEW** | Illustrated rack sprites with hanging garments | Add physical rack tap to highlight outfits |
| Fitting Mirror | **NEW** | Full-length ornate mirror with sparkle reaction | Keep |
| Shopkeeper Clara | **MIXED** | Uses character model with apron | Upgrade with unique hairstyle, blink, greeting |
| Catalogue Drawer | **MIXED** | Slide-out HTML panel with CSS swatches | Connect to visual garment cards with live preview |
| Try-on / Buy Flow | **NEW** | Real-time outfit preview on avatar | Keep; add celebration sparkle on purchase |

---

### Scene 6: Supermarket (`SupermarketScene`)

| Element | Status | Current Implementation | Action Required |
|---|---|---|---|
| Store Environment | **OLD** | Flat `fillRect` light blue wall + green floor | Redesign with illustrated supermarket shelves & tiles |
| Produce Stand | **NEW** | Fruit display sprite (`world-furniture` 10) | Keep as hero display |
| Grocery Shelves | **OLD** | Geometric rounded rectangles with white shelf bars | Replace with illustrated modular shelf units |
| Chilled Beverage Case | **OLD** | Flat cyan rectangle with white door outlines | Replace with illustrated refrigerator case with glass gloss |
| Product Display Items | **OLD** | 15 items rendered as white circles with emoji icons | Replace with illustrated grocery props |
| Checkout Counter & Register | **OLD** | Flat peach rectangle counter | Replace with illustrated counter, scanner, cash drawer |
| Cashier Oliver | **MIXED** | Character model behind counter | Upgrade with cashier cap, name badge, cheerful dialogue |
| Basket & Cart System | **NEW** | Functional `ShoppingCartManager` + DOM tray | Keep logic; update product thumbnails to illustrated style |

---

### Scene 7: Pet Shop (`PetShopScene`)

| Element | Status | Current Implementation | Action Required |
|---|---|---|---|
| Shop Environment | **OLD** | Flat pink `fillRect` wall with dotted grid | Redesign with warm wood floors, pet wall decals, sunny window |
| Pet Enclosures / Pens | **OLD** | Flat white rectangles with colored outlines | Replace with illustrated cozy wicker baskets, cushions, blankets |
| Pets on Display | **OLD** | Emoji text (`🐶`, `🐱`, `🐰`, `🐹`, `🐼`) on cards | Replace with animated illustrated chibi pets |
| Grooming Counter | **OLD** | Flat peach geometric box | Replace with illustrated counter with brushes, ribbons, treats |
| Shopkeeper Daisy | **MIXED** | Character model behind counter | Upgrade with pet ears headband, apron, pet dialogue |
| Adoption Flow | **NEW** | Spend ⭐, persists to save, moves pet to Home | Keep logic; add illustrated adoption certificate/card |

---

### Scene 8: School — Sunshine Academy (`SchoolScene`)

| Element | Status | Current Implementation | Action Required |
|---|---|---|---|
| Classroom Environment | **OLD** | Flat mint `fillRect` wall + tan floor | Redesign with classroom wood wainscoting, alphabet border, clock |
| Chalkboard | **MIXED** | Green rectangle with lesson text | Upgrade to wooden frame, chalk dust effect, illustrated math/words |
| Art Easel | **MIXED** | A-frame lines with canvas | Upgrade to illustrated wooden easel with cute paintings |
| Student Desks | **OLD** | Flat brown boxes with chair bars | Replace with illustrated dual wooden school desks |
| School Bell | **MIXED** | Yellow circle with emoji `🔔` | Replace with illustrated brass wall bell with ringing wobble |
| Teacher Ms. Blossom | **OLD** | Circle head with `◕‿◕` and glasses | Upgrade to illustrated teacher NPC with bun, book & pointer |
| Connection to Brain Games | **MIXED** | Tap board changes lesson, but not connected | Directly link chalkboard to Little Scholars Brain Hub |

---

### Scene 9: Sunny Meadow Park (`ParkScene`)

| Element | Status | Current Implementation | Action Required |
|---|---|---|---|
| Outdoor Environment | **OLD** | Two-tone split `fillRect` (sky 250px, grass 290px) | Redesign with layered rolling hills, storybook trees, stone path |
| Trees & Foliage | **OLD** | Geometric circles on brown rectangles | Replace with soft painted storybook trees and flowering bushes |
| Swings | **MIXED** | Line-drawn swing frame; swing tween works | Upgrade to illustrated wooden A-frame swing set |
| Slide | **OLD** | Line and polygon slide | Replace with illustrated pastel curved playground slide |
| Sandbox | **MIXED** | Rounded rectangle; dig minigame functional | Add illustrated sand castle, bucket, spade props |
| Duck Pond | **MIXED** | Flat cyan ellipse with emoji duck `🦆` | Upgrade to illustrated pond with lotus flowers, swimming ducky |
| Picnic Area | **OLD** | Missing | Add illustrated picnic blanket, basket, fruit snacks |

---

### Scene 10: Honeycomb Bakery & Café (`CafeScene`)

| Element | Status | Current Implementation | Action Required |
|---|---|---|---|
| Café Environment | **OLD** | Flat cream wall with dots + tan floor | Redesign with warm bakery brick/wood wall, hanging pendant lamps |
| Bakery Counter | **OLD** | Flat tan rounded rectangle | Replace with illustrated glass pastry display case |
| Coffee / Tea Machine | **OLD** | Blue rectangle with steam text `~` | Replace with illustrated copper/brass espresso maker |
| Dining Tables & Booths | **OLD** | Basic brown ellipses and line chairs | Replace with illustrated wooden cafe tables, cushioned booths |
| Menu Blackboard | **MIXED** | Dark rounded rectangle with text | Upgrade to illustrated cafe chalkboard easel |
| Barista Leo | **OLD** | Circle head with `◕‿◕` text smiley | Upgrade to illustrated barista NPC with apron, cap, latte art |
| Food & Drink Props | **OLD** | Latte, tea, croissant are emoji strings | Replace with illustrated pastries, mugs, teapots |

---

### Scene 11: Sparkle & Snip Salon (`SalonScene`)

| Element | Status | Current Implementation | Action Required |
|---|---|---|---|
| Salon Environment | **OLD** | Flat lavender wall + checkered floor | Redesign with stylish wallpaper, salon mirrors, accessory shelves |
| Styling Station & Mirror | **MIXED** | Large rounded rectangle with light circles | Upgrade to illuminated Hollywood vanity mirror with gold trim |
| Styling Chair | **MIXED** | Pink geometric box on stem | Replace with illustrated plush hydraulic salon chair |
| Hair Washing Station | **OLD** | Missing | Add illustrated sink basin & shampoo bottles |
| Stylist Maya | **OLD** | Circle head with `◕‿◕` and emoji `✂️` | Upgrade to illustrated chic stylist NPC with apron & shears |
| Hairstyle & Dye Palette | **MIXED** | Functional palette, but text-heavy buttons | Upgrade to visual hairstyle thumbnails & mirror reveal celebration |

---

### Scene 12: Wonder Toy Shop (`ToyShopScene`)

| Element | Status | Current Implementation | Action Required |
|---|---|---|---|
| Toy Shop Environment | **OLD** | Flat yellow wall + pink striped floor | Redesign with playful storybook wallpaper, balloon arches, display cubbies |
| Toy Shelves | **OLD** | Peach box with white lines | Replace with illustrated toy display shelves with plushies, robots, cars |
| Play Mat | **MIXED** | Green rounded rectangle with puzzle button | Upgrade to illustrated colorful alphabet play mat |
| Interactive Toys | **OLD** | Toys on shelf are emoji circles | Replace with interactive props (bouncing ball, wind-up robot, teddy) |
| Shopkeeper Toby | **OLD** | Circle head with `◕‿◕` | Upgrade to illustrated toy maker NPC with vest, bowtie & smile |
| Puzzle Station | **MIXED** | Links to Brain Hub, but plain button | Enhance with illustrated jigsaw box prop on play mat |

---

### Core Systems & Modals

| Component | Status | Current Implementation | Action Required |
|---|---|---|---|
| Main Avatar (`AvatarRenderer`) | **MIXED** | Detailed layered vector graphics with bangs & clothes, but needs chibi proportions (45-50% head), glossy eyes, distinct expressions & animations | Refine proportions, eye rendering, expression states, and smooth animation sets |
| Reusable NPC Base | **OLD** | Mix of circle-head smileys (`◕‿◕`) and duplicate avatars | Build unified illustrated NPC generator with unique outfits & hair |
| Pets System (`Pet.ts`) | **OLD** | Circle bodies with geometric ear shapes and emoji icons | Build illustrated chibi pet renderer (Puppy, Kitten, Bunny, Hamster, Panda) |
| Item System (`Item.ts`) | **OLD** | Emoji text glyphs inside circular backings | Build illustrated prop rendering pipeline for food, toys, tools |
| Brain Games Hub (`BrainHubModal`) | **MIXED** | Rich logic (Memory, Quiz, Puzzle, Badges), but modal is text-dense | Rebuild into **Little Scholars Club** with mascot home portal screen |
| Character Creator | **MIXED** | Functional grids, but feels like an admin form | Redesign into **Makeover Studio** with large avatar preview & category carousel |
| Wardrobe Modal | **MIXED** | Simple card list | Redesign into visual **Walk-in Closet** with category tabs and randomizer |
| Build Mode Tray | **MIXED** | Only Undo / Redo / Remove buttons | Add collapsible furniture tray with category pills |

---

## 3. Recommended Implementation Roadmap

1. **Phase 1: Foundation (P0 - P1)**
   - P0: Main Character Chibi Proportions, Eye Rendering, Expressions, Animation Set.
   - P1: Illustrated Interactive Props & Reusable NPC System.
   - P1b: Illustrated Chibi Pets System (Puppy, Kitten, Bunny, Hamster, Panda).
2. **Phase 2: World Venues Redesign (P2 - P8)**
   - P2: Supermarket (Shelves, fridge, checkout, cashier, basket).
   - P3: Pet Shop (Illustrated pens, pet beds, adoption desk, Daisy).
   - P4: School (Sunshine Academy, desks, chalkboard, easel, bell, Ms. Blossom).
   - P5: Park (Layered hills, trees, swing, slide, duck pond, sandbox).
   - P6: Café (Honeycomb Bakery, counter, coffee machine, booths, Leo).
   - P7: Salon (Illuminated vanity, stylist chair, dye bar, Maya).
   - P8: Toy Shop (Illustrated shelves, interactive toys, Toby).
3. **Phase 3: Core Features & Modals (P9 - P10)**
   - P9: Brain Games (Little Scholars Club portal, collectible card backs, visual quiz, visual puzzle, badge book).
   - P10: Avatar Creator (Makeover Studio), Wardrobe (Visual Closet), Build Mode (Furniture Tray).
4. **Phase 4: Gameplay Integration & Verification (P11)**
   - Needs System (gentle Happiness, Hunger, Energy, Fun).
   - Cross-location interaction chains (Shop -> Eat, Adopt -> Care, Study -> Quiz).
   - Responsive touch verification across viewports (1280×720, 844×390, 932×430, 740×360).
   - Documentation & visual before/after reports.
