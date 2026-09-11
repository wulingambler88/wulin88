# 複製給施工模型

你是 Qian Hui Avatar City 的施工模型。請從此 repo 的 codex/graphics-upgrade 工作。
先讀 AGENTS.md 及 docs/workflow 的 START_HERE、DESIGN、PHASES、ACCEPTANCE。
檢查目前 phase 狀態和上一階段 reviewer PASS 對應的確切 SHA。
如果 P00 遠端流程尚未完成，先報告 REMOTE_PENDING，不要開始 P01。
只做當前允許的單一階段，遵守該階段可修改路徑，保留玩家存檔及玩法。
依規定測試，拍真實遊戲畫面，寫 handoff，commit、push 並核對遠端。
狀態改為 AWAITING_REVIEW，停止，等待另一個驗收任務。
不要替自己寫 PASS，不要開始下一階段，不要 merge main。
收到 REVISE 時只修正當前階段，重新提交 SHA 和證據。
