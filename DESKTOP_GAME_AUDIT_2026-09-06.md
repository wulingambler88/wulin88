# Desktop game audit — 2026-09-06

## Scope

Automated desktop audit at 1280×720, using isolated browser contexts and the running Vite app. Each target was loaded independently, waited for its Phaser scene, captured, and checked for page errors, horizontal overflow, visible control dimensions, scene object count, and approximate FPS.

## Result

All 14 targets loaded with **zero runtime/page errors** and **no horizontal overflow**:

| Target | Scene | Objects | FPS | Visible controls |
|---|---|---:|---:|---:|
| Town | TownScene | 38 | 51 | 26 |
| Bedroom / Living / Kitchen | HomeScene | 57 each | 42 / 42 / 33 | 18 each |
| Boutique | ClothingShopScene | 10 | 42 | 16 |
| Market | SupermarketScene | 25 | 40 | 16 |
| Pet Shop | PetShopScene | 10 | 41 | 15 |
| Park | ParkScene | 12 | 41 | 15 |
| Café | CafeScene | 18 | 42 | 15 |
| Salon | SalonScene | 9 | 50 | 15 |
| Toy Shop | ToyShopScene | 13 | 42 | 15 |
| School | SchoolScene | 26 | 42 | 15 |
| Brain Games panel | TownScene + panel | 38 | 25 | 43 |
| Avatar Creator panel | HomeScene + panel | 57 | 28 | 40 |

## Findings

- Desktop layout is stable and does not scroll sideways.
- Town has the richest scene object count and the new illustrated layers are visible.
- Home remains the most layered interactive scene; Kitchen is the heaviest and records the lowest normal-scene FPS (about 33), still usable for this audit.
- Brain Games and Avatar Creator correctly open as overlays without scene errors.
- Brain Games / Avatar Creator reduce measured FPS because the overlays add DOM/UI work; no runtime errors were recorded.
- Venue dressing has now been extended with illustrated furniture/storefront layers in Café, Toy Shop, Pet Shop, Salon and School. Some small feedback strings still use emoji in Phaser text, but they are not used as the primary HUD icon system.
- The desktop interaction sweep now passes the nine building routes, boutique preview/cancel, market basket confirmation, three rooms and wardrobe. The market confirmation was the cause of the previous harness timeout.

## Evidence

Desktop captures: `world-redesign/after/1280x720/`. Machine-readable evidence: `world-redesign/after/evidence.json`. The interaction script is `scripts/world-interaction-check.mjs`.
