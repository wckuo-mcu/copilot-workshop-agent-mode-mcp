const storageKey = "offline-todo-list";
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeLabel = document.querySelector(".theme-label");
const filterButtons = document.querySelectorAll("[data-filter]");
const themeStorageKey = "offline-todo-theme";
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

let todos = loadTodos();
let currentFilter = "all";

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

// 套用主題並同步切換按鈕的圖示、文字與無障礙標籤。
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeLabel.textContent = isDark ? "淺色模式" : "深色模式";
  themeToggle.setAttribute("aria-label", isDark ? "切換至淺色模式" : "切換至深色模式");
}

// 沒有手動偏好時，使用作業系統的深淺色設定。
function loadTheme() {
  return localStorage.getItem(themeStorageKey) || (systemTheme.matches ? "dark" : "light");
}

function getVisibleTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }
  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }
  return todos;
}

function getEmptyMessage() {
  if (currentFilter === "active") {
    return todos.length > 0
      ? "目前沒有未完成的待辦事項；其他項目可能被目前的篩選條件隱藏。"
      : "目前沒有未完成的待辦事項。";
  }
  if (currentFilter === "completed") {
    return todos.length > 0
      ? "目前沒有已完成的待辦事項；其他項目可能被目前的篩選條件隱藏。"
      : "目前沒有已完成的待辦事項。";
  }
  return "還沒有任何待辦事項,新增一個吧!";
}

// 根據目前資料重新繪製清單與統計資訊。
function renderTodos() {
  todoList.replaceChildren();
  const visibleTodos = getVisibleTodos();
  emptyState.hidden = visibleTodos.length > 0;
  emptyState.textContent = getEmptyMessage();

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

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(themeStorageKey, nextTheme);
  applyTheme(nextTheme);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      filterButton.classList.toggle("active", filterButton === button);
      filterButton.setAttribute("aria-pressed", filterButton === button ? "true" : "false");
    });
    renderTodos();
  });
});

if (!localStorage.getItem(themeStorageKey)) {
  systemTheme.addEventListener("change", (event) => {
    if (!localStorage.getItem(themeStorageKey)) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });
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

applyTheme(loadTheme());
filterButtons[0].setAttribute("aria-pressed", "true");
renderTodos();