# Qian Hui Avatar City — Graphics and UI Audit

Date: 6 September 2026  
Scope: Desktop, 1280 × 720. All 21 PNGs in this folder were visually reviewed.  
Status: Audit only. No application code, artwork, or layout was changed.

## Overall assessment

The town is the strongest visual asset: its detailed buildings, warm palette, gardens, and winding paths communicate a welcoming miniature city. The pink-and-cream navigation also gives the game a recognizable identity. However, the quality drops sharply between the town, furnished home, and simpler venues. The current result is not yet visually cohesive or consistently readable at this desktop size.

Compared with the reference picture supplied in the conversation, the game captures the cheerful city theme but not its consistent illustration style, clear character silhouettes, uncluttered labels, and balanced interface placement. Adding detailed objects alone has not resolved that gap; several added objects now overlap existing fixtures.

This report covers appearance and visual usability only. It does not certify navigation, purchases, saves, animation, or accessibility compliance. Findings describe the captured frames; a screenshot cannot establish whether a transient effect or missing character persists during play.

Priority: **P1** = materially obscures important content; **P2** = substantial consistency/readability issue; **P3** = polish. Priorities are audit judgments, not implemented tasks.

## Findings

### G01 — P1: Town UI covers destination labels and daily tasks

Evidence: [Town](01_town.png), [Daily activities](15_daily_activities.png), [Night](21_town_night.png).

- Toy Shop and Salon labels sit behind the bottom navigation.
- Only the lower entries of the top-left task card are visible beneath the header; its heading and first task are not readable in these captures.
- The right-side wooden sign is cut off by the viewport edge.
- Market signage competes with the large salon scissors, while gift decoration competes with the Pet Shop area.

The composition has too little reserved space for fixed UI. A future visual acceptance check should require all destination names and task rows to remain readable simultaneously at 1280 × 720. Hidden labels do not prove that destination clicks are broken, but they weaken discovery.

### G02 — P1: Product panels truncate essential shopping information

Evidence: [Boutique catalogue](16_boutique_catalogue_open.png), [Market basket](17_market_basket_open.png).

The boutique uses narrow cards with long names wrapping tightly against prices. Some price lines extend toward card boundaries. The market's three-column layout cuts off names such as Strawberry and Water; its basket area occupies much of the lower panel, with additional product rows only partially visible above it. Whether scrolling exposes all items needs runtime verification.

The panel should communicate the complete product name, image, and cost without ambiguous clipping. The large, strongly colored Checkout button also looks actionable while the basket is empty; that is a visual-state issue, not evidence of an invalid transaction.

### G03 — P2: Three competing art styles weaken the world identity

Evidence: [Bedroom](02_bedroom.png), [Market](06_market.png), [Park](08_park.png), [School](12_school.png).

Painterly furniture and room backgrounds coexist with flat outlined appliances, geometric scenery, emoji-like props, and differently rendered characters. The park is especially sparse and diagram-like compared with its richly illustrated town exterior. The school teacher is a simple geometric figure while nearby characters use detailed chibi art.

The desired direction needs a shared standard for outlines, shading, texture, perspective, and character rendering across locations. This is the largest gap from the reference image.

### G04 — P2: Asset placement and depth are visibly inconsistent

Evidence: [Pet Shop](07_pet_shop.png), [Café](09_cafe.png), [Salon](10_salon.png), [School](12_school.png).

- Pet Shop contains a full exterior shop building behind the pet beds, competing with the animals rather than reading as an interior fixture.
- School similarly contains an exterior school building behind the bookshelf and teacher.
- Salon's clothing rack intersects the wash station and chair; its two mirror treatments compete.
- Café overlays a detailed table/display case with flat booth components. The barista's lower body reads in front of the counter rather than naturally behind it.
- Market and Pet Shop NPC placement also gives a standing-on/in-front-of-counter impression.

These are visible composition problems, not simply a need for more decoration. A consistent ground plane, purposeful scale, and clear front/back ordering are needed before additional props would help.

### G05 — P2: Character clarity and identity vary

Evidence: [Town](01_town.png), [Boutique](05_boutique.png), [Bedroom](02_bedroom.png).

Town characters appear much smaller and more jagged/speckled than the surrounding buildings. The main character is difficult to distinguish immediately in the busy central path. Indoors, the player character has a lighter, thinner-lined treatment than several resident characters. The brown-haired profile portrait does not match the blonde avatar shown in the world.

The portrait might intentionally be a brand mascot, but its placement implies player identity. That distinction should be intentional and understandable. Animation and sprite-export quality cannot be diagnosed from these stills alone.

### G06 — P2: Avatar customization hides the subject being customized

Evidence: [Avatar creator](14_avatar_creator.png).

The modal is mostly text choices and color swatches, with no visible character preview. The world behind it is blurred. The eye-color row is partly hidden at the bottom of the visible content above Save Look. A scrollable form may make more options reachable, but the captured view does not make that obvious.

For a dress-up-centered game, evaluating the resulting look should be easier than reading hairstyle names. This is a visual product-design concern, not a claim that saving is broken.

### G07 — P2: Wardrobe categories and thumbnail semantics need attention

