# Current Gameplay Audit

This audit evaluates the actual physical interactivity, character reactions, environmental responses, discoverability, playfulness, replayability, touch ergonomics, and feedback quality of **Qian Hui Avatar City**.

Audited against the running application and codebase architecture (`HomeScene`, `TownScene`, `ClothingShopScene`, `SupermarketScene`, `PetShopScene`, `ParkScene`, `CafeScene`, `SalonScene`, `ToyShopScene`, `SchoolScene`, `CookingManager`, `PetManager`, `ItemManager`, `FurnitureManager`).

---

## 1. Location Gameplay Scorecard (Before Gameplay Polish)

Scores are rated from **1 (Poor / Missing)** to **5 (Exceptional / Deep)**.

| Location | Interactivity | Character Reaction | Environment Reaction | Discoverability | Playfulness | Replayability | Touch Quality | Feedback Quality | Average |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Home: Bedroom** | 3/5 | 3/5 | 2/5 | 3/5 | 3/5 | 2/5 | 3/5 | 2/5 | **2.6 / 5** |
| **Home: Living Room** | 2/5 | 2/5 | 1/5 | 2/5 | 2/5 | 2/5 | 3/5 | 2/5 | **2.0 / 5** |
| **Home: Kitchen** | 3/5 | 2/5 | 2/5 | 2/5 | 3/5 | 2/5 | 3/5 | 2/5 | **2.4 / 5** |
| **Town Map** | 3/5 | 1/5 | 2/5 | 4/5 | 2/5 | 2/5 | 4/5 | 3/5 | **2.6 / 5** |
| **Clothing Boutique** | 3/5 | 3/5 | 2/5 | 4/5 | 3/5 | 3/5 | 4/5 | 3/5 | **3.1 / 5** |
| **Supermarket** | 4/5 | 2/5 | 2/5 | 4/5 | 3/5 | 3/5 | 4/5 | 3/5 | **3.1 / 5** |
| **Pet Shop** | 3/5 | 2/5 | 2/5 | 3/5 | 3/5 | 3/5 | 3/5 | 3/5 | **2.8 / 5** |
| **Home: Pets** | 3/5 | 3/5 | 2/5 | 3/5 | 4/5 | 3/5 | 3/5 | 3/5 | **3.0 / 5** |
| **Park Playground** | 3/5 | 3/5 | 2/5 | 3/5 | 3/5 | 2/5 | 3/5 | 3/5 | **2.8 / 5** |
| **Honeycomb Café** | 3/5 | 2/5 | 2/5 | 3/5 | 3/5 | 2/5 | 3/5 | 2/5 | **2.5 / 5** |
| **Makeover Salon** | 3/5 | 3/5 | 1/5 | 3/5 | 3/5 | 3/5 | 3/5 | 3/5 | **2.8 / 5** |
| **Starlet Toy Shop** | 2/5 | 2/5 | 1/5 | 2/5 | 2/5 | 2/5 | 3/5 | 2/5 | **2.0 / 5** |
| **Sunshine Academy** | 3/5 | 2/5 | 2/5 | 3/5 | 3/5 | 2/5 | 3/5 | 3/5 | **2.6 / 5** |

**Overall Game Pre-Polish Average**: **2.64 / 5.00**

---

## 2. Location-by-Location Findings

### 2.1 Home: Bedroom
1. **What can the player currently do?**
   - Drag Qian Hui onto the bed to sleep (+energy, zZ toast).
   - Drag Qian Hui to sit on floor or anchor.
   - Tap wardrobe to open the HTML wardrobe modal.
2. **What objects can be touched?**
   - Bed (drag character to anchor), wardrobe (tap to open modal).
3. **What objects look interactive but are not?**
   - **Lamp**: Looks like a bedside lamp, but tapping does nothing! No light on/off glow.
   - **Mirror**: Cannot tap to pose or view character reflection sparkle.
   - **Bed Blanket & Pillow**: Cannot tap to ruffle or tuck in.
   - **Wall window**: Doesn't react to day/night or touch.
4. **Satisfying interactions**: Character sleeping on bed with zZ sound.
5. **Broken or missing interactions**: Lamp toggle, mirror sparkle, toy hug on bed.

