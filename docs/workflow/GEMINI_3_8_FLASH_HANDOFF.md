# Gemini 3.8 Flash — 施工交接與防偏離規則

交接日期：2026-09-10。角色：**施工模型（Builder）**。模型名称沿用使用者指定，不涉及 API model ID 設定。
本文件不授予你規劃者或驗收者權限。Codex／獨立 reviewer 負責驗收；使用者批准最終 merge。

## 直接開始的指令

你正在接手既有 Qian Hui Avatar City，請先讀這份文件並核對遠端狀態。
目前 P00 AWAITING_REVIEW，P01–P05 NOT_STARTED。你現在只能讀取文件、檢查 Git 狀態和整理開工摘要。
**沒有對應新候選 SHA 的 P00 PASS，就停止，不修改遊戲、不自行完成複驗、不開始 P01。**
停止時回報：「等待 P00 獨立複驗；未修改遊戲。」不要反覆問使用者是否開始。
當獨立 reviewer 正式授權 P01，才執行下方 P01 任務。每一階段提交後停止等待。

## 專案定位

- Repo：https://github.com/wulingambler88/wulin88
- Draft PR：https://github.com/wulingambler88/wulin88/pull/1
- 工作 branch：codex/graphics-upgrade
- main：現有遊戲基準，禁止直接施工或合併。
- 本機：C:/Users/P3761/Documents/Qian Hui Avatar City
- C:/Users/P3761/Documents/kids 是另一個專案，不是這個遊戲的工作目錄。
- 技術：TypeScript、Phaser、Vite；保留現有架構和依賴。
- Portable Node：C:/Users/P3761/Documents/node-v24.20.0-win-x64
- 本次交接前 branch tip：8a2dbc87e83d18e5bfdda93b9a0f38b991a4f19b。
- 基準程式：81f4c9871190abc078c26b050884f26a70da09bb。
- P00 複驗候選：f128a137fb24d973be8ed98235276ea07134c338。
- 上述 8a2dbc8 提交補上固定候選 SHA 的 handoff；本文件會另外追加文件 commit，不會改變候選。
- 原 8222a29 候選被 REVISE，不能把舊報告當作新候選 PASS。

## 必讀與衝突處理

依序讀：

1. /AGENTS.md
2. /docs/workflow/START_HERE.md
3. /docs/workflow/DESIGN.md
4. /docs/workflow/PHASES.md
5. /docs/workflow/ACCEPTANCE.md
6. /docs/workflow/reviews/P00-handoff.md 和目前 reviewer 報告
7. /docs/references/target-town.png（實際開圖檢視）

本文件是交接快照。使用者的新指令最高優先；更新的正式 phase/review 文件決定目前授權，但必須驗證 SHA。
若規劃、review 和 handoff 互相矛盾，回報具體檔案與矛盾，保持原階段，不自行挑寬鬆版本。
根目錄歷史 completion reports 只作背景；不能據此宣稱目前階段通過。
PR open、commit、push、綠色測試都不等於 reviewer PASS。

## 首次接手的核對

先使用正確工作目錄，執行 git status --short、git branch --show-current、git remote -v、git log -5 --oneline。
核對 origin 為上述 repo。乾淨工作目錄才 fetch；如有其他人的未提交修改，保留並報告，不覆蓋。
若要更新 checkout，先檢查差異與分支是否分叉，只可 fast-forward，不 force/reset/stash 他人的工作。
已存在的 repo 不重新 git init，不追加 GitHub 範例 README，不改名為 Pocket Town Life。
不要修改使用者的 Git 全域設定，不在命令或文件中放入 token。
若登入或 push 失敗，如實回報並保留本地 commit，不宣稱已上傳。

第一次回報應包括：repo、branch、HEAD SHA、目前 phase、上一個驗收的 SHA/decision、能否開工、當前允許路徑。
這是狀態核對，不是要求使用者重複授權。

## P01 任務（僅在 P00 PASS 後生效）

目標：保持玩家選定的角色身份，讓髮型、髮色、膚色、眼色、服裝、姿勢在遊戲與預覽中正確顯示；達到 DESIGN 的柔和繪本 chibi 方向。

先重現現有問題：

