# 驗收標準

## P00 文件階段例外

P00 僅驗收流程文件、參考圖、允許路徑、獨立驗收規則、完整候選 SHA 和遠端可取得性。Reviewer 必須確認相對基準没有遊戲程式修改、參考圖可開啟、遠端包含候選 SHA，以及 handoff 指向固定提交。
下面的遊戲檢查適用 P01–P05；純文件 P00 的執行、互動、截圖及遊戲回歸項目為 NOT_APPLICABLE，不作為 P00 PASS 條件。若 P00 包含遊戲修改，退回 REVISE，不能使用此例外。

## P01–P05 共同要求

Reviewer 使用候選 commit 的乾淨 checkout，核對沒有未提交修改。
保存操作步驟、瀏覽器尺寸和程式 SHA；before/after 使用相同尺寸、縮放、場景、相同測試存檔。
獨立測試存檔可用於 QA，禁止清除或覆蓋使用者真實存檔。

- npm run check、npm run lint、npm test、npm run build 必須通過。
- 載入資源無 404、無 page errors。
- 真正點擊相關入口與操作，不只用開發命令切換 scene。
- 圖像不能有不透明背景、內部破洞、白邊或縮小後碎裂。
- 角色選項、購買、取消、導航、保存後重開須保持正確。
- 在指定桌面尺寸中檢查截字、遮擋、滾動末端、面板與玩家位置。

## P01 特別矩陣

逐一檢查五種髮型與每個髮色/膚色/眼色控制，記錄每個選擇是否可見；至少包含紫髮 twin_buns 的舊存檔。
每個 dress/top/bottom/shoes/hat/accessory 分類選擇至少一件，覆蓋觸發 raster/fallback 的組合。
同一角色在 Town、Home、Boutique、Creator 和 HUD 保持玩家選定特徵。
透過實際家具觸發坐下/睡眠，透過實際互動觸發反應。不可只檢查 standing。
透明圖在白色、深色、室內和城鎮背景驗證完整輪廓及角色內部。

## 決策

PASS：本階段全部必驗項通過，有候選 SHA 和證據。
REVISE：任一必驗項失敗、缺證據、候選 SHA 不吻合或有未測試的必驗項。
非本階段小問題可記錄到後續階段；不可把本階段未完成工作延期後聲稱 PASS。

Reviewer report 必填：phase、reviewed SHA、reviewer task identity、date、decision、執行的檢查、截圖連結、問題、下一個允許階段。
程式修改後舊 PASS 失效；單純追加驗收文件不改變已審程式的狀態。
全部階段通過後，再取得使用者對最終畫面的 merge 批准。
