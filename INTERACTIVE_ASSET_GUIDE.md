# Interactive Asset & Illustrated Prop Architecture Guide

## 1. Overview
Qian Hui Avatar City eliminates generic flat geometric markers, plain emoji icons, and unanchored boxes. All furniture, decor items, handheld props, and venue equipment are rendered through high-definition procedural vector graphics (`PropRenderer.ts`) or stylized sprite containers with dedicated interaction physics, anchor sockets, and feedback loops.

---

## 2. Interactive Furniture Catalog (`FurnitureManager.ts`)
Placed items support both freeform drag-and-drop in Build Mode and intuitive character interactions in Live Mode:

| Furniture Item | Visual Construction | Interactive Reaction | Character State / Need Boost |
| :--- | :--- | :--- | :--- |
| **Princess Bed** | Pastel lavender quilted duvet, headboard stars, pillow cluster | Tapping toggles sleep animation; avatar tucks in | `sleeping` state; Energy +30, Happiness +10 |
| **Armchair** | Emerald scalloped shell armchair with cream daisy pillow | Tapping seats the avatar comfortably | `sitting` state; Energy +15, Fun +8 |
| **Vanity Wardrobe** | Cream French wardrobe with heart-carved doors | Tapping swings doors open and triggers styling panel | Wardrobe Modal opens; Fun +10 |
| **Full Mirror** | Gilded baroque standing mirror with ribbon crown | Tapping triggers shimmer sparkle burst and glamour bounce | Avatar react `dancing`; Happiness +15 |
| **Floral Rug** | Soft scallop-edged pink rug with daisy embroidery | Ground decor anchor point for character play | Calming zone; Happiness +5 |
| **Bookshelf** | Natural oak triple-tier shelving with pastel encyclopedia rows | Tapping dispenses an illustrated storybook | Held prop granted; Fun +18 |
| **Lamp & Plants** | Pastel shaded lamp with warm light cone; potted monstera | Tapping lamp toggles ambient room lighting | Interactive ambient feedback |

---

## 3. Illustrated Prop Library (`PropRenderer.ts`)
Props are procedural vector illustrations with soft outlines, custom gradients, and held-item sockets:

### A. Foods & Drinks (Replenishes Hunger & Energy)
- `apple_01`: Crisp ruby red apple with green leaf and specular glint (+15 Hunger).
- `banana_01`: Ripe golden banana bunch with peel detail (+12 Hunger).
- `milk_01`: Pastel blue dairy carton with cute cow icon and striped straw (+20 Hunger, +10 Energy).
- `juice_01`: Fresh squeezed orange juice bottle with citrus slice (+15 Hunger, +15 Energy).
- `cake_01`: Tiered strawberry cream shortcake with cherry topper (+25 Hunger, +20 Happiness).
- `croissant_01`: Flaky buttery croissant with golden glaze (+18 Hunger).
- `latte_01`: Ceramic mug with foam star latte art and steam trail (+15 Energy, +12 Fun).

### B. Toys & Educational Relics (Replenishes Fun & Happiness)
- `teddy_01`: Classic honey-brown button-eyed teddy bear with crimson bow (+25 Fun).
- `ball_01`: High-contrast teal & navy polka-dot play soccer ball (+18 Fun).
- `robot_01`: Retro wind-up toy robot with antenna and LED panel (+22 Fun).
- `kite_01`: Diamond festival kite with colorful ribbon streamers (+20 Fun).
- `train_01`: Wooden locomotive engine with red wheels (+15 Fun).
- `book_01`: Hardcover storybook with embossed star medal (+20 Fun).

---

## 4. Venue Specialized Play Equipment

### 1. Sunny Meadow Park (`ParkScene.ts`)
- **Twin Playground Swings**: Wooden A-frame swing with pink suspended seats. Tapping animates realistic pendulum swinging physics and emits laughter chirps (+20 Fun).
- **Toddler Slide**: Stepped safety ladder with curved yellow chute. Avatar slides smoothly from top to bottom with swoosh SFX (+18 Fun).
- **Sandbox Play Zone**: Wooden border sandbox with molded sand castles and colorful buckets (+15 Fun).
- **Duck Pond**: Azure water basin with floating rubber duckies and water lilies. Tapping creates animated ripple rings (+10 Happiness).
- **Picnic Blanket**: Gingham picnic blanket with picnic basket for outdoor snack sharing (+15 Hunger, +15 Happiness).

### 2. Sparkle & Snip Salon (`SalonScene.ts`)
- **Hollywood Vanity Station**: Rounded mirror flanked by warm spherical bulbs with glowing illumination cones.
- **Styling Console**: Allows cycling 5 distinct hairstyles and 5 hair dye shades in real time.
- **Shampoo Basin & Chair**: Porcelain wash basin with chrome faucet and shampoo shelf; tapping plays soothing water SFX (+15 Energy).
- **Glamour Reveal**: Big glitter explosion and celebratory fan animation (+25 Happiness).

### 3. Sunshine Academy (`SchoolScene.ts`)
- **Interactive Chalkboard**: Math Magic problem board with "Take Quiz" trigger for Little Scholars Brain Hub.
- **Art Easel**: Adjustable wooden easel displaying sunflower and landscape paintings; tapping cycles canvas art (+15 Fun).
- **Teacher Counter & Bell**: Desk with brass bell that chimes on tap (+5 Happiness).

### 4. Sunny Basket Supermarket (`SupermarketScene.ts`)
- **Chilled Produce Stall**: Wooden crates overflowing with fresh fruits, greens, and market flowers.
- **Cashier Conveyor Scanner**: Functional conveyor belt with laser scanner that beeps on item contact and tallies total cart Star Coins.

---

## 5. Drag-and-Drop & Hitbox Standards
- Minimum interactive hitbox: $44 	imes 44	ext{px}$ across all desktop and mobile viewports.
- Depth sorting: Interactive props dynamically adjust container depth according to their $Y$-coordinate, ensuring avatars correctly step in front of or behind furniture.
- Hover & active feedback: Pointer hover enlarges props by $+4%$ with hand cursor; pointer down triggers quick bounce tween.
