# Game Design Document

## Vision

Qian Hui Avatar City is a calm miniature dollhouse world for children aged 6–12. Play follows a simple rhythm: discover a place, move characters and objects, customize the scene, collect friendly items, and invent stories. There is no combat, punishment, competitive pressure, gambling, or public chat.

## Home vertical slice

The player opens a bright town map and taps their home. Bedroom, living room, and kitchen form one horizontally connected dollhouse. Qian Hui and loose items can move naturally across it, with room buttons as a quick navigation aid.

- Floor: standing pose.
- Chair: sitting pose.
- Bed: sleeping pose.

Drop targets glow while dragging. A valid choice snaps into place with a friendly reaction; an invalid choice returns smoothly. Food increases hunger without punishment, sleep restores energy, and toys create positive reactions. The player can open a bottom inventory drawer, dress Qian Hui, and rearrange furniture in an explicit reversible Edit Mode. Progress saves automatically.

## Interaction principles

- Large targets and minimum 44 px interface controls.
- Touch-first direct manipulation; mouse works identically.
- Short labels, familiar icons, motion, and colour carry instructions.
- No failure state. Experimenting is always safe and reversible.
- Landscape is the primary play orientation; portrait remains playable with wrapped controls and a contained canvas.

## Character states

The mutually exclusive primary states are standing, dragging, sitting, sleeping, eating, and playing. Short-lived reactions return to standing, while furniture anchors own sitting and sleeping transitions. Needs are expressive values from 0–100, not countdown or survival mechanics.

## Complete Town & Life Simulation
The game features a fully connected miniature town with 9 interactive destinations:

- **Town Map**: Cute miniature town featuring roads, clouds, decorative trees, cars, and interactive buildings. All 9 town locations are fully unlocked with bouncy animations and smooth camera fades.
- **Star Coins**: Global currency starting at 500 ⭐, earned through exploration and sandbox minigames. Displayed prominently in the top HUD, animated on changes, and synchronized across all locations without monetization pressure.
- **Clothing Boutique**: Physical shop room with shopkeeper NPC ("Try something cute!"), clothing racks, display table, mirror, and counter. Players can preview outfits on Qian Hui before purchasing. Previewing does not overwrite owned clothing; players can confirm with BUY or revert with CANCEL. Already owned items show WEAR instead of BUY.
- **Supermarket**: Physical grocery store with cashier NPC ("Welcome!"), shelves, refrigerator glow, fruit section, and checkout counter. Items can be dragged from shelves into the basket or tapped to add. `ShoppingCartManager` computes quantities and total costs. Checkout verifies funds, deducts coins, adds items into the shared inventory, and clears the cart. Leaving with unpurchased items prompts the player safely.
- **Pet Shop**: Animal adoption sanctuary with cozy pet pens, shopkeeper NPC, and 5 adoptable pets (puppy, kitten, bunny, hamster, panda). Adopting a pet transfers them into the player's Home.
- **Home with Pets**: Adopted pets roam the bedroom, living room, and kitchen. Players can pet them (spawning heart particles and happiness), feed them pet food or treats from the inventory, and pick them up to position them on furniture.
- **Makeover Salon**: Beauty studio with styling chair and interactive customization switches allowing players to cycle hairstyles (`long_waves`, `twin_buns`, `ponytail`, `bob`, `pixie`) and vibrant hair dye colors with instant visual feedback.
- **Park Playground**: Sunny park featuring an interactive swing, functional slide that slides characters down to the ground, and a sandbox treasure-digging minigame where players find bonus Star Coins.
- **Sunshine Academy**: Interactive school classroom featuring cycling chalkboard lessons (math magic, spelling, solar system, music), art easel with paintable canvases, study desks with notebook sitting anchors, and a ringing recess bell.
- **Honeycomb Bakery & Café**: Warm café with barista NPC, interactive coffee espresso machine and tea brewing kettle that create fresh drinks, pastry display, and cozy dining booths.
- **Starlet Wonder Toy Shop**: Colorful toy store featuring display shelves of stuffed animals, robots, and games that can be played with on the central play mat.
- **Reference Character Art Style**: 2.5D chibi girl aesthetic matching the reference artwork with layered blonde wavy hair, bangs, flower pearl headband, blue bunny pinafore dress, and ribbon shoes.
- **Needs System**: 4 expressive gauges tracking Happiness, Energy, Hunger, and Fun (0–100).
  - Eating bakery/grocery treats restores Hunger and grants Happiness.
  - Resting in the bedroom or armchair restores Energy.
  - Petting animals, playing games, and sandbox digging increases Fun and Happiness.
  - Gentle visual cues in the top HUD provide positive child-friendly feedback without game-over states.
- **Brain Academy Hub**: Integrated educational mini-games accessible globally or via in-world triggers (School chalkboard, Toy Shop mat):
  - Memory Garden (3 tiers of card matching).
  - Quiz Academy (3 tiers × 3 subjects: Math, Science, Words).
  - Puzzle Workshop (cute chibi image jigsaw swapping).
  - Honor Scrapbook (4 achievement badges and player brain stats).