- AvatarRenderer 依 twin_buns、long_waves 和 top 切換 raster/fallback。
- 固定 raster 不會反映所有玩家選擇；換一件 top 可能突然換了畫風或身份。
- twin_buns 圖像是固定慶祝姿勢，坐下也沿用它。
- HUD 固定品牌肖像可能被誤認為玩家；需要明確區分，或使用同一玩家 renderer。
  這些是源碼線索；操作重現後才能在報告確認，不要假設每個存檔都相同。

允許修改：

- src/characters/
- src/ui/CharacterCreatorModal.ts
- src/theme/
- src/scenes/PreloadScene.ts
- public/art/characters/
- src/main.ts 只限角色預覽／肖像事件
- P01 專用 tests/、scripts/、screenshots/phases/P01/、docs/workflow/reviews/P01-handoff.md

禁止擴張到 Town 構圖、室內重設、商品面板重排等 P02–P04 任務。若必要修正跨範圍，交 planner 調整任務，不自行擴大路徑。

實作底線：

- 保留舊存檔與玩家紫髮等選擇；不能強制棕髮或 reset 存檔以符合品牌圖。
- 不以隱藏控制、刪掉衣服／髮型或停用玩法修正顯示問題。
- 不把退回原始幾何 fallback 宣稱為美術升級；功能正確與美術品質都需證據。
- 不把同一姿勢套用站／坐／睡；不要讓表情改變身份。
- 有 RGBA 或四角透明不代表素材合格，需檢查整張 alpha、內部破洞、光暈及缩小後邊緣。
- 新素材另存版本，保留原檔；固定納入 repo，不引用 Temp 或模型輸出資料夾。
- 有圖像工具才產生圖；工具不可用就說明缺口，不以未產生／未整合素材宣稱完成。
- 不新增學科、五元素、戰鬥或其他 kids 專案概念；不改經濟、存檔契約或新增 runtime LLM。

## 驗證與證據

使用獨立 QA profile/存檔，不覆蓋玩家真實資料。
依 ACCEPTANCE 完整覆蓋五種髮型、全部髮色/膚色/眼色、預設與舊紫髮存檔、六種服裝分類、站/坐/睡/反應。
透過真實 UI 及家具操作；直接跳 scene 只能輔助定位，不能替代入口和互動驗證。
在 Town、Home、Boutique、Creator/HUD 比較同一角色。
桌面尺寸：1280×720、1536×990、1920×1080，100% zoom。
在白、深色與遊戲背景檢查完整透明素材。

執行 npm run check、npm run lint、npm test、npm run build；逐一核對 exit code。
2026-09-10 基準 20 files / 87 tests 通過只是歷史結果，不能替你此次修改作證。
如果無法開瀏覽器、讀圖或完成操作，把項目記為 NOT_TESTED，狀態交給 reviewer，不能自行 PASS。

保存 before/after 截圖及 capture.json，包含 viewport、URL、時間、存檔情境、操作步驟與程式 SHA。
不要後製遊戲截圖，不用設計稿冒充實際畫面，不將參考圖直接鋪滿畫面冒充互動遊戲。
SHA 記錄不能自我循環：可先 commit 程式取得 SHA，再從該版本拍圖，另 commit 證據/交接文件；handoff 說明證據之後是否有程式變動。

## 每階段結束的固定流程

1. 檢查 git diff 和相關檢查；只 stage 本階段檔案。
2. commit 程式並記錄完整候選 SHA；證據／handoff 以後續提交引用。
3. handoff 列功能、改動檔案、測試、畫面連結、重現步驟、已知缺陷、NOT_TESTED。
4. git push origin codex/graphics-upgrade，核對遠端 branch SHA 與本地 tip 一致。
5. 回報 AWAITING_REVIEW，提供候選 SHA、交接 commit SHA、PR 和 handoff 連結，**停止**。
6. 不改 PXX-review.md 或自行推進 PHASES，不 merge、不 force-push。
7. 收到 REVISE，僅修當前階段，新增 commit 再交驗收；不得修改 reviewer 原文掩蓋問題。

## 交付回報模板

Phase:
Status: AWAITING_REVIEW / BLOCKED
Candidate code SHA:
Evidence/handoff commit SHA:
Remote branch SHA:
What changed:
Checks actually run:
Screenshots + capture metadata:
Known defects / NOT_TESTED:
Next action: independent reviewer acceptance; no next-phase implementation.

不能承諾「保證不偏離」。你必須以可檢查的範圍、真實證據、固定 SHA 和停止點使偏離可被發現。
