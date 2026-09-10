# Qian Hui Avatar City — Gameplay Audit

Date: 6 September 2026  
Scope: Desktop experience represented by the 21 screenshots in this folder, plus targeted inspection of current gameplay source.  
Status: Audit only. No gameplay, save data, or application code was changed.

## Overall assessment

The game has a promising sandbox structure: explore town, customize a character, decorate and use the home, shop, adopt pets, and play small activities. The optional daily gift is a positive low-pressure choice. The biggest gameplay concerns are inconsistent progress tracking, economy rules, persistence, and the difference between an activity's promise and what its interaction actually does.

The screenshots demonstrate many available locations, not a completed end-to-end playtest. No live interaction session or fresh automated test suite was run for this report. Source-confirmed findings below establish what the inspected handlers do; their exact runtime presentation still needs verification. The screenshot index's empty error arrays do not prove purchase correctness, save integrity, or successful navigation through normal controls.

Evidence labels: **Code-confirmed** = directly supported by inspected source; **Design concern** = usability/product judgment; **Unverified** = needs a live scenario. P1 denotes a major trust/progression concern; P2 a meaningful interaction/design problem; P3 polish. No crash or data-loss defect is claimed as runtime-reproduced.

## Confirmed findings and design concerns

### P01 — P1, code-confirmed: “Play a game” tracks trying an outfit

Evidence: [main.ts](../../src/main.ts), task markup around line 101; [WorldHUD.ts](../../src/ui/WorldHUD.ts), `renderDaily()` and `shop:preview` handler.

The town task is labeled “Play a game,” but its counter reads the `outfit` activity. Outfit previews set that activity. The separate Today panel correctly labels the same activity “Try an outfit.” Thus the two displays describe different actions for one record; this is not a faithful record of playing a minigame.

Impact: players can follow the written objective without receiving the expected progress, or receive progress for an unrelated action. Future acceptance: the displayed objective, recorded event, and completion counter must agree in both places.

### P02 — P2, code-confirmed: Daily progress can stay stale on the town HUD

Evidence: [WorldHUD.ts](../../src/ui/WorldHUD.ts), `ui:context`, `shop:preview`, and `world:decorated` listeners.

Activity records update, but these listeners call `renderDaily()` only while the Today panel is open. That function also updates the always-visible town task counters. Completing activities with the panel closed can therefore leave town counts unchanged until opening Today or triggering another render.

Additionally, “Visit a shop” only records boutique/supermarket contexts. Other shop-like venues use the generic venue context. The broad wording does not explain this restriction.

Future acceptance: normal completion refreshes visible feedback immediately, and the definition of a qualifying shop is explicit and consistent.

### P03 — P1, code-confirmed: Café prices and reward rules disagree

Evidence: [Café screenshot](09_cafe.png); [CafeScene.ts](../../src/scenes/CafeScene.ts), menu text and `drawBrewStation()`/`drawBakeryDisplay()`.

The menu advertises Star Latte for 12 coins. Clicking the espresso machine instead adds a latte to inventory and increases hunger/energy without spending coins. The inspected handler has no cooldown. Buying a croissant spends 18 coins but both grants an inventory item and immediately increases needs.

Free brewing may be intentional, but it conflicts with the displayed price and makes repeated clicks a source of free items/need recovery. Receiving both a stored item and immediate nourishment also needs a clear consumption rule; later consumption should be checked before claiming a double-use exploit.

Future acceptance: each menu item states whether it is free, purchased, consumed, or taken home, and its balance/inventory/stat effects match that promise.

### P04 — P1, code-confirmed: Sandbox treasure claim state is not saved with rewards

Evidence: [ParkScene.ts](../../src/scenes/ParkScene.ts), `dugSpots` field and sandbox pointer handler.

Four spots award 25, 15, 25, and 15 coins: 80 total. Claimed spots are recorded only in a scene-local Set, while currency is saved. A new application instance recreates an empty Set, so the code permits claiming the same spots after reload. This is a source-derived consequence, not a reload experiment performed in this audit.

