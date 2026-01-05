// Données
let tasks = []; // tableau des tâches
let currentFilter = "all"; // "all" | "active" | "done"

// DOM
const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const counter = document.querySelector("#counter");

const filterBtns = document.querySelectorAll(".filter-btn");
const clearDoneBtn = document.querySelector("#clearDoneBtn");
const clearAllBtn = document.querySelector("#clearAllBtn");

// LocalStorage
const STORAGE_KEY = "todo_smart_tasks_v1";

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function load() {
  try {
    tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    tasks = [];
  }
}

function getVisibleTasks() {
  if (currentFilter === "all") {
    return tasks;
  } else if (currentFilter === "active") {
    return tasks.filter((task) => !task.done);
  } else if (currentFilter === "done") {
    return tasks.filter((task) => task.done);
  }
  return tasks;
}

function updateCounter() {
  const activeTasks = tasks.filter((task) => !task.done).length;
  counter.textContent = `${activeTasks} restantes`;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "item" + (task.done ? " done" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const textSpan = document.createElement("span");
  textSpan.className = "text";
  textSpan.textContent = task.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-btn";
  deleteBtn.textContent = "Supprimer";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(deleteBtn);

  return li;
}

function render() {
  taskList.innerHTML = "";
  const visibleTasks = getVisibleTasks();
  visibleTasks.forEach((task) => {
    taskList.appendChild(createTaskElement(task));
  });
  updateCounter();
}

function addTask(text) {
  const trimmedText = text.trim();
  if (trimmedText === "") return;
  const task = {
    id: Date.now().toString(),
    text: trimmedText,
    done: false,
  };
  tasks.push(task);
  save();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.done = !task.done;
    save();
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  save();
  render();
}

function setActiveFilterButton(activeBtn) {
  filterBtns.forEach((btn) => btn.classList.remove("is-active"));
  activeBtn.classList.add("is-active");
}

// Events
addBtn.addEventListener("click", () => {
  addTask(taskInput.value);
  taskInput.value = "";
  taskInput.focus();
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(taskInput.value);
    taskInput.value = "";
    taskInput.focus();
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    setActiveFilterButton(btn);
    render();
  });
});

clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
});

clearAllBtn.addEventListener("click", () => {
  tasks = [];
  save();
  render();
});

// Init
load();
render();
