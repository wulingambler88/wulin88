# Layered world redesign plan

1. Audit current source, documentation, assets and running scenes; capture isolated before evidence. **Baseline captured.**
2. Establish reference-led boards and asset manifest. Warm cream / pink / mint / sky / lavender, warm brown outlines, illustrated highlights and contact shadows. No screenshot-as-background shortcut.
3. Upgrade shared character readability and animation while preserving customization, outfits, held items and save contracts.
4. Town: independent illustrated building atlas; runtime paths, gardens, water, bridge, residents, VFX and hit targets. Give each building the reference's distinct visual identity. No constant building bobbing.
5. Integrate compact portrait-led HUD and existing original icon family. Contextual shop panels, daily activities and fixed reward with compatible persistence.
6. Home and shop dioramas: preserve all furniture/interaction anchors and services; replace surfaces and add separately controlled furnishings. Then extend remaining venues and panel styling.
7. Validate input and saves; capture equivalent after views at desktop and all three landscape phone sizes. Run targeted tests, full tests, lint, type check and build. Document exact remaining gaps, performance limitations and handoff.

## Layer contract

Background light/sky → landscape/walls → buildings/furniture → independent interaction objects → Y-sorted characters → foreground accents → temporary effects → HTML HUD. Generated illustrations supply textures for objects, never an entire flattened playable screen.

## Asset strategy

Use the built-in image generator for original storybook raster assets matching the user reference. Store approved project assets in `public/art/world/` and prompt/provenance records here. Preserve old assets. Atlas objects require transparent backgrounds, consistent scale, generous cell gutters, no baked UI text. Application renders accessible names and labels. Source/code-native icons reuse `src/theme/Icons.ts`.
