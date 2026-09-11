# P03 室內場景比例、接地與深度排序交接報告

Phase: P03 (Interior scenes, proportions, grounding & depth sorting)
Status: AWAITING_REVIEW
Candidate code SHA: `37cb2cac61666fc8438c13c4d37d9a076d84cee6`
Branch: `codex/graphics-upgrade`
Remote: `https://github.com/wulingambler88/wulin88.git`

## What changed (功能與改動檔案)

1. **家具真實接地與層級排序修復 (`src/scenes/ClothingShopScene.ts`)**：
   - 修正 Cloudberry Boutique 中盆栽懸空之視覺缺陷：原盆栽位置位於牆壁半空（`y = 240`），修正為真實著地放置於地板角落（`x: 880, y: 390`，底部自然貼合木質地板，與單人扶手椅並列構成優雅更衣角落）。
   - 強化圖層深度（Depth Sorting）：服裝架與穿衣鏡設定為 `depth = 300`，家具設定為 `depth = 400`，主角設定為 `depth = 1000`，確保角色在室內行走穿梭時永遠位於家具與地板前景，杜絕人物被錯誤穿透或覆蓋。
2. **全 11 處室內場景互動與比例校驗**：
   - **Home (3 個連續房間)**：
     - 臥室（Bedroom）：雙人床睡眠互動（安睡閉目睫毛、棉被蓋體）、單人扶手椅坐姿、粉紅地毯、穿衣鏡、衣櫃。
     - 客廳（Living Room）：粉紅沙發坐姿互動、復古天線電視、落地穿衣鏡、書架。
     - 廚房（Kitchen）：復古薄荷綠雙門冰箱（具備小貓與草莓磁鐵、可真實開啟並拿取點心飲料）、流理台、瓦斯爐煎蛋鍋、圓形餐桌與果汁機。
   - **8 大場所（Venues）**：
     - 精品店（Clothing Boutique）：穿衣鏡試裝與愛心星光反應、服裝架互動。
     - 超市（Supermarket）：貨架商品點選進籃、冷藏水果攤位、Oliver 收銀櫃檯。
     - 寵物店（Pet Shop）：五款寵物（小狗、小貓、兔子、倉鼠、熊貓）睡墊撫摸與互動、Daisy 照顧員。
     - 學校（School）：黑板數學題目點擊小測驗、向日葵畫架切換畫作、學生課桌椅、Ms. Blossom 老師。
     - 公園（Park）：鞦韆搖擺、滑梯、沙坑堆城堡、池塘水波倒影與小鴨。
     - 咖啡廳（Café）：義式濃縮咖啡機煮咖啡冒煙、烘焙點心玻璃陳列櫃、粉紅雅座。
     - 沙龍（Salon）：梳妝發光鏡台、洗頭沖水盆、即時更換髮型/染髮與愛心特效、Maya 造型師。
     - 玩具店（Toy Shop）：玩具層架發聲互動（機器人、玩具車、小熊）、地面字母數字拼圖地墊、Toby 店長。
   - 所有室內無外觀建築塞入、無透視失真，主角在各場所行走與操作清楚可辨。
3. **專屬測試與自動化截圖**：
   - `tests/p03-interior-scenes.test.ts`：驗證 9 大場景定義與 sceneKey、2.5D Y 軸深度排序邏輯、Home 3 房間連續 2880px 座標規範。
   - `scripts/capture-p03.mjs`：截取 22 張真實執行畫面（涵蓋 3 個 Home 房間、8 個公共場所，且全部包含真實觸發之互動狀態截圖）。

## Checks actually run (實際執行的檢查)

- `npm run check` (TypeScript --noEmit)：通過，0 errors。
- `npm test` (Vitest 23 test files, 98 tests)：全部通過 (100% pass)。
- `npm run lint` (ESLint src tests)：通過，0 errors, 0 warnings。
- `npm run build` (Vite production bundle)：通過，生成產物無報錯。

## Screenshots + capture metadata (截圖與證據)

證據保存於 `screenshots/phases/P03/`，元資料保存於 `capture.json`（共 22 張）：
1. `01_home_bedroom.png` & `02_home_bedroom_sleeping.png`：臥室與床上安睡互動。
2. `03_home_living_room.png` & `04_home_living_room_sitting.png`：客廳與沙發坐姿互動。
3. `05_home_kitchen.png` & `06_home_kitchen_fridge.png`：廚房與雙門冰箱開啟拿出點心互動。
4. `07_boutique_grounded.png` & `08_boutique_interaction.png`：精品店盆栽著地與試衣鏡星光互動。
5. `09_supermarket_interior.png` & `10_supermarket_interaction.png`：超市內景與點選商品加入購物車。
6. `11_pet_shop_interior.png` & `12_pet_shop_interaction.png`：寵物店與寵物床撫摸互動。
7. `13_school_interior.png` & `14_school_interaction.png`：學校教室與黑板小測驗互動。
8. `15_park_interior.png` & `16_park_interaction.png`：公園與水池漣漪小鴨互動。
9. `17_cafe_interior.png` & `18_cafe_interaction.png`：咖啡廳與義式咖啡機沖煮互動。
10. `19_salon_interior.png` & `20_salon_interaction.png`：沙龍美髮與染髮換裝鏡前互動。
11. `21_toy_shop_interior.png` & `22_toy_shop_interaction.png`：玩具店與拼圖地墊機器人互動。

## Known defects / NOT_TESTED

- 已知限制：P03 僅負責室內比例、家具接地與深度；商品抽屜與衣櫃 UI 的多列滾動、空購物籃提示歸屬 P04。
- NOT_TESTED：行動端觸控手勢及實機 Android 封裝（維持後續規劃）。

## Next action

交由獨立 Reviewer 進行審查驗收，等待 P03 Reviewer Decision。