There is also a presentation inconsistency on ordinary scene re-entry: mound visuals are recreated without consulting the existing Set, even though a reused scene instance can still reject a previously searched spot.

Future acceptance: define whether treasure is one-time, per-session, or recurring, then keep eligibility and visual state consistent with that rule across scene changes and reloads.

### P05 — P2, code-confirmed: Gentle motion does not update existing ambient effects

Evidence: [Settings screenshot](19_home_settings_open.png); [WorldHUD.ts](../../src/ui/WorldHUD.ts), motion change listener; [TownScene.ts](../../src/scenes/TownScene.ts) and [HomeScene.ts](../../src/scenes/HomeScene.ts), reduced-motion checks.

The checkbox saves the preference. The inspected scene checks gate tween creation, but the change handler does not stop existing ambient tweens or notify those scenes to refresh them. A user selecting Gentle motion in an already-running room should not assume current effects immediately stop. Other gameplay animations are outside those checks.

Future acceptance: verify immediate effect, persisted effect after reload, and clearly defined coverage of ambient versus essential motion.

### P06 — P2, code-confirmed: Today and Settings have incomplete keyboard focus behavior

Evidence: [WorldHUD.ts](../../src/ui/WorldHUD.ts), opening/closing listeners.

Opening either panel does not move focus inside it. Escape handlers are attached to the panel itself, so Escape from the still-focused opener does not reach that handler. Settings closes without explicitly restoring focus to its opener. Today does restore focus when its close handler runs.

These are targeted findings about two panels, not a claim that every modal is inaccessible. Future verification should include keyboard-only opening, dismissal, focus return, and whether game input remains active behind overlays.

### P07 — P2, design concern supported by code: Adoption spends coins immediately

Evidence: [Pet Shop](07_pet_shop.png); [PetShopScene.ts](../../src/scenes/PetShopScene.ts), `handlePetTap()`.

The first tap on an unowned pet spends its displayed price and saves the adoption. There is no intermediate preview/confirmation in that handler. Prices range from 90 to 160 in the screenshot, compared with a shown balance of 500 and a daily gift of 25. Accidental exploratory clicks therefore have a meaningful cost.

The code does guard insufficient funds and duplicate adoption, which is good. Whether one-tap adoption is acceptable is a product choice, not inherently a bug. Future acceptance should make the spending consequence clear before the tap, with a deliberate confirmation or another recovery design if desired.

### P08 — P2, design concern supported by code: Customization uses different commitment rules

Evidence: [CharacterCreatorModal.ts](../../src/ui/CharacterCreatorModal.ts), draft choices and Save Look interface; [SalonScene.ts](../../src/scenes/SalonScene.ts), `cycleHairstyle()`, `cycleHairColor()`, `applyCustomization()`; [ClothingShopScene.ts](../../src/scenes/ClothingShopScene.ts), preview/cancel/buy handlers.

The creator presents an explicit Save Look action. Salon cycles immediately change and save customization. Boutique has a reversible preview and a buy/equip step. These are individually plausible designs, but moving between them requires learning different rules for whether a click is temporary or permanent. The creator screenshot also gives no visible resulting-character preview.

Future acceptance: make commitment and cancellation semantics clear in each feature, and verify the chosen appearance persists correctly across all three systems.

### P09 — P2, design concern supported by code: Some activities promise more agency than they provide

Evidence: [School](12_school.png); [SchoolScene.ts](../../src/scenes/SchoolScene.ts), lesson and easel handlers.

The helper invites the player to paint. The easel actually cycles four preset artworks and grants stats. Blackboard interaction cycles preset lesson text and grants stats; it does not assess understanding. A separate Take Quiz gateway exists, which is a stronger candidate for an assessed activity.

Preset roleplay is valid for a dollhouse game, but “paint” may imply creative drawing. Future product wording should match the actual interaction. The three arithmetic examples visible on the initial blackboard are correct; the full quiz bank, difficulty progression, answer explanations, and educational suitability were not audited.

### P10 — P2, design concern: Discovery and control continuity need a live check

