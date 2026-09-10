# Qian Hui Avatar City — Location Gameplay Matrix

## 1. Comprehensive Venue Matrix
Every location in Qian Hui Avatar City possesses a dedicated architectural theme, assigned NPC, unique interactive objects, needs replenishment rules, and minigame links:

| Location ID | Venue Name | Color Palette & Theme | Assigned NPC | Key Interactive Equipment | Primary Needs Boosted | Star Coin Opportunities | Minigames & Special Features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`town`** | Town Map & Gardens | Sky Blue (`#bdeaf5`), Peach (`#ffb8d9`) | Qian Hui & Kitten | 9 Location Gateways, Garden paths, River bridge | All (Global hub) | Daily reward chest (+50 ⭐), Today Quests (+30 ⭐) | Day/Night cycle, Clues journal, Brain hub launcher |
| **`home`** | Qian Hui's Cozy Home | Rose (`#f3dbe8`), Buttercream (`#fffdf7`) | Adopted Pets | Bed, Wardrobe, Armchair, Mirror, Rug, Bookshelf | Energy (+30), Happiness (+15), Fun (+18) | Daily decoration quest (+20 ⭐) | Build Mode Quick-Tray, Multi-room switcher (Bedroom, Living, Kitchen) |
| **`clothing_boutique`**| Cloudberry Boutique | Lavender (`#cab8f1`), Powder Pink | Bella (Boutique Ass't)| Clothing racks, Shoe trays, Fitting mirror, Chiffon drapes | Fun (+15), Happiness (+20) | First visit bonus (+25 ⭐) | Makeover styling, Outfit preview & purchase, Surprise Me outfit generator |
| **`supermarket`** | Sunny Basket Market | Mint Green (`#a8ead7`), Lemon Yellow | Oliver (Cashier) | Produce shelves, Chilled fruit stall, Conveyor scanner, Cart | Hunger (+20), Happiness (+10) | Shopping checkout rewards (+10 ⭐) | Interactive grocery shopping, Barcode scanning minigame |
| **`pet_shop`** | Pawprints Pet Boutique | Rose Petal (`#ffb8d9`), Cream | Daisy (Rescue Keeper) | 5 Pet adoption beds, Terrarium, Food bowl | Happiness (+25), Fun (+15) | Adoption badge bonus (+20 ⭐) | Pet adoption system, Pet customization, Cuddle & grooming reactions |
| **`cafe`** | Honeycomb Bakery & Café| Warm Mocha (`#ffc5a5`), Cream Latte | Leo (Barista) | Espresso machine, Pastry dome, Blackboard menu, Cozy booths | Hunger (+25), Energy (+20), Fun (+12) | Order fulfillment (+15 ⭐) | Interactive drink brewing, Pastry tasting, Table seating |
| **`school`** | Sunshine Academy | Golden Sun (`#ffd96f`), Chalk Slate | Ms. Blossom (Teacher)| Math chalkboard, Art easel, Class library, Student desks | Fun (+25), Energy (+10) | Quiz Academy completion (+20 ⭐) | Educational quiz minigame, Painting easel cycling, School bell |
| **`park`** | Sunny Meadow Park | Meadow Green (`#9ee3b4`), Sunny Sky | Flora (Park Ranger) | Swings, Slide, Sandbox, Duck pond, Picnic blanket | Fun (+30), Happiness (+25), Energy (+15) | Sandbox treasure hunt (+15 ⭐) | Sandbox dig minigame, Slide & swing physics, Duck feeding |
| **`salon`** | Sparkle & Snip Salon | Powder Cyan (`#bdeaf5`), Bubblegum | Maya (Hair Stylist) | Hollywood vanity mirror, Styling chair, Shampoo basin | Happiness (+30), Fun (+20) | Hairstyle makeover reward (+20 ⭐) | Real-time hair styling (5 cuts), Hair dye palette (5 tints), Glamour reveal |
| **`toy_shop`** | Starlet Wonder Toy Shop | Cotton Candy (`#ffd6e9`), Royal Gold | Toby (Toy Maker) | Hopscotch mat, Rounded toy shelves, Counter, Kites | Fun (+35), Happiness (+25) | Puzzle Workshop victory (+25 ⭐) | Puzzle Workshop sliding tile minigame, Interactive toy physics |

---

## 2. Character Needs Economy
Every character possesses 4 core needs tracked in `CharacterStats` ($0 - 100$ scale):
1. **Happiness (😊)**: Increased by salon makeovers, pet cuddle, park slide/swings, and dressing up.
2. **Energy (⚡)**: Increased by sleeping on the bed in Home, sipping hot drinks in Café, and relaxing in the salon wash basin.
3. **Hunger (🍎)**: Increased by eating fruits, cakes, croissants, and meals in the Kitchen and Café.
4. **Fun (🎈)**: Increased by solving Little Scholars brain games, playing with toys, reading books, and swinging in the park.

*All stat changes automatically trigger `ui:stats` updates, animating the HUD status bars across indoor and outdoor scenes.*
