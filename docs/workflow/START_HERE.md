# 從這裡開始

日期：2026-09-10。專案：Qian Hui Avatar City。
本次是建立 GitHub 分階段施工流程；不代表上一版美術已驗收通過。

## 現況

- 原有遊戲已保存在 main 基準 commit：81f4c9871190abc078c26b050884f26a70da09bb。
- 文件準備 branch：codex/review-workflow。
- 施工 branch 規劃：codex/graphics-upgrade，從文件準備版本建立。
- GitHub 連接帳號：wulingambler88。
- 使用者指定遠端：https://github.com/wulingambler88/wulin88.git。
- main 已 push，遠端 SHA 與基準一致。repository 可見性沿用使用者建立的設定，未更改。
- 本機 commit 作者設為 Codex（僅此 repo），沒有冒用使用者身份。
- 文件及後續程式先留在 branch；全部階段通過前不合併 main。

## 文件順序

1. DESIGN.md：目標及已知落差。
2. PHASES.md：每階段工作、路徑、證據與停止點。
3. ACCEPTANCE.md：實際驗收方法。
4. BUILDER_PROMPT.md：交給施工模型。
5. REVIEWER_PROMPT.md：交給規劃／驗收模型。

舊根目錄報告和 screenshots/_audit 保留作歷史證據，不視為目前版本的 PASS。

## 遠端與施工交接

origin 已設定為使用者指定 repository，main 已上傳。
codex/review-workflow 保存本次規劃。codex/graphics-upgrade 從該規劃版本建立，等待 P00 驗收。
以 codex/graphics-upgrade 向 main 開 draft PR；逐階段更新 handoff 和驗收紀錄。
每個 phase 在同一施工 branch 追加 commit；reviewer 的驗收紀錄也追加 commit。
最後合併前重新跑整體驗收，交給使用者批准。

Branch protection 尚未設定。若帳號方案允許，要求 PR、必要 checks、禁止 force push、stale review dismissal。
規則文件及 PR 模板是協作約定，不是已啟用的伺服器保護。

## 本機檢查

使用專案的 portable Node 路徑，或將它加入目前 terminal PATH：
C:\Users\P3761\Documents\node-v24.20.0-win-x64

執行 npm run check、npm run lint、npm test、npm run build。
啟動 run.bat 後使用輸出的網址；不要靠清除使用者存檔展示成果。
