# Qian Hui Avatar City — Full Gameplay Audit & Verification

## 1. Core Loop Assessment
The player journey seamlessly connects exploration, economic progression, character care, and creative customization:
```
Explore (9 Town Locations)
  ├── Discover daily quests, clues, and shopkeepers
  ├── Care for Qian Hui (Needs: Happiness, Energy, Hunger, Fun)
  ├── Earn Star Coins (Little Scholars Brain Hub, Daily Rewards, Minigames)
  ├── Spend & Collect (Adopt pets, buy boutique clothes, shop groceries)
  └── Decorate & Style (Build Mode furniture placement, Salon makeovers)
```

---

## 2. Character Needs System Integrity
- **Live State Emission**: Any stat adjustment made in any venue automatically invokes `Character.updateStat()`, which fires `ui:stats` and updates the HTML HUD bars.
- **Context Filtering**: Needs bar displays in all 8 indoor and outdoor venues (`home`, `boutique`, `supermarket`, `venue`), and hides cleanly on the high-level bird's-eye Town Map.
- **Cross-Location Balance**:
  - Cafe: Hunger +25, Energy +20.
  - Home Bed: Energy +30, Happiness +10.
  - Salon: Happiness +30, Fun +20.
  - Toy Shop: Fun +35, Happiness +25.
  - Park: Fun +30, Happiness +25.
  - Supermarket: Hunger +20.
  - School: Fun +25, Energy +10.
  - Pet Cuddles: Happiness +15, Fun +12.

---

## 3. SaveSchema V5 Compatibility
- Backward compatibility with SaveSchema V5 is strictly preserved.
- Default save initializes 500 Star Coins, unlocked locations across all 9 venues, equipped starter outfit, starter inventory items, and default furniture placements.
- Verified by `tests/save-schema.test.ts`, `tests/save-migration.test.ts`, and `tests/SaveOrdering.test.ts` (all passing).

---

## 4. Input & Responsive Interaction
- **Phaser Pointer Shielding**: HTML modals correctly lock underlying Phaser input during open states, preventing ghost taps on map locations.
- **Drag-and-Drop**: Furniture items placed in Build Mode support immediate dragging via `setDraggable(item, true)`.
- **Responsive Layout**: Validated across desktop ($1280 	imes 720$), iPhone 14/15 ($844 	imes 390$), and iPhone 15 Pro Max ($932 	imes 430$) without viewport clipping or broken hitboxes.
