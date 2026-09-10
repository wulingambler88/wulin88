# 施工階段與狀態

目前 P00：PASS（候選 SHA：f128a137fb24d973be8ed98235276ea07134c338）。P01：PASS（候選 SHA：9c91519a067966c253981939f5ff65a8c1495da6）。P02：IN_PROGRESS（已獲授權開工）。P03–P05：NOT_STARTED。
任何歷史完成報告都不會自動改變此表。

| 階段 | 工作及可修改範圍                                                                                                                                           | 必交證據                                                  | 通過條件                                                              |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| P00  | 本地基準、docs/workflow、AGENTS.md、GitHub repository/branches                                                                                             | commit、remote URL、push SHA                              | 遠端可讀且 SHA 一致；流程文件可取得                                   |
| P01  | 角色標準與渲染：src/characters、src/ui/CharacterCreatorModal.ts、src/theme、src/scenes/PreloadScene.ts、public/art/characters；main.ts 僅角色預覽/肖像事件 | 預設及舊存檔；5 種髮型、全部顏色；站/坐/睡/反應；換裝前後 | 不吞掉玩家選項、不因服裝改變身份；姿勢/alpha 正確；品牌與玩家身份清楚 |
| P02  | 城鎮構圖：TownScene.ts、data/locations.ts、WorldHUD.ts、world-style.css、城鎮 art                                                                          | 三種桌面尺寸、九個入口、日夕夜                            | 九個店名完整；主角清晰；HUD 無遮擋；導航仍有效                        |
| P03  | 室內：Home/ClothingShop/Supermarket/PetShop/Park/Cafe/Salon/ToyShop/School scenes、對應室內 art                                                            | 三個 home 房間及八個場所；每處至少一個互動                | 比例、接地、前後關係一致；無外觀建築塞進室內；玩家可見                |
| P04  | 換裝/商品 UI：src/ui、style.css、world-style.css；main.ts 僅面板呈現                                                                                       | creator、wardrobe 所有分類、商店首尾列、空/非空 basket    | 完整文字及實際圖示；即時預覽；可完成購買和取消；不破坏存檔            |
| P05  | 整體驗收：tests、scripts、screenshots/phases、docs/workflow/reviews；回歸修正限已有範圍                                                                    | 全尺寸、全場所、舊存檔、最終測試結果                      | 所有階段 PASS；無未解決重大問題；提交使用者批准 merge                 |

P01 開工前先取得 P00 reviewer PASS。每階段只做當前列。遇到路徑外必要變更，先交 planner 調整任務；不得自行擴大範圍。

每階段另允許寫入自己的 screenshots/phases/PXX/、docs/workflow/reviews/PXX-handoff.md，以及僅驗證該階段改動的 tests/ 和 scripts/ 檔案。這項共同允許不授權修改其他階段、通用契約或無關測試。Reviewer 才可寫 PXX-review.md 並更新 PHASES 的階段通過及下一階段授權；Builder 僅在自己的 handoff 記錄 AWAITING_REVIEW。

## 每階段交付

1. 完成當前階段，跑相應檢查，拍 before/after 真實畫面。
2. 存至 screenshots/phases/PXX/，附 capture.json：viewport、URL、時間、存檔情境、步驟、程式 SHA。
3. commit 程式與證據，取得 full SHA。
4. 寫 docs/workflow/reviews/PXX-handoff.md，列 reviewed-candidate SHA、改動、驗證、缺陷、重現方式，再追加文件 commit。
5. push 並核對遠端 tip；狀態 AWAITING_REVIEW，停止。
6. Reviewer 對候選程式 SHA 出 PASS 或 REVISE；REVISE 保持同階段，修正後新 SHA 重新驗收。

自動測試通過不是美術 PASS。未測試項目必須寫 NOT_TESTED。
