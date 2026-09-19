const storageKey = "offline-todo-list";
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const themeToggle = document.querySelector("#theme-toggle");
const filterButtons = document.querySelectorAll("[data-filter]");

let todos = loadTodos();
let currentFilter = "all";
const themeStorageKey = "offline-todo-theme";
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

// 從 localStorage 讀取待辦資料，資料損壞時回傳空清單。
function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch {
    return [];
  }
}

// 儲存目前清單，讓重新整理後仍能保留資料。
function saveTodos() {
  localStorage.setItem(storageKey, JSON.stringify(todos));
}

// 取得使用者的主題偏好，沒有手動設定時就使用作業系統偏好。
function getPreferredTheme() {
  return localStorage.getItem(themeStorageKey) || (systemThemeQuery.matches ? "dark" : "light");
}

// 套用主題並更新切換按鈕的圖示與文字。
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.textContent = isDark ? "☀️ 淺色模式" : "🌙 深色模式";
  themeToggle.setAttribute("aria-label", isDark ? "切換至淺色模式" : "切換至深色模式");
}

// 依目前篩選條件取得要顯示的項目。
function getVisibleTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }
  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }
  return todos;
}

// 根據目前資料重新繪製清單與統計資訊。
function renderTodos() {
  todoList.replaceChildren();
  const visibleTodos = getVisibleTodos();
  emptyState.hidden = visibleTodos.length > 0;
  emptyState.textContent = visibleTodos.length > 0
    ? ""
    : currentFilter === "all"
      ? "還沒有任何待辦事項,新增一個吧!"
      : currentFilter === "active"
        ? "太棒了!目前沒有未完成事項。"
        : "目前還沒有已完成的事項。";

  visibleTodos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = "todo-item";
    item.classList.toggle("completed", todo.completed);

    const checkbox = document.createElement("input");
    checkbox.className = "todo-check";
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `完成「${todo.text}」`);
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "刪除";
    deleteButton.setAttribute("aria-label", `刪除「${todo.text}」`);
    deleteButton.addEventListener("click", () => {
      todos = todos.filter((itemToDelete) => itemToDelete.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    item.append(checkbox, text, deleteButton);
    todoList.append(item);
  });

  const unfinishedCount = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${unfinishedCount} 項`;
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();

  if (!text) {
    todoInput.focus();
    return;
  }

  todos.push({
    id: Date.now(),
    text,
    completed: false,
  });
  saveTodos();
  todoInput.value = "";
  todoInput.focus();
  renderTodos();
});

clearCompletedButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(themeStorageKey, nextTheme);
  applyTheme(nextTheme);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderTodos();
  });
});

// 使用者尚未手動選擇主題時，作業系統切換也會同步更新頁面。
systemThemeQuery.addEventListener("change", () => {
  if (!localStorage.getItem(themeStorageKey)) {
    applyTheme(getPreferredTheme());
  }
});

applyTheme(getPreferredTheme());
renderTodos();