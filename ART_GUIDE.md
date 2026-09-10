# Art Guide & Visual Standard

## Visual Thesis

"A living chibi sticker-book dollhouse": warm pastel color palettes, 2.5-head chibi character proportions with large glossy eyes, soft drop-shadows, cream-bordered interactable objects, and storybook illustrated environments that feel tangible, tactile, and comforting.

## Hero & Character Standards

- **Proportions**: 2.5 heads tall. Head is approximately 40% of character height.
- **Hero Identity (Qian Hui)**:
  - Hair: Cascading blonde wavy locks with soft forehead bangs and pastel flower wreath headband (`hat_flower_pearl`).
  - Face: Large sparkling dark eyes with dual glossy highlights, curved anime eyebrows, blushing pink cheeks (`#ffb6c1`), and soft joyful smile.
  - Outfit: Mint under-tunic, baby blue bunny pinafore dress with stitched white pocket, and pastel blue ribbon Mary Jane shoes.
- **NPC Characters**: Maya (Salon), Oliver (Supermarket), Daisy (Pet Shop), Leo (Café), Emma (School), Sparky (Toy Shop) follow identical 2.5-head chibi geometry with specialized attire (aprons, uniforms, hair bows) and interactive speech bubbles.
- **Adoptable Pets**: 5 distinct breeds (Buttercup Puppy 🐶, Mimi Kitten 🐱, Snowdrop Bunny 🐰, Peanut Hamster 🐹, Bao Bao Panda 🐼) with rounded bodies, expressive faces, and heart particle bursts when loved.

## World & Environment Architecture

- **Town Map**: Illustrated storybook town with winding cobblestones, flower garden verges, flowing canal, arched bridge, and floating pastel destination pills.
- **Interior Dollhouses (9 Locations)**:
  - `Home`: Cozy floral wallpaper, sunlight sheer drapes, oak parquet flooring, ornate bed, scallop armchair, vintage wardrobe, and standing ribbon mirror.
  - `Boutique`: Warm hardwood boutique with wooden garment display racks, hanging pastel dresses, shoe shelf, baroque mirror, and monstera planter.
  - `Supermarket`: Clean mint-checkered tiled grocery with 3-tier wooden merchandise shelves, item price badges, striped produce stall, and checkout counter.
  - `Pet Shop`: Soft pink pawprint nursery with cushioned adoption nests, price labels, and adoption reception counter.
  - `Café`: Honeycomb Bakery with warm wood accents, barista bar, blackboard chalk menu, espresso brew station, cloche displays, and dining booths.
  - `Salon`: Hollywood glamour vanity mirror with warm bulb framing, shampoo wash basin, styling chair, and mirror reveal pedestal.
  - `Toy Shop`: Cheerful starlet playroom with tiered toy displays, plushies, robots, and interactive central play rug.
  - `School`: Sunshine Academy classroom with chalk lesson boards, art easel, and study desks.
  - `Park`: Sunny Meadow playground with curved slide, dual swings, fountain, and treasure sandbox.

## UI Design & Polish

- **Glassmorphism & Jelly Pills**: Semi-transparent frosted white backgrounds (`rgba(255, 255, 255, 0.92)`), rounded pill contours (`border-radius: 9999px`), 2px soft borders (`rgba(255, 210, 230, 0.8)`), and gentle drop shadows.
- **Needs Indicators**: Horizontal pill meters displaying Happiness (😊), Energy (⚡), Hunger (🍎), and Fun (🎈) with fluid pastel color fills.
- **Mobile Responsiveness**: Dynamic layout wrapping for small screens (390px to 430px heights) ensuring canvas letterboxing (`Phaser.Scale.FIT`) maintains 16:9 composition without clipping.