Evidence: [Town](01_town.png), [Living room](03_living_room.png), [Kitchen](04_kitchen.png), [Toy Shop](11_toy_shop.png); [HomeScene.ts](../../src/scenes/HomeScene.ts), `goToRoom()`.

Town labels are partly hidden, many interactive objects are not visually distinguished from decoration, and the player is absent from the living-room/kitchen captures. Room navigation changes the camera, not the character position in the inspected `goToRoom()` handler. That can be intentional dollhouse exploration, but players need to understand how to bring the character into the viewed room.

Do not classify the missing character as a confirmed spawn bug from a still image. Verify a normal player can discover each destination, move between rooms, recover the avatar, and use small hotspots without developer shortcuts or forced clicks.

## Gameplay structure worth preserving

- **Optional daily gift:** [DailyActivities.ts](../../src/state/DailyActivities.ts) defines a fixed 25-coin claim and rejects another claim for the same or earlier local day. The panel explicitly avoids streak pressure. Long-running sessions and clock changes remain untested.
- **Shopping safeguards:** Supermarket distinguishes empty/insufficient checkout outcomes and asks before abandoning a nonempty basket. Boutique provides preview/cancel and does not buy without a selection. These are source-observed safeguards, not a full transaction certification.
- **Home sandbox:** The inspected Home handlers support furniture persistence, inventory items, fridge storage, sink interaction, pet feeding, and cooking drop routing. This is a useful foundation for connected roleplay rather than isolated menu screens.
- **Varied activities:** Brain Hub exposes memory, quiz, puzzle, and scrapbook tabs. Source contains completion rewards for the games. Only the initial memory layout is shown in the screenshot set; completion/reward correctness is unverified here.

## Coverage and required playtest evidence

| Area | Evidence available | Still needs live verification |
| --- | --- | --- |
| Town / time changes | Screens 01, 20, 21; targeted HUD/source review | All normal building routes, return routes, rapid clicks, time persistence. |
| Home / rooms | Screens 02–04; targeted Home handlers | Avatar transfer, drag/drop, furniture edit, eating, fridge/cooking, save/reload. |
| Boutique | Screens 05, 16; preview/buy/cancel source | Every item category, owned/unowned item states, insufficient funds, cancel/reload. |
| Market | Screens 06, 17; checkout/leave source | Add/remove quantities, total accuracy, transaction once-only behavior, basket confirmation. |
| Pet Shop | Screen 07; adoption source | Deliberate adoption, pet appears at Home, care, whistle, reload. |
| Park | Screen 08; treasure source | Swing/slide completion, repeated input, treasure reload and re-entry behavior. |
| Café | Screen 09; brew/pastry source | Actual coin/item/stat deltas, repeated clicks, later food consumption. |
| Salon | Screen 10; customization source | All styles/colors, synchronization with creator, persistence, undo expectations. |
| Toy Shop | Screen 11 only for this detailed review | Individual toys, mat puzzles, train, completion and repeat behavior. |
| School | Screen 12; lesson/easel source | Quiz launch, correctness of question bank, feedback, age/difficulty fit. |
| Brain Hub | Screen 13; targeted reward source | All tabs/tiers, full rounds, exit/reopen, repeated reward prevention. |
| Creator / wardrobe | Screens 14, 18; targeted creator source | Every option/filter, scrolling, save/cancel, equipped-item compatibility. |
| Daily / settings | Screens 15, 19; source review | Fresh progress, day rollover, keyboard paths, live reduced motion. |
| Bag / clues / reset / audio | No dedicated captures | Complete flows, confirmation/cancel, save safety, audible state. |

## Recommended priority for a later implementation phase

1. Align objective tracking, café economy, and treasure persistence with explicit rules.
2. Verify purchases, rewards, and saves end to end in an isolated test save.
3. Clarify customization/adoption commitment and room/avatar controls.
4. Address keyboard behavior and live motion preferences.
5. Evaluate activity depth and educational content separately from attractive presentation.

No fixes were made. This report does not claim that every feature works, that every defect has been found, or that the game is ready for release.
