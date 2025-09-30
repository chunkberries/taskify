const taskForm = document.getElementById('task-form');
const taskListEl = document.getElementById('task-list');
const sortDateBtn = document.getElementById('sort-date');
const sortPriorityBtn = document.getElementById('sort-priority');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function generateTaskHTML(task, index) {
  const taskEl = document.createElement('li');
  taskEl.className = 'task';
  // Set border color based on priority
  switch (task.priority) {
    case 'High':
      taskEl.style.borderLeftColor = '#e53935'; // red
      break;
    case 'Normal':
      taskEl.style.borderLeftColor = '#ffb300'; // orange
      break;
    case 'Low':
      taskEl.style.borderLeftColor = '#43a047'; // green
      break;
  }

  taskEl.innerHTML = `
    <div class="task-details">
      <div class="task-title">${task.title}</div>
      ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
      <div class="task-meta">
        <div>Due: ${task.deadline}</div>
        <div>Priority: ${task.priority}</div>
      </div>
    </div>
    <div class="task-actions">
      <button title="Complete" onclick="completeTask(${index})">&check;</button>
      <button title="Delete" onclick="deleteTask(${index})">&times;</button>
    </div>
  `;
  return taskEl;
}

function renderTasks() {
  taskListEl.innerHTML = '';
  tasks.forEach((task, index) => {
    const taskEl = generateTaskHTML(task, index);
    if (task.completed) {
      taskEl.style.opacity = '0.6';
      taskEl.style.textDecoration = 'line-through';
    }
    taskListEl.appendChild(taskEl);
  });
}

function addTask(e) {
  e.preventDefault();
  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-desc').value.trim();
  const priority = document.getElementById('task-priority').value;
  const deadline = document.getElementById('task-deadline').value;

  if (!title || !priority || !deadline) {
    alert('Please fill out all required fields.');
    return;
  }

  const newTask = {
    title,
    description,
    priority,
    deadline,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function completeTask(index) {
  tasks[index].completed = true;
  saveTasks();
  renderTasks();
}

document.getElementById('task-form').addEventListener('submit', addTask);

sortDateBtn.addEventListener('click', () => {
  tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  renderTasks();
});

sortPriorityBtn.addEventListener('click', () => {
  const priorityOrder = { 'High': 1, 'Normal': 2, 'Low': 3 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  renderTasks();
});

// Initial render
renderTasks();
