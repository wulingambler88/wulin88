# P00 流程交接

日期：2026-09-10。狀態：AWAITING_REVIEW。
基準程式 SHA：81f4c9871190abc078c26b050884f26a70da09bb。
遠端：https://github.com/wulingambler88/wulin88。

本階段僅準備 Git、設計文件、目標參考圖、階段及驗收規則、PR 模板；沒有修改遊戲程式。
規劃候選 commit 是包含此文件的 codex/review-workflow 提交，可用 git rev-parse origin/codex/review-workflow 取得完整 SHA；reviewer 必須把解析出的 SHA 寫入驗收報告。

已檢查：本地初始提交、未追蹤檔案、檔案大小、常見憑證模式、main 遠端 SHA。
遊戲運行／測試：本次 NOT_TESTED，P00 不改程式；歷史綠燈不代表 P01 PASS。
Branch protection、必要 CI checks：未設定。PR 模板不能強制禁止自行批准。

Reviewer 檢查完整文件及參考圖可从遠端取得、branch SHA 一致、可修改範圍及停止規則清楚後，另寫 P00-review.md。
只有 P00 PASS 才可開始 P01。下一步請使用 REVIEWER_PROMPT.md，在獨立驗收任務審查。