### 2.2 Home: Living Room
1. **What can the player currently do?**
   - Drag character to sit on the sofa.
   - Rearrange sofa, coffee table, plant, TV in Edit Mode.
2. **What objects look interactive but are not?**
   - **Television**: Large prominent TV in the room is completely dead on tap! No power toggle, no channels (cartoons, nature, music), no glow.
   - **Plant**: Tapping the plant does nothing (no leaf sway, water droplet, or blossom).
   - **Coffee Table**: Loose items dropped near coffee table don't snap to its surface naturally.
3. **Satisfying interactions**: Sitting on sofa.
4. **Gameplay opportunities missed**: Chaining TV on + character sitting on sofa to watch TV with excited emotion.

### 2.3 Home: Kitchen
1. **What can the player currently do?**
   - Drag ingredients into Blender (e.g. apple + milk) or Stove Pan (bread + cheese) to cook smoothies / sandwiches.
   - Feed items to Qian Hui (instantly disappears, restores hunger).
2. **What objects look interactive but are not?**
   - **Refrigerator**: The large fridge is drawn as background graphics! The player CANNOT tap to open the fridge doors, cannot see groceries inside, and cannot store food in it!
   - **Kitchen Sink**: Drawn as a flat cyan oval! Tapping faucet doesn't run water.
   - **Dining Table**: No surface placement anchors; plates/cups cannot be set neatly for breakfast.
3. **Missing gameplay chains**:
   - **Breakfast Chain**: Tap fridge -> door opens -> drag food to table -> character sits -> give food -> character eats with bite animation.

### 2.4 Town Map
1. **What can the player currently do?**
   - Tap unlocked building to visit.
2. **What objects look interactive but are not?**
   - **Street Lamps**: Cannot tap to toggle lights.
   - **Trees & Flowers**: Tap does nothing (no sway or petal burst).
   - **Driving Car**: Cannot tap to honk (`beep beep!`).

### 2.5 Clothing Boutique
1. **What can the player currently do?**
   - Try on clothes, preview, wear or buy.
2. **What objects look interactive but are not?**
   - **Clara (Shopkeeper)**: Tapping Clara does not trigger a wave, greeting voice, or bow.
   - **Full-length Mirror**: No interactive dressing sparkle or reaction.
   - **Clothing Racks**: Static lines.

### 2.6 Supermarket
1. **What can the player currently do?**
   - Tap or drag products into the cart basket, checkout with Star Coins.
2. **What objects look interactive but are not?**
   - **Cashier**: Tapping cashier doesn't ring cash register or wave.
   - **Store Fridge**: Cannot open clear glass door.
   - **Shopping Cart**: Cannot push or bounce cart.

### 2.7 Adoptable Pets
1. **What can the player currently do?**
   - Adopt 5 pets in Pet Shop. Pets follow character at Home. Tap pet to pet (hearts fly, happiness increases). Feed pet inventory food.
2. **What is missing?**
   - Cannot pick up pet and place onto bed, sofa, or floor mat.
   - Pets don't sleep when character sleeps or lights go off.
   - Pets don't play with toy balls (ball fetch / chasing).

### 2.8 Park Playground
1. **What can the player currently do?**
   - Sit on swing, slide down slide, dig for coins in sandbox.
2. **What is missing?**
   - Swings don't swing back and forth automatically when sitting.
   - Sandbox has no dig particles or tool feedback.
   - Park bench cannot be sat on.

---

## 3. Core Gameplay Problems Identified

1. **Lack of Physical Object States**:
   - Too many environmental objects (lamps, TV, fridge, faucet, sink) are either pure static artwork or lack on/off and open/close states.
2. **Food Consumption Lacks Drama**:
   - Currently, dropping food onto the character causes the item to instantly vanish and displays a toast. There is no bite animation, no chewing reaction, and no held-food state.
3. **Missing Held Items**:
   - Characters cannot physically hold items in their hands while walking or sitting.
4. **No Container Storage**:
   - Player cannot open a container (like the fridge or a toy box), place an item inside, close the door, and have the item persist inside.
5. **Lack of Chained Play Loops**:
   - Actions are mostly isolated single taps. Children enjoy procedural pretend play (e.g. preparing breakfast, tucking in for bed, washing hands, watching TV together with pet).

