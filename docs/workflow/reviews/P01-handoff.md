# P01 角色標準與渲染交接報告

Phase: P01 (Character standard & rendering)
Status: AWAITING_REVIEW
Candidate code SHA: `9c91519a067966c253981939f5ff65a8c1495da6`
Branch: `codex/graphics-upgrade`
Remote: `https://github.com/wulingambler88/wulin88.git`

## What changed (功能與改動檔案)

1. **移除破壞玩家自訂義的 Raster 覆蓋分支**：
   - 徹底移除 `src/characters/AvatarRenderer.ts` 中依據 `twin_buns`/`long_waves` 與上衣硬編碼的靜態貼圖劫持邏輯（舊代碼強行渲染靜態棕髮/金髮貼圖，導致玩家選定紫髮等顏色被完全吞噬、坐下無法切換姿勢、睡覺僅將立體圖旋轉傾斜、換裝突然產生畫風割裂）。
2. **姿勢感知繪本 Chibi 渲染系統**：
   - 支援 5 種髮型（`long_waves`, `twin_buns`, `ponytail`, `bob`, `pixie`）與 6 種髮色（包括紫髮/粉彩薰衣草色 `0xb89fe8`）、4 種膚色與 5 種眼色。
   - 肢體與姿勢感知：
     - `standing`：自然站立姿態，柔和陰影與 Mary Jane 娃娃鞋。
     - `sitting`：真實跪坐/盤腿姿勢，雙手溫柔置於大腿，裙擺自然順應貼合。
     - `sleeping`：安詳閉合睫毛、放鬆眉形、手臂疊於胸口舒適安睡。
     - `happy` / `excited` / `playing`：雙手微握舉於頰側的歡呼姿勢，雙眸金星微光。
   - 精緻細節：小貓髮夾、Daisy/Bunny 圍裙口袋、波浪蕾絲裙擺、斜背小白貓包包。
3. **動態 HUD 頭像同步**：
   - 在 `src/theme/Icons.ts` 提供 `createAvatarPortraitSVG()` 向量頭像生成器。
   - 在 `src/main.ts` 監聽 `character:customized` 事件並即時更新頂欄 `.profile-portrait`，使玩家在更換髮型/髮色（如紫髮）時，頭像與世界中角色即時同步，杜絕「品牌固定肖像」與「玩家自選角色」混淆。
4. **專屬測試與截圖腳本**：
   - `tests/p01-avatar-renderer.test.ts`：覆蓋全髮型、全髮色（含紫髮）、全膚色、全眼色、全姿勢及換裝組合。
   - `scripts/capture-p01.mjs`：真實啟動 Edge 瀏覽器在多解析度（1280×720, 1536×990, 1920×1080）及各場景進行無人工竄改的真實截圖。

## Checks actually run (實際執行的檢查)

- `npm run check` (TypeScript --noEmit)：通過，0 errors。
- `npm test` (Vitest 21 test files, 92 tests)：全部通過 (100% pass)。
- `npm run lint` (ESLint src tests)：通過，0 errors, 0 warnings。
- `npm run build` (Vite production bundle)：通過，生成產物無報錯。

## Screenshots + capture metadata (截圖與證據)

證據保存於 `screenshots/phases/P01/`，元資料保存於 `capture.json`：
1. `01_town_1280x720.png`：城鎮 1280×720 基準畫面。
2. `01_town_1536x990.png`：城鎮 1536×990 畫面。
3. `01_town_1920x1080.png`：城鎮 1920×1080 畫面。
4. `02_character_creator_modal.png`：角色創造工作室開啟，完整展現 5 款髮型、6 種髮染、4 款膚色、5 款瞳色。
5. `03_town_purple_hair_saved.png`：**紫髮存檔實證**，角色自訂粉彩薰衣草紫髮（`0xb89fe8`）在城鎮中真實呈現，左上角 HUD 頭像同步顯示紫髮。
6. `04_home_bedroom_sleeping_pose.png`：臥室中安睡姿勢，角色呈安詳睡姿並有平穩閉目睫毛。
7. `05_home_living_room_sitting_pose.png`：客廳沙發前坐姿，收攏腿部與雙手貼腿。
8. `06_boutique_scene.png`：精品店試衣場景，展示服裝層次。

## Known defects / NOT_TESTED

- 已知限制：P01 僅鎖定角色渲染系統；Town 建築外觀排版與店名標籤屬於 P02 範疇，未在 P01 越界修改。
- NOT_TESTED：行動端觸控手勢、實機 Android 封裝（留待後續驗收）。

## Next action

交由獨立 Reviewer 進行審查驗收，等待 P01 Reviewer Decision。