Evidence: [Wardrobe](18_home_wardrobe_open.png).

The category strip is cut off on the right. “Surprise Me” wraps awkwardly into a small header control. “Flower Pearl Wreath” uses a top-hat thumbnail, creating an immediate mismatch between label and image. Detailed garment thumbnails and generic shirt/shorts icons also look like different levels of completion.

### G08 — P2: Desktop framing wastes space while small controls remain crowded

Evidence: [Living room](03_living_room.png), [Kitchen](04_kitchen.png), [Boutique](05_boutique.png).

Wide pale-blue side gutters reduce the usable scene width. Meanwhile, bottom helper copy wraps across two or three lines, room selectors rely on tiny icons, and several in-world price/name labels are small. In bedroom/kitchen captures, a rounded white element is partially visible at the bottom edge of the scene, suggesting clipped content that requires identification.

The character is not visible in the living-room and kitchen captures. That may be intentional room-camera behavior rather than a rendering defect; visually, however, those views lack a clear player focal point.

### G09 — P2: Interaction cues are not consistently distinguished from decoration

Evidence: [Kitchen](04_kitchen.png), [Park](08_park.png), [Café](09_cafe.png), [Toy Shop](11_toy_shop.png).

Rich decorative props can look more interactive than the actual small, flat hotspots. The toy play mat is partially covered by the avatar. Kitchen props and fixture labels overlap closely. The helper text carries much of the burden of explaining where to click.

A consistent visual language for selectable objects, active state, and feedback would improve clarity. Hitbox correctness was not tested here.

### G10 — P3: Day/night and icon polish are uneven

Evidence: [Day](01_town.png), [Sunset](20_town_sunset.png), [Night](21_town_night.png), [Settings](19_home_settings_open.png).

Sunset is only subtly different from day in these captures. Night mainly reads as a dimmed daytime painting rather than a separately lit evening world. The time icon changes from a large illustrated sun to much smaller sunset/moon symbols. The visible DEV badge and plain settings checkbox also sit outside the otherwise decorated UI language. DEV may be appropriate for development, but should not be mistaken for release presentation.

## Screen-by-screen coverage

| Screenshot | Graphic/UI comment |
| --- | --- |
| [01 Town](01_town.png) | Attractive city art; crowded HUD, clipped labels, weak avatar separation. |
| [02 Bedroom](02_bedroom.png) | Warm, appealing room; lamp/book treatment differs from furniture; partial bottom element. |
| [03 Living room](03_living_room.png) | Cohesive room palette; flat television contrasts with sofa; no avatar visible. |
| [04 Kitchen](04_kitchen.png) | Clear room theme; appliance/background mismatch, crowded props, no avatar visible. |
| [05 Boutique](05_boutique.png) | One of the stronger interiors; painterly rack/mirror work well; floating-looking plant and mixed character styles. |
| [06 Market](06_market.png) | Organized shelves and visible prices; detailed produce stall clashes with flat architecture. |
| [07 Pet Shop](07_pet_shop.png) | Names/prices are visible; exterior building inside room and simplified animals weaken coherence. |
| [08 Park](08_park.png) | Activities spatially separated; very sparse and flat compared with town. |
| [09 Café](09_cafe.png) | Welcoming palette; counter depth and overlapping furniture need review. |
| [10 Salon](10_salon.png) | Recognizable styling theme; rack/wash-station overlap and competing mirrors. |
| [11 Toy Shop](11_toy_shop.png) | Playful colors; avatar obscures mat, toys are much simpler than resident art. |
| [12 School](12_school.png) | Blackboard is legible; exterior building and mixed teacher style disrupt classroom. |
| [13 Brain games](13_brain_games.png) | Strongest panel hierarchy; clear tabs, large cards, visible pairs/flips. Only initial memory view captured. |
| [14 Avatar creator](14_avatar_creator.png) | Clean color grouping; no visible preview, lower options partly hidden. |
| [15 Daily activities](15_daily_activities.png) | Friendly copy and clear reward; overlays town and duplicates clipped task card. |
| [16 Boutique open](16_boutique_catalogue_open.png) | Product imagery helps; card text/prices are cramped. |
| [17 Market open](17_market_basket_open.png) | Basket total is prominent; product names and lower rows clipped in view. |
| [18 Wardrobe](18_home_wardrobe_open.png) | Readable item cards; clipped category strip and mismatched wreath icon. |
| [19 Settings](19_home_settings_open.png) | Simple, readable panel; little visual integration and only one setting shown. |
| [20 Sunset](20_town_sunset.png) | Preserves readability; weak atmosphere change and undersized time icon. |
| [21 Night](21_town_night.png) | Dimmer scene with readable HUD; daytime lighting remains dominant. |

## Recommended order for a future graphics pass

1. Resolve desktop clipping and overlapping panels/labels.
2. Establish one illustration standard and correct prop scale/depth.
3. Make the player and interactive objects visually distinct.
4. Improve creator previews, catalogue cards, wardrobe icons, and room framing.
5. Refine time-of-day lighting and small interface details.

These are recommendations only. No fixes were performed. No contrast-ratio measurements, animation review, larger desktop viewport testing, or mobile audit was conducted.
