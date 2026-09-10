# Art Target Summary (Prompt 8)

This document summarizes the graphical art direction targets established in `docs/art-target/`. The graphical target boards are the source of truth for all visual and animation polish in Qian Hui Avatar City.

---

## 1. Visual Identity: "Soft Candy Town"

- **Theme**: Premium digital dollhouse toy with calm, joyful, tactile micro-interactions.
- **Audience**: Children aged 6–12 (and parents/educators).
- **Core Feeling**: Cute, warm, playful, soft, toy-like, readable, and mobile-friendly.
- **Original IP Rules**: No copying from Toca Boca, Avatar World, or commercial competitors. Bespoke character faces, original palette balance, and proprietary SVG vector icon set.

---

## 2. Color Palette System

| Swatch Role | Color Name | Hex Code | Purpose |
|---|---|---|---|
| **Primary Accent** | Strawberry Pink | `#FF8FC4` | Brand hero, main interactive badges, close buttons |
| **Secondary Accent** | Sun Gold | `#FFD96F` | Star Coins, rewards, selection rings, primary button glow |
| **Cool Accent** | Fresh Mint | `#A8EAD7` | Nature, edit actions, owned status ribbons |
| **Cool Accent** | Sky Blue | `#BDEAF5` | Town buildings, windows, water, pajama accents |
| **Whimsical Accent** | Soft Lavender | `#CAB8F1` | Bedroom rugs, mystery clues, cozy furniture |
| **Warm Accent** | Peach Cream | `#FFC4A8` | Table surfaces, warm woodwork, roof tiles |
| **Base Surface** | Cream White | `#FFFDF7` | UI cards, modal bodies, speech bubbles, clean contrast |
| **Outline Ink** | Soft Plum Ink | `#663D63` | Standard line art (replaces harsh `#000000`) |
| **Midline Ink** | Medium Plum | `#754C72` | Secondary details, text headings, furniture legs |
| **Contact Shadow** | Plum Tint | `rgba(102, 61, 99, 0.18)` | Soft grounding ovals beneath props and characters |

---

## 3. Line Style & Shadow Rules

1. **No Pure Black Lines**: All outlines use `#663D63` (Soft Plum Ink).
2. **Line Hierarchy**:
   - `3.0px`: Outer character silhouette & major UI shell headers.
   - `2.0px`: Furniture frames, buildings, and interactive props.
   - `1.5px`: Facial details, inner seams, and fabric stitches.
   - `2.5px white`: Inner separator / sticker-edge highlights.
3. **Contact Shadows**:
   - Every standing character, adopted pet, and grounded furniture item casts a soft oval shadow (`rgba(102, 61, 99, 0.18)`).
   - In flight / dragging, the shadow expands and softens (`0.10–0.12` opacity) 12px below the lifted object.

---

## 4. Character Anatomy & Proportions

- **Total Height**: ~160–320 logical pixels (depending on canvas zoom).
- **Head Ratio**: ~48% (large, expressive chibi head with double eye sparkle highlights).
- **Torso Ratio**: ~31% (cute, rounded body with clothing layer support).
- **Legs & Feet**: ~21% (chubby legs with rounded pastel shoes and ribbon accents).
- **Idle Motion**:
  - Breathing loop: `scaleY: 1.015` over 2,800ms sine cycle.
  - Blinking: Natural randomized interval (2.5s–5.5s) with a 20% chance of double-blinking.
- **Physical Drag Feedback**:
  - Lift: scales to `1.04x` with z-order elevation and shadow separation.
  - Drop settle: squash-and-stretch settle (`1.04` → `0.95` squash → `1.02` rebound → `1.00` rest) in 220ms.

---

## 5. UI Component & Navigation System

- **No Raw Emojis in Game UI**: All navigation items, currency indicators, and modal buttons use original, crisp SVG vector icons.
- **Button Language**:
  - **Candy Primary**: Rounded pill shape (`border-radius: 24px`), gloss top reflection, press compression (`transform: scale(0.95)`).
  - **Secondary**: Cream base with soft plum outline and pastel text.
  - **Icon Buttons**: Minimum `48×48px` touch targets with centered vector glyphs and active glow rings.
- **Bottom Navigation**: Unified 8-item dock with clear icon + short label typography, respecting safe-area insets on mobile notch devices.
- **Modals**: Warm cream cards with soft drop shadows, rounded tab switchers, and generous touch padding.

---

## 6. Environment Depth & Lighting

- **4-Layer Depth Architecture**:
  1. **Background**: Pastel wallpaper with soft vertical stripes or wainscoting.
  2. **Architectural Trim**: Crown molding on top, window framing with soft light cone, and baseboard skirting (`16px`) grounding the wall onto the floor.
  3. **Floor Plane**: Soft wood/tile perspective angle with decorative oval rugs.
  4. **Interactables Layer**: Grounded furniture, draggable loose items, pets, and characters with individual contact shadows.

---

## 7. Motion Design & Animation Language

- **Central Motion Tokens** (`src/theme/MotionTokens.ts`):
  - `BUTTON_PRESS`: 70ms down, 120ms up (`Cubic.easeOut`).
  - `ITEM_PICKUP`: 140ms (`Back.easeOut`).
  - `DROP_SETTLE`: 180ms (`Bounce.easeOut`).
  - `MODAL_OPEN`: 220ms (`Back.easeOut` with 1.4 overshoot).
  - `SCENE_TRANSITION`: 320ms pastel iris circle expansion.
  - `IDLE_BREATH`: 2,800ms sine loop.
  - `BLINK_INTERVAL`: 2,500ms–5,500ms randomized.
- **Reduced Motion Support**: Automatically collapses ambient sway, idle breathing, and large iris wipes when `prefers-reduced-motion` is detected.

---

## 8. Graphical Target Assets Manifest

- `docs/art-target/01_ART_DIRECTION_BOARD.svg` & `.png`: Visual palette, shapes, line styles, and lighting.
- `docs/art-target/02_UI_DESIGN_TARGET.svg` & `.png`: Full game viewport HUD, candy buttons, and component states.
- `docs/art-target/03_CHARACTER_STYLE_TARGET.svg` & `.png`: 2.5D chibi proportions, 6 facial expressions, and 5 poses.
- `docs/art-target/04_ENVIRONMENT_STYLE_TARGET.svg` & `.png`: Diorama room depth, town exterior, and prop scale ratios.
- `docs/art-target/05_ANIMATION_LANGUAGE.svg` & `.png`: Motion curves, timing diagrams, and central motion tokens.
