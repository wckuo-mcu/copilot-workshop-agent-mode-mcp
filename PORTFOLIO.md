# 待辦清單 Web App

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App。它提供簡潔的待辦事項管理功能，並支援主題切換、篩選與瀏覽器端資料保存。

## 線上展示

[GitHub Pages](https://<你的帳號>.github.io/<你的repo名稱>/)

> 請將上方網址替換成實際的 GitHub Pages 網址。

## 功能

- 新增待辦事項，空白內容不會被加入。
- 勾選或取消勾選待辦事項，已完成項目會顯示刪除線並淡化。
- 刪除單筆待辦事項。
- 清除所有已完成事項，並在清除前顯示確認對話框。
- 沒有已完成事項時，清除按鈕會停用。
- 顯示整體清單的未完成項目數量。
- 清單為空或篩選結果為空時，顯示對應提示文字。
- 依「全部」、「未完成」或「已完成」篩選待辦事項。
- 在淺色模式與深色模式之間切換。
- 未手動設定主題時，跟隨作業系統的深淺色偏好。
- 記住使用者的主題選擇與待辦資料，重新整理後仍可保留。
- 支援手機螢幕的響應式版面。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript 開發。
- 不使用框架、外部套件或外部 CDN。
- 使用 CSS 變數管理主題色彩。
- 使用 `localStorage` 保存待辦資料與主題偏好。
- 使用 `textContent` 與 `createElement` 建立 DOM 內容。

## 開發方式

這個專案是在 GitHub Copilot 實戰工作坊中，透過 GitHub Copilot Agent Mode 逐步完成。Agent Mode 協助依照需求建立前端檔案、加入互動功能，並在修改後進行驗證。

專案也使用 MCP 連接 Microsoft Learn 文件與 GitHub 資訊，讓開發過程可以查閱官方文件、檢查 CSS 深色模式與無障礙色彩對比，並讀取 GitHub issue 的需求。

此外，`.github/prompts/fix-issue.prompt.md` 將「讀取 issue、提出計畫、建立分支、修改、驗證、提交與建立 Pull Request」整理成可重複使用的 agentic workflow，讓 issue 處理流程更加一致。

## 我學到什麼

- 如何使用 Agent Mode 將自然語言需求轉換成可運作的前端功能。
- 如何使用 MCP 查詢官方文件與 GitHub repository 資訊。
- 如何透過 `localStorage` 保存瀏覽器端的資料與使用者偏好。
- 如何設計篩選、深色模式與空狀態提示，讓操作結果更清楚。
- 如何把 issue 修正流程整理成可重複執行的 prompt workflow。
