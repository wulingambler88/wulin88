# Qian Hui Avatar City

An original, touch-first cozy dollhouse game for children, built with Phaser 3, strict TypeScript, Vite, PWA support, and Capacitor Android packaging.

## Development

Use Node.js 24 from `C:\Users\P3761\Documents\node-v24.20.0-win-x64`.

```powershell
$env:Path = 'C:\Users\P3761\Documents\node-v24.20.0-win-x64;' + $env:Path
pnpm install
pnpm dev
```

Run quality checks with `pnpm check`, `pnpm lint`, `pnpm test`, and `pnpm build`. The production web app is emitted to `dist`.

On Windows, `run.bat` prepends the bundled Node runtime, installs dependencies when needed, and starts Vite.

## Current playable slice

- **Town Map**: Full 9-building miniature town with animated entrance portals, clouds, moving cars, and camera transitions.
- **Home with Pets**: Three-room dollhouse (Bedroom, Living Room, Kitchen). Adopted pets roam, play, can be petted (hearts fly!), fed treats, and placed on furniture.
- **2.5D Character Customization**: Soft wavy blonde hair with bangs, flower pearl headband, blue bunny pinafore dress, and ribbon shoes matching the reference art.
- **Pet Shop**: Adopt 5 unique pets (Buttercup Puppy 🐶, Mimi Kitten 🐱, Snowdrop Bunny 🐰, Peanut Hamster 🐹, Bao Bao Panda 🐼) who move into your Home.
- **Makeover Salon**: Sit in the styling chair to change hairstyles and dye hair colors in real time.
- **Park Playground**: Ride the animated swing, slide down the playground slide, and dig for hidden Star Coins in the sandbox.
- **Sunshine Academy**: Ring the school bell, study at classroom desks, change chalkboard lessons, and paint colorful masterpieces on the art easel.
- **Honeycomb Café**: Brew fresh Star Latte & Fruit Tea with interactive steam, and relax in cozy dining booths.
- **Starlet Wonder Toy Shop**: Explore stuffed animals and toys, testing them out on the play mat.
- **Clothing Boutique & Supermarket**: Try on and wear 24 outfits, shop 20 grocery items, and checkout with Star Coins.
- **Edit Mode & Save V5**: Rearrange furniture with undo/redo, automatic save persistence with sequential migrations (V1→V2→V3→V4→V5).

## Android

The Android wrapper lives in `android`. After web changes, run `pnpm android:sync`, then `pnpm android:open` to build/run from Android Studio.

## iOS

On macOS, add `@capacitor/ios`, run `pnpm cap add ios`, then sync the web build. The game and save architecture are platform-neutral; iOS native files are not generated on Windows.

## Extending the game

- Replace art by keeping stable asset IDs and pivots described in `ART_GUIDE.md`.
- Add furniture, clothing, locations, pets, and items as catalog records in `src/data`, not as scene conditionals.
- Add a location as its own Phaser scene and register it in `src/data/locations.ts` and `src/game/config.ts`.
- Increment `saveVersion` and add a sequential migration before changing persisted fields.

