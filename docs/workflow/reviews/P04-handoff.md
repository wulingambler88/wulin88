# P04 換裝與商店購物 UI 精緻化交接報告

Phase: P04 (Wardrobe & store shopping UI polish)
Status: AWAITING_REVIEW
Candidate code SHA: `e4066ad629b63e0dc9231fbcff8a82b0a7f10a3f`
Branch: `codex/graphics-upgrade`
Remote: `https://github.com/wulingambler88/wulin88.git`

## What changed (功能與改動檔案)

1. **角色創造器（Character Creator）即時預覽與取消復原 (`src/ui/CharacterCreatorModal.ts`, `src/style.css`)**：
   - 底部操作列新增取消按鈕（`#creator-cancel`，`.creator-cancel-btn`）並置於「Save Look」旁。
   - 點擊取消（Cancel）呼叫 `close(true)`，立即將角色的即時預覽外觀復原為開啟前之原始設定（`this.onApply(this.original)`），安全關閉視窗且不寫入任何存檔。
   - 點擊「Save Look」則完整持久化自訂資料至 `playerState.data.character.customization`，同步呼叫 `savePlayerState()` 存檔。
2. **衣櫃分類過濾與空分類優雅提示 (`src/main.ts`, `src/world-style.css`)**：
   - 在 `.wardrobe-panel` 內新增 `#wardrobe-empty`（`.wardrobe-empty-state`）元件。
   - 分類頁籤（All, Dress, Top, Bottom, Shoes, Hat, Accessory）精準計算擁有件數；當該分類無任何已擁有服飾（例如尚未購買配飾時），顯示溫馨提示文字「No items in this category yet! ⭐ Visit Cloudberry Boutique to shop for more styles!」，指引玩家前往精品店選購。
   - 強化 `clothingIcon` 邏輯，建立 `CLOTHING_ITEM_ICONS` 完整涵蓋全部 27 款服飾之代表圖標，與點陣 `.webp` 圖樣雙軌互補。
   - 點選衣物時即時穿戴並同步至場景角色，儲存至 `playerState.data.character.equipped`。
3. **超市購物車精緻化、清空與防碰撞排版 (`src/main.ts`, `src/style.css`, `src/world-style.css`)**：
   - 購物籃操作區新增清空按鈕（`#cart-clear-button`，「🗑 Clear」）。
   - 點擊清空按鈕發送 `market:clear` 事件，安全清空購物籃暫存清單，不扣除金幣亦不變更玩家背包。
   - 購物車為空時，居中渲染專屬提示訊息 `.cart-empty-message`（「🧺 Your basket is empty! ⭐ Tap products to add them.」），並自動停用「Checkout」與「Clear」按鈕。
   - 修正 CSS 選擇器衝突：避免 `.cart-lines > div` 將空購物籃提示錯誤套用為 3 欄網格佈局；調整商品網格與購物車展開/收合時的高度彈性分配。
   - 購物籃切換按鈕即時反映當前件數：`🧺 Basket (N)`。
4. **UI 遮罩防穿透防禦（Phaser Canvas Click-Through Prevention）**：
   - 在 `#wardrobe-panel`、`#shop-panel`、`#market-panel` 及分類按鈕上攔截並呼叫 `event.stopPropagation()`（支援 `pointerdown`, `mousedown`, `touchstart`, `click`），徹底杜絕點擊抽屜 UI 誤觸底層 Phaser 建築物（例如咖啡廳等）的問題。
5. **完整單元測試與自動化截圖**：
   - `tests/p04-shopping-wardrobe.test.ts`：共 14 項單元測試，完整覆蓋 CharacterCreatorModal 取消復原與保存、衣櫃分類過濾與空分類提示、精品店商品購買與重複購買防護、超市商品加入/累加/清空/結帳與餘額不足防護。
   - `scripts/capture-p04.mjs`：自動化測試腳本，於 1280×720、1536×990、1920×1080 視口截取 22 張真實執行畫面與操作驗證。

## Checks actually run (實際執行的檢查)

- `npm run check` (TypeScript --noEmit)：通過，0 errors。
- `npm test` (Vitest 24 test files, 112 tests)：全部通過 (100% pass)。
- `npm run lint` (ESLint src tests)：通過，0 errors, 0 warnings。
- `npm run build` (Vite production bundle)：通過，生成產物無報錯。

## Screenshots + capture metadata (截圖與證據)

截圖保存於 `screenshots/phases/P04/`，元資料保存於 `capture.json`（共 22 張）：
1. `p04-creator-modal-open-1280x720.png`：開啟角色創造器與取消/保存按鈕佈局。
2. `p04-creator-live-preview-1280x720.png`：創造器即時動態更換外觀預覽。
3. `p04-creator-cancel-restore-1280x720.png`：點擊 Cancel 成功復原為原始外觀。
4. `p04-creator-saved-1536x990.png`：點擊 Save Look 成功持久化保存外觀。
5. `p04-wardrobe-all-1280x720.png`：衣櫃全部物品網格。
6. `p04-wardrobe-dress-1280x720.png`：衣櫃洋裝（Dress）過濾。
7. `p04-wardrobe-top-1280x720.png`：衣櫃上衣（Top）過濾。
8. `p04-wardrobe-bottom-1280x720.png`：衣櫃下身（Bottom）過濾。
9. `p04-wardrobe-shoes-1280x720.png`：衣櫃鞋款（Shoes）過濾。
10. `p04-wardrobe-hat-1280x720.png`：衣櫃帽子（Hat）過濾。
11. `p04-wardrobe-empty-accessory-1280x720.png`：衣櫃配飾空分類優雅提示。
12. `p04-wardrobe-surprise-1536x990.png`：衣櫃隨機驚喜穿搭效果。
13. `p04-boutique-shop-top-row-1280x720.png`：精品店商品頂部列。
14. `p04-boutique-shop-scrolled-bottom-1280x720.png`：精品店平滑滾動至底部。
15. `p04-boutique-preview-actions-1280x720.png`：精品店商品試穿預覽與購買動作。
16. `p04-market-empty-basket-1280x720.png`：超市空購物籃專屬居中提示。
17. `p04-market-products-top-row-1280x720.png`：超市商品頂部列。
18. `p04-market-products-scrolled-bottom-1280x720.png`：超市商品平滑滾動至底部。
19. `p04-market-basket-items-1280x720.png`：超市商品點選加入購物籃並累加數量。
20. `p04-market-basket-cleared-1280x720.png`：點擊清空按鈕成功重設購物籃。
21. `p04-market-checkout-success-1536x990.png`：結帳成功扣幣並入庫背包。
22. `p04-full-desktop-1920x1080.png`：1920×1080 視口完整購物與衣櫃佈局展示。

## Known defects / NOT_TESTED

- 已知限制：P04 專注於商店與衣櫃 UI；各場所整體場景與存檔全量回歸將於 P05 進行總體驗收。
- NOT_TESTED：行動端 Capacitor 原生震動反饋（受限於 headless 瀏覽器環境）。

## Next action

交由獨立 Reviewer 進行審查驗收，等待 P04 Reviewer Decision。
