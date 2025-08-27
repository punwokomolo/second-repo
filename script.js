// Task Manager using Sets and Maps

let tasks = new Map(); // key: id, value: { name, category, completed }
let categories = new Set();
let taskId = 0;

// Load tasks and categories from localStorage
function loadFromStorage() {
    const tasksData = localStorage.getItem('tasks');
    const categoriesData = localStorage.getItem('categories');
    const idData = localStorage.getItem('taskId');
    if (tasksData) {
        const obj = JSON.parse(tasksData);
        tasks = new Map(Object.entries(obj).map(([id, val]) => [Number(id), val]));
    }
    if (categoriesData) {
        categories = new Set(JSON.parse(categoriesData));
    }
    if (idData) {
        taskId = Number(idData);
    }
}

function saveToStorage() {
    const obj = Object.fromEntries(tasks.entries());
    localStorage.setItem('tasks', JSON.stringify(obj));
    localStorage.setItem('categories', JSON.stringify(Array.from(categories)));
    localStorage.setItem('taskId', String(taskId));
}

function renderTasks() {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;
    taskList.innerHTML = '';
    for (const [id, task] of tasks.entries()) {
        if (!task.completed) {
            const group = document.createElement('div');
            group.className = 'input-group';
            const input = document.createElement('input');
            input.type = 'text';
            input.value = `${task.name} (${task.category})`;
            input.readOnly = true;
            group.appendChild(input);
            const btnGroup = document.createElement('div');
            btnGroup.className = 'button-group';
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.textContent = 'Delete';
            delBtn.onclick = () => deleteTask(id);
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => editTask(id);
            btnGroup.appendChild(delBtn);
            btnGroup.appendChild(editBtn);
            group.appendChild(btnGroup);
            taskList.appendChild(group);
        }
    }
    saveToStorage();
}

function renderCompleted() {
    const sub2 = document.querySelector('.sub2');
    if (!sub2) return;
    const completedDiv = sub2.querySelector('h3').nextElementSibling;
    if (!completedDiv) return;
    completedDiv.innerHTML = '';
    let hasCompleted = false;
    for (const [id, task] of tasks.entries()) {
        if (task.completed) {
            hasCompleted = true;
            const group = document.createElement('div');
            group.className = 'input-group';
            const input = document.createElement('input');
            input.type = 'text';
            input.value = `${task.name} (${task.category})`;
            input.readOnly = true;
            group.appendChild(input);
            const btnGroup = document.createElement('div');
            btnGroup.className = 'button-group';
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.textContent = 'Delete';
            delBtn.onclick = () => {
                deleteTask(id);
            };
            const undoBtn = document.createElement('button');
            undoBtn.className = 'edit-btn';
            undoBtn.textContent = 'Undo';
            undoBtn.onclick = () => {
                tasks.set(id, { ...task, completed: false });
                saveToStorage();
                renderTasks();
                renderCompleted();
            };
            btnGroup.appendChild(delBtn);
            btnGroup.appendChild(undoBtn);
            group.appendChild(btnGroup);
            completedDiv.appendChild(group);
        }
    }
    if (!hasCompleted) {
        completedDiv.innerHTML = '<div>No completed tasks</div>';
    }
    saveToStorage();
}

function creatTask() {
    const name = document.getElementById('input-task').value.trim();
    const category = document.getElementById('categoryinput').value.trim();
    if (!name || !category) return alert('Enter both task and category');
    tasks.set(++taskId, { name, category, completed: false });
    categories.add(category);
    saveToStorage();
    renderTasks();
    renderCompleted();
    reset();
}

function reset() {
    document.getElementById('input-task').value = '';
    document.getElementById('categoryinput').value = '';
}

function deleteTask(id) {
    tasks.delete(id);
    saveToStorage();
    renderTasks();
    renderCompleted();
}

function editTask(id) {
    const task = tasks.get(id);
    if (!task) return;
    const newName = prompt('Edit task name:', task.name);
    const newCategory = prompt('Edit category:', task.category);
    if (newName && newCategory) {
        tasks.set(id, { ...task, name: newName, category: newCategory });
        categories.add(newCategory);
        saveToStorage();
        renderTasks();
        renderCompleted();
    }
}

function completeTask(id) {
    const task = tasks.get(id);
    if (task) {
        tasks.set(id, { ...task, completed: true });
        saveToStorage();
        renderTasks();
        renderCompleted();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    renderTasks();
    renderCompleted();
    // Complete button for marking first incomplete task as complete
    const sub2Btns = document.querySelector('.sub2 .button-group');
    if (sub2Btns) {
        sub2Btns.querySelector('.complete-btn').onclick = () => {
            for (const [id, task] of tasks.entries()) {
                if (!task.completed) {
                    completeTask(id);
                    break;
                }
            }
        };
    }
});