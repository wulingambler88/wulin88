# P00 流程交接

日期：2026-09-10。狀態：AWAITING_REVIEW。
基準程式 SHA：81f4c9871190abc078c26b050884f26a70da09bb。
遠端：https://github.com/wulingambler88/wulin88。

本階段僅準備 Git、設計文件、目標參考圖、階段及驗收規則、PR 模板；沒有修改遊戲程式。
本次複驗候選完整 SHA：f128a137fb24d973be8ed98235276ea07134c338。
本 handoff 是候選提交之後的純交接文件 commit。Reviewer 固定驗收上述 SHA，並讀取本 handoff；不得以移動中的 branch tip 代替候選。施工 branch：codex/graphics-upgrade。
原候選 8222a29c259906d711436469e7fade73c13ed3b5 的 REVISE 紀錄保留在 P00-review.md。新候選修正 P00 適用範圍、各階段證據/測試路徑；本文件補齊固定 SHA。尚待独立複驗，不代表 PASS。

已檢查：本地初始提交、未追蹤檔案、檔案大小、常見憑證模式、main 遠端 SHA。
額外基準檢查（2026-09-10）：check、lint、87 tests、build 通過。遊戲操作及視覺驗收：P00 為 NOT_APPLICABLE；不代表 P01 PASS。
Branch protection、必要 CI checks：未設定。PR 模板不能強制禁止自行批准。

Reviewer 檢查完整文件及參考圖可从遠端取得、branch SHA 一致、可修改範圍及停止規則清楚後，另寫 P00-review.md。
只有 P00 PASS 才可開始 P01。下一步請使用 REVIEWER_PROMPT.md，在獨立驗收任務審查。
