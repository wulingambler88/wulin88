# P02 城鎮構圖與自適應介面交接報告

Phase: P02 (Town scene composition & responsive UI)
Status: AWAITING_REVIEW
Candidate code SHA: `06818c3b64f0d16c252ff7b1365c7522416da9ec`
Branch: `codex/graphics-upgrade`
Remote: `https://github.com/wulingambler88/wulin88.git`

## What changed (功能與改動檔案)

1. **九大場所名牌標籤定位與零遮擋優化 (`src/scenes/TownScene.ts`)**：
   - 建立細緻的 `BADGE_CONFIG` 分佈映射，針對所有 9 個地點（`home`, `clothing_boutique`, `supermarket`, `pet_shop`, `school`, `park`, `cafe`, `toy_shop`, `salon`）分別指定合適的高度 `y`、膠囊寬度 `w` 及圖示。
   - 解決 Boutique 與 Supermarket 被前排建築（Toy Shop 泰迪熊耳朵、Salon 剪刀）局部遮擋的歷史缺陷：
     - 將 `clothing_boutique` 名牌標籤設定於屋頂安全位置（`y: -16`），全域 Y 座標為 262，遠高於 Toy Shop 屋頂尖端（Y ~ 295），文字 `👗 BOUTIQUE` 100% 完整露出，不再被遮擋。
     - 將 `supermarket` 名牌標籤設定於綠色屋頂安全位置（`y: -16`），全域 Y 座標為 262，遠高於 Salon 剪刀（Y ~ 295），文字 `🛒 MARKET` 100% 完整露出。
   - 為所有場所建立寬裕點擊區域 `hit`（寬度包含膠囊及周圍邊距，高度涵蓋建築本體與標籤），確保滑鼠懸停出現 pointer 手型游標，點擊建築任何部位皆可準確觸發進入場所。
2. **全解析度滿版沉浸式桌面響應 (`src/world-style.css`)**：
   - 在桌面寬度情境（`min-width: 1050px`）下，讓 `.game-shell[data-context="town"]` 滿版延展（`width: 100vw; max-width: 100vw; height: 100vh;`），消除 1920×1080 下原本因 1280px 限制產生的巨大空白邊框，實現 16:9 原生全螢幕畫質。
   - 將頂部資訊列 `.top-bar` 與底部導航欄 `.bottom-bar` 採用水平居中與彈性最大寬度（`width: min(1400px, calc(100% - 28px)); left: 50%; transform: translateX(-50%);`），在超寬螢幕上保持比例平衡與舒適閱讀距離，不會過度拉扯兩端圖示。
   - 保持左側任務卡片 `.town-left-deck` 在左上方天空處自然懸浮，不遮擋任何地面建築與中央道路主角。
3. **專屬測試與自動化截圖腳本**：
   - `tests/p02-town-scene.test.ts`：驗證 9 大建築定義齊全、Boutique/Market 標籤與下排建築安全距離（`y < 275`）、日夜晨昏三段循序循環。
   - `scripts/capture-p02.mjs`：全自動截取 14 張無人工竄改之真實 headless 運行截圖（涵蓋 3 大桌面尺寸、日夕夜天色切換、全部 9 個入口真實點擊與場景跳轉）。

## Checks actually run (實際執行的檢查)

- `npm run check` (TypeScript --noEmit)：通過，0 errors。
- `npm test` (Vitest 22 test files, 95 tests)：全部通過 (100% pass)。
- `npm run lint` (ESLint src tests)：通過，0 errors, 0 warnings。
- `npm run build` (Vite production bundle)：通過，生成產物無報錯。

## Screenshots + capture metadata (截圖與證據)

證據保存於 `screenshots/phases/P02/`，元資料保存於 `capture.json`：
1. `01_town_day_1280x720.png`：城鎮日間 1280×720 基準畫面，9 個建築標籤均完整清晰。
2. `01_town_day_1536x990.png`：城鎮日間 1536×990 畫面，自適應居中無變形。
3. `01_town_day_1920x1080.png`：城鎮日間 1920×1080 滿版畫面，兩側無黑邊/藍邊，頂底列美觀居中。
4. `02_town_sunset_1280x720.png`：夕陽暖橙金黃氛圍，時間圖示切換為夕陽。
5. `03_town_night_1280x720.png`：靜謐深藍星夜，空中閃爍點點星光，時間圖示切換為新月。
6. `04_nav_home.png`：透過真實點擊 HOME 建築成功跳轉進入 HomeScene。
7. `05_nav_clothing_boutique.png`：真實點擊 BOUTIQUE 建築成功進入 ClothingShopScene。
8. `06_nav_supermarket.png`：真實點擊 MARKET 建築成功進入 SupermarketScene。
9. `07_nav_pet_shop.png`：真實點擊 PET SHOP 進入 PetShopScene。
10. `08_nav_school.png`：真實點擊 SCHOOL 進入 SchoolScene。
11. `09_nav_park.png`：真實點擊 PARK 進入 ParkScene。
12. `10_nav_cafe.png`：真實點擊 CAFÉ 進入 CafeScene。
13. `11_nav_salon.png`：真實點擊 SALON 進入 SalonScene。
14. `12_nav_toy_shop.png`：真實點擊 TOY SHOP 進入 ToyShopScene。

## Known defects / NOT_TESTED

- 已知限制：P02 僅負責城鎮外觀與 HUD 自適應排版；各室內場景內部長寬比例、家具深度排序和室內美術歸屬 P03 範疇。
- NOT_TESTED：行動端觸控手勢及實機 Android 封裝（維持後續規劃）。

## Next action

交由獨立 Reviewer 進行審查驗收，等待 P02 Reviewer Decision。
