# Character & Avatar Redesign Architecture Guide

## 1. Executive Summary
The visual and gameplay redesign pass has completely transitioned Qian Hui Avatar City from flat prototype geometry and generic emoji markers into a production-grade **Chibi Dollhouse Aesthetic**. Every avatar, NPC shopkeeper, and pet rescue now features unified 1.8:1 chibi proportions, soft pastel palettes with dark plum outlines (`#663d63`), layered clothing sprites, dynamic facial expressions, and reactive held-item mechanics.

---

## 2. Anatomical Standards & Proportions
All humanoid characters strictly adhere to the following specification:
- **Head-to-Body Ratio**: 1.8:1 chibi proportion (head height ~55% of total silhouette).
- **Contour & Line Art**: Soft rounded bevels with colored strokes (`0x663d63` / `0x4b2a38`), eliminating harsh black `#000000` outlines.
- **Default Skin Tint**: Warm porcelain peach (`0xffe5d6`), with customizable tone swatches in `CharacterCreatorModal.ts`.
- **Eyes**: Detailed anime chibi eyes with primary and secondary star highlights, curved eyelashes, and soft blush decals (`0xff8fc4` at 70% opacity).
- **Dimensions**: Base height ~140px, base width ~78px, rendered onto a dedicated dynamic container depth-sorted by Y-coordinate.

---

## 3. Modular Layering Pipeline (`AvatarRenderer.ts`)
The avatar is built dynamically in Phaser via explicit visual layering:
```
Drop Shadow (soft ellipse, 18% alpha)
  └── Back Hair (waves, ponytail, buns)
        └── Base Body & Limbs
              └── Bottoms (shorts, skirts)
                    └── Tops (tees, blouses)
                          └── Dress Layer (pinafore, sundress)
                                └── Shoes & Ribbons
                                      └── Head & Face (eyes, blush, mouth)
                                            └── Front Hair & Bangs
                                                  └── Hats / Headpieces / Wreaths
                                                        └── Held Item Socket (x: +22, y: +12)
                                                              └── Reactive Emote Bubble (x: 0, y: -80)
```

### Layer Rules:
1. **Dresses vs Tops/Bottoms**: Equipping a `dress` automatically deactivates conflicting `top` and `bottom` display without mutating save inventory.
2. **Hair Variations**:
   - `twin_buns`: Playful side buns with ribbon accents.
   - `long_waves`: Cozy flowing shoulder-length waves.
   - `ponytail`: Athletic high ponytail with bouncy physics tween.
   - `bob`: Neat classic bob cut with rounded fringe.
   - `pixie`: Chic cropped styling with soft bangs.
3. **Equipped Slots**: `hat`, `dress`, `top`, `bottom`, `shoes`, `accessory`.

---

## 4. NPC Shopkeeper Generation (`NPCBase.ts`)
NPCs share the exact chibi proportions and rendering pipeline as Qian Hui, but feature role-tailored attire, accessories, and behavior:

| Location | NPC Name | Visual Identity & Uniform | Interactive Behavior |
| :--- | :--- | :--- | :--- |
| **Pet Shop** | **Daisy** | Pink bow bunny headband, rescue apron | Greets user, facilitates pet adoption |
| **School** | **Ms. Blossom** | Chic purple spectacles, teacher cardigan | Quizzes user, awards Star Coins & badges |
| **Café** | **Leo** | Barista visor, dark chocolate apron | Serves hot pastries, lattes, and fruit tea |
| **Toy Shop** | **Toby** | Crimson bow tie, starlet shop badge | Demonstrates interactive toys and kites |
| **Salon** | **Maya** | Stylist apron with pocket comb & scissors | Offers hairstyle makeovers and hair dyeing |
| **Supermarket**| **Oliver**| Market cap, green grocer apron | Operates conveyor belt checkout scanner |
| **Boutique** | **Bella** | Lavender floral beret, chic sash | Recommends matching seasonal outfits |

---

## 5. Adopted Pet System (`Pet.ts`, `PetManager.ts`)
Pets feature matching chibi aesthetic guidelines:
- **Available Breeds**:
  1. *Buttercup Puppy* (`0xffd885` golden retriever mix)
  2. *Mimi Kitten* (`0xffb3d9` pastel calico)
  3. *Snowdrop Bunny* (`0xffffff` long-eared rabbit with blush)
  4. *Peanut Hamster* (`0xdeb887` round seed collector)
  5. *Bao Bao Panda* (`0xffffff` with dark chocolate eye patches)
- **Idle Breathing**: +/-3% scale tween pulsing every 1.4s.
- **Petting Reactions**: Spawns floating heart particles (`❤️`, `✨`) and replenishes player Happiness and Fun stats by +12.
- **Adoption Flow**: Purchasing at Pawprints Pet Boutique moves the pet instance into `playerState.data.pets` and places them in `HomeScene`.

---

## 6. Verification Status
- **Unit & System Tests**: Verified by `tests/character-state.test.ts`, `tests/clothing-manager.test.ts`, and `tests/pet-customization.test.ts` (all passing).
- **Visual Capture**: Full-body chibi render confirmed in `screenshots_audit/01_TownScene.png`, `screenshots_audit/06_HomeScene_Bedroom.png`, and `screenshots_audit/10_SalonScene.png`.
