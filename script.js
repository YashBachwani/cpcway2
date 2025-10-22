// Todo List App JavaScript
class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.initializeElements();
        this.bindEvents();
        this.initializeTheme();
        this.render();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.taskCount = document.getElementById('taskCount');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.themeToggle = document.getElementById('themeToggle');
        this.emptyState = document.getElementById('emptyState');
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
    }

    toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.tasks.unshift(task); // Add to beginning for most recent first
        this.taskInput.value = '';
        this.saveAndRender();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveAndRender();
        }
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim()) {
            task.text = newText.trim();
            this.saveAndRender();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveAndRender();
    }

    clearCompletedTasks() {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveAndRender();
    }

    saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.render();
    }

    render() {
        this.taskList.innerHTML = '';
        
        if (this.tasks.length === 0) {
            this.emptyState.classList.remove('hidden');
            this.taskCount.textContent = '';
            return;
        }

        this.emptyState.classList.add('hidden');
        
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';
            
            li.innerHTML = `
                <div class="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        ${task.completed ? 'checked' : ''} 
                        class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        onchange="app.toggleTask(${task.id})"
                    >
                    <div class="flex-1 min-w-0">
                        <p class="text-gray-900 dark:text-white ${task.completed ? 'line-through opacity-60' : ''} break-words">
                            ${this.escapeHtml(task.text)}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            ${task.createdAt}
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <button 
                            onclick="app.editTask(${task.id})" 
                            class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                            title="Edit task"
                        >
                            ✏️
                        </button>
                        <button 
                            onclick="app.deleteTask(${task.id})" 
                            class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Delete task"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            `;
            
            this.taskList.appendChild(li);
        });

        this.updateTaskCount();
    }

    updateTaskCount() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        this.taskCount.textContent = `${pending} pending, ${completed} completed`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
const app = new TodoApp();