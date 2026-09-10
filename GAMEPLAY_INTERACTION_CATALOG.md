# Gameplay Interaction Catalog

This catalog documents all player interactions, physical object behaviors, character reactions, and sound effects across Qian Hui Avatar City.

---

## 1. Character Handheld & Eating Systems

### A. Handheld Item Socket
- **Mechanism**: Qian Hui now has physical hands that cradle held items (`heldItemId` field in `Character` and `AvatarRenderer`).
- **Equipping**: Drag any toy, food, drink, or prop from the room or inventory directly onto Qian Hui.
  - If already holding an item, the previous item is safely dropped onto the nearby floor.
  - Qian Hui plays a joyful reaction and holds the item in front of her body.
- **Putting Down**: Tap directly on Qian Hui while she is holding an item. She gently places it at her feet with a soft drop sound and a toast message: *"Put down held item"*.
- **Persistence**: `heldItemId` is automatically saved in `CharacterSave` and preserved across room navigation and game restarts.

### B. Multi-Step Eating Animation
- **Trigger**: Drag any food or drink item onto Qian Hui.
- **Sequence**:
  1. **Hold**: Qian Hui takes the food into her hands.
  2. **Bite & Chew**: Audio plays crisp bite (`eat`) followed by procedural chewing rhythm (`chew`). Character mouth toggles open/closed in a chewing animation.
  3. **Crumbs & Hearts**: Delicious crumb particles fly outward, followed by floating hearts (`♥`) and stars (`★`).
  4. **Stats & Feedback**: Hunger stat increases (e.g. +15), happiness stat increases (+10), and toast notifies *"Yummy! +15 hunger 😋"*.

---

## 2. Interactive Furniture & Appliances

### A. 2-Door Interactive Refrigerator (`InteractiveFridge`)
- **Location**: Kitchen (x: 2080, y: 322).
- **Physical Features**:
  - Top Freezer Door with chrome handle.
  - Bottom Refrigerator Door with chrome handle.
  - 3 interior shelves with soft blue and ivory lining.
- **Interactions**:
  - **Tap Top Handle**: Flips freezer door open/closed with gentle magnetic hinge tween.
  - **Tap Bottom Handle**: Flips fridge door open/closed.
  - **Deposit**: Drag any item over the open fridge interior. Up to 6 items can be stored.
  - **Retrieve**: Tap any stored item icon inside the open fridge to pop it onto the kitchen counter.

### B. Animated Kitchen Sink (`InteractiveSink`)
- **Location**: Kitchen (x: 2680, y: 295).
- **Physical Features**: Mint enamel basin with silver curved gooseneck faucet and pink tap handle.
- **Interactions**:
  - **Tap Handle**: Toggles running water on/off with realistic procedural bubbling/flowing audio.
  - **Water Jet**: Multi-frame animated water jet with splashing ripples in the basin.
  - **Wash Items**: Drag any fruit, cup, or dish onto the sink to wash it sparkling clean with sparkle particles (`✨`).

### C. Star Lamp Toggle
- **Location**: Bedroom bedside.
- **Interactions**:
  - **Tap**: Toggles on/off with procedural 'switch' click.
  - **Lighting Effect**: Illuminates with a warm translucent light cone and a glowing star topper.

### D. Multi-Channel Television
- **Location**: Living Room TV stand.
- **Interactions**:
  - **Tap**: Cycles through 4 states with cheerful chime jingle:
    1. **Off**: Dark sleep screen.
    2. **Channel 1 (Kitty)**: Cute pink broadcast with `🐱` star host.
    3. **Channel 2 (Rainbow)**: Blue sky cartoon channel with `🌈`.
    4. **Channel 3 (Rocket)**: Deep space science channel with `🚀`.

### E. Monstera Houseplant
- **Location**: Living Room.
- **Interactions**: Tap to trigger a springy wobble tween with a rustle sound and flower blossom accents.

---

## 3. Magnetic Table Placement Surfaces

- **Dining Table (Kitchen)**: Dropping items between `x: 2280-2520` and `y: 280-440` magnetically snaps them to `y: 335` with a gentle drop sound.
- **Coffee Table (Living Room)**: Dropping items between `x: 1450-1620` and `y: 280-420` snaps them to `y: 350`.

---

## 4. NPC & Environment Interactivity

### A. Town Car Honking
- **Location**: Town Scene highway.
- **Action**: Tap the moving blue car.
- **Reaction**: Procedural dual-tone horn (`honk`), car squishes and bounces, exhaust smoke cloud (`💨`) puffs backwards, and speech bubble pops *"BEEP BEEP! 🎵"*.

### B. Boutique Shopkeeper Clara
- **Location**: Cloudberry Boutique.
- **Action**: Tap Clara directly.
- **Reaction**: Clara squishes and bounces, audio chime plays, floating heart (`💖`) ascends, and Clara speaks cheerful rotating fashion tips.

### C. Supermarket Cashier
- **Location**: Sunny Basket Market.
- **Action**: Tap the Cashier.
- **Reaction**: Cashier bounces, procedural cash register bell (`register`) rings, golden star ascends, and cashier shares friendly grocery advice.

---

## 5. Procedural Web Audio Synthesis Summary

All sounds are generated procedurally on-the-fly via Web Audio API oscillators:
1. `switch`: Mechanical click toggle for lamps and faucets.
2. `water`: Filtered noise and gentle running water tone.
3. `honk`: Classic two-tone brass automobile horn (F4 -> A4).
4. `bounce`: Elastic spring frequency sweep for balls and toys.
5. `chew`: Subtle biting and chewing crunch.
6. `rustle`: Organic leafy swish for house plants.
7. `tvJingle`: Musical 3-note major triad melody for television channel cycling.
8. `register`: Crisp mechanical bell ding for cashier interactions.
