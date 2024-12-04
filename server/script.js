'use strict';

let editingTaskId = null;

// Fetch all tasks from the server
const fetchTasks = async () => {
    const response = await fetch(`/api/tasks`);
    return await response.json();
};

// Function to filter tasks based on search input
const filterTasks = async () => {
    const searchValue = $('#searchInput').val().toLowerCase();
    // Use Array.prototype.filter() to filter tasks
    const tasks = await fetchTasks();
    const filteredTasks = tasks.filter(task => {
        return Object.values(task).some(value =>
            String(value).toLowerCase().includes(searchValue)
        );
    });
    renderTasks(filteredTasks);
};

// Render tasks
const renderTasks = async (displayedTasks) => {
    let tasks = [];
    if (displayedTasks) {
        tasks = displayedTasks;
    } else {
        tasks = await fetchTasks();
    }
    const tasksContainer = $('#tasksContainer');
    tasksContainer.empty();

    if (tasks.length === 0) {
        $('#taskList').hide();
        return;
    } else {
        $('#taskList').show();
    }

    tasks.forEach(task => {
        const taskElement = $(`
            <div class="task">
                <strong>${task.title}</strong><br>
                <small>Description: ${task.description}</small><br>
                <small>Assigned To: ${task.assignedTo}</small><br>
                <small>Due Date: ${task.dueDate}</small><br>
                <small>Priority: ${task.priority}</small><br>
                <small>Status: ${task.status}</small><br>
                <div class="task-actions">
                    <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            </div>
        `);
        tasksContainer.append(taskElement);
    });
};

// Add or update a task
const addTask = async () => {
    const title = $('#taskTitle').val().trim();
    const description = $('#taskDescription').val().trim();
    const assignedTo = $('#taskAssignedTo').val().trim();
    const dueDate = $('#taskDueDate').val().trim();
    const priority = $('#taskPriority').val();
    const status = $('#taskStatus').val();

    // Clear previous validation messages
    $('#taskTitleSpan').text("");
    $('#taskDescriptionSpan').text("");
    $('#taskAssignedToSpan').text("");
    $('#taskDueDateSpan').text("");

    // Validation
    let isValid = true;
    if (!title) {
        $('#taskTitleSpan').text("Title is required.");
        isValid = false;
    }
    if (!description) {
        $('#taskDescriptionSpan').text("Description is required.");
        isValid = false;
    }
    if (!assignedTo) {
        $('#taskAssignedToSpan').text("Assigned To is required.");
        isValid = false;
    }
    if (!dueDate) {
        $('#taskDueDateSpan').text("Due Date is required.");
        isValid = false;
    }

    // Stop execution if validation fails
    if (!isValid) {
        return;
    }

    // Construct the task object
    const task = {
        title,
        description,
        assignedTo,
        dueDate,
        priority,
        status,
    };

    if (editingTaskId) {
        // Update task via API
        await fetch(`/api/tasks/${editingTaskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
        editingTaskId = null;
        $('#addTaskButton').text('Add Task');
    } else {
        // Add new task via API
        await fetch(`/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
    }

    // Clear the form and re-render tasks
    clearForm();
    renderTasks(null);
};

// Delete a task
const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    renderTasks(null);
};

// Edit a task
const editTask = async (id) => {
    const response = await fetch(`/api/tasks/${id}`);
    const task = await response.json();

    $('#taskTitle').val(task.title);
    $('#taskDescription').val(task.description);
    $('#taskAssignedTo').val(task.assignedTo);
    $('#taskDueDate').val(task.dueDate);
    $('#taskPriority').val(task.priority);
    $('#taskStatus').val(task.status);

    editingTaskId = id;
    $('#addTaskButton').text('Edit Task');
};

// Clear the form
const clearForm = () => {
    $('#taskTitle').val('');
    $('#taskDescription').val('');
    $('#taskAssignedTo').val('');
    $('#taskDueDate').val('');
    $('#taskPriority').val('Low');
    $('#taskStatus').val('Pending');

    // Clear validation messages
    $('#taskTitleSpan').text("");
    $('#taskDescriptionSpan').text("");
    $('#taskAssignedToSpan').text("");
    $('#taskDueDateSpan').text("");
};

// Initialize
$(document).ready(() => {
    // Event listener for adding task
    $('#addTaskButton').click(addTask);

    //Event listener for filtering task
    $('#searchInput').on('input', filterTasks);

    // Render tasks on page load
    renderTasks(null);
});