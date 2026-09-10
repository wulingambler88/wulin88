# World redesign — baseline audit

Current repository inspected on 2026-09-05. This supersedes previous visual scores; the repository built by the other AI is the source of truth. No production assets were replaced before this audit.

## Verified baseline

- Vite running on isolated port 5180, without disturbing the user's port 5173.
- 14 isolated scene/panel captures at 1280×720 and 844×390: `world-redesign/before/`; capture log and UI measurements in `evidence.json`.
- All capture routes opened with zero page errors. These captures establish rendering/navigation, not exhaustive interaction validation.
- Type check and production build pass. 18 test files / 79 tests pass. Lint fails on the existing `window as any` debug hook in `src/main.ts`.
- Existing saves, shops, currency, pets, treasure, Brain Games, makeover, furniture editing, kitchen and held-item systems must remain intact.

## Findings by place

| Place | Existing play to preserve | Visual shortcomings / opportunities |
|---|---|---|
| Town | Nine buildings, clues board, day/night, car honk, navigation | Repeated triangle/rectangle buildings, cross-shaped avenue, sparse plants, weak hero at scale .52, emoji landmarks, constant floating buildings. Use individual illustrated storefronts, curved paths, river, garden clusters, grounded architecture, reactive props and residents. |
| Bedroom | Drag, sleep anchor, wardrobe, lamp, furniture edit, loose toys | Flat wall/floor, sparse shelves, thin outlined furniture. Add diorama wall treatment, curtains, textiles and independent small props. |
| Living room | Sofa sitting, TV channels, table placement, plant reaction, pets | Excess empty floor, sparse wall decoration, emoji broadcasts. Add layered upholstery, books and window light without covering anchors. |
| Kitchen | Fridge storage/retrieval, sink, recipes, food consumption and placement | Appliances still mostly geometric. Preserve operational doors, storage and cooking layers while upgrading cabinets and materials. |
| Boutique | Preview/cancel/purchase, ownership, shopkeeper | Large catalogue obscures physical shop; rack is colored bars; mirror inactive. Contextual catalogue and physical browsing are priorities. |
| Market | Basket, checkout, products, cashier/scanner | Large menu dominates shelves; no physical player. Add player and product-led browsing while preserving purchase service. |
| Pet shop | Adoption and owned pets | Basic pens and emoji pet motifs. Rich pet habitats and readable interaction targets needed. |
| Park | Swing, slide, digging | Sparse flat landscape. Improve water, plant clusters and playground identity. |
| Café | Brew station, seats, player | Sparse tables and background. Pastry display, textiles and smaller decorative props needed. |
| Salon | Chair, hair style/color, saved customization | Geometric mirrors and wall. Make it a lavender beauty studio with legible tools. |
| Toy shop | Toy purchases and puzzle entry | Basic shelving and toy emoji. Toyhouse centerpiece and coherent toy art needed. |
| School | Teacher, board lessons, art easel, desks, quiz | Flat classroom. Keep educational logic unchanged; improve furniture, supplies and background depth. |
| Brain Games | Existing modules, progression, rewards | Preserve game logic; align panel materials/icons with world HUD. |
| Makeover | Existing customizable appearance/outfits | Preserve every customization option. Main avatar needs expressive, readable eyes and better layered hair/outfit rendering. |

## Cross-cutting issues

The old gameplay audit's pending statuses conflict with later implemented code; they are historical, not a reliable current task list. Source inspection finds live fridge, sink, TV, lamp, NPC and held-item handlers. The avatar renderer currently places held-item art beneath its main graphics layer. Breathing exists but blinking is absent. External character scale can be lost by drop-settle. Building DOM navigation overlays must stay registered to their visible targets.

## Completion gate

Do not call the entire world redesign complete from a passing build. Compare equivalent screenshots and verify real pointer/touch interaction chains, save reloads and all required mobile sizes. Record residual placeholders honestly.
