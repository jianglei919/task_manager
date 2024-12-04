'use strict';

// Retrieve tasks from localStorage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

let editingTaskId = null;

// Function to add a new task
const addTask = () => {
    const title = $('#taskTitle').val();
    const description = $('#taskDescription').val();
    const assignedTo = $('#taskAssignedTo').val();
    const dueDate = $('#taskDueDate').val();
    const priority = $('#taskPriority').val();
    const status = $('#taskStatus').val();

    if ($('#addTaskButton').text() === 'Edit Task') {
        $('#addTaskButton').text('Add Task');
    }

    // Validate title
    if (!title) {
        $('#taskTitleSpan').text("Please type a title !");
        return;
    } else {
        $('#taskTitleSpan').text("");
    }

    // Validate description
    if (!description) {
        $('#taskDescriptionSpan').text("Please type a description !");
        return;
    } else {
        $('#taskDescriptionSpan').text("");
    }

    // Validate assignedTo
    if (!assignedTo) {
        $('#taskAssignedToSpan').text("Please type a assignedTo !");
        return;
    } else {
        $('#taskAssignedToSpan').text("");
    }

    // Validate dueDate
    if (!dueDate) {
        $('#taskDueDateSpan').text("Please type a dueDate !");
        return;
    } else {
        $('#taskDueDateSpan').text("");
    }

    // If existing a editing task
    if (editingTaskId !== null) {
        const task = tasks.find(t => t.id === editingTaskId);
        task.title = title;
        task.description = description;
        task.assignedTo = assignedTo;
        task.dueDate = dueDate;
        task.priority = priority;
        task.status = status;

        $('#addTaskButton').text('Add Task');
        editingTaskId = null; // repeat editing status
    } else {
        // Create a new task object
        const newTask = {
            id: Date.now(),
            title,
            description,
            assignedTo,
            dueDate,
            priority,
            status
        };

        // Add the new task to the tasks array
        tasks.push(newTask);
        console.log("new task object: " + newTask);
    }

    saveAndRenderTasks();

    clearForm();
};

// Function to edit an existing task
const editTask = (id) => {
    const task = tasks.find(t => t.id === id);
    $('#taskTitle').val(task.title);
    $('#taskDescription').val(task.description);
    $('#taskAssignedTo').val(task.assignedTo);
    $('#taskDueDate').val(task.dueDate);
    $('#taskPriority').val(task.priority);
    $('#taskStatus').val(task.status);

    editingTaskId = id;

    $('#addTaskButton').text('Edit Task');

    renderTasks(tasks.filter(t => t.id !== id));
};

// Function to delete a task
const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRenderTasks();
};

// Function to save tasks to localStorage and render them on the page
const saveAndRenderTasks = () => {
    let taskStrings = JSON.stringify(tasks);
    console.log("saving tasks: " + taskStrings);

    localStorage.setItem('tasks', taskStrings);

    renderTasks(tasks);
};

// Function to filter tasks based on search input
const filterTasks = () => {
    const searchValue = $('#searchInput').val().toLowerCase();
    // Use Array.prototype.filter() to filter tasks
    const filteredTasks = tasks.filter(task => {
        return Object.values(task).some(value =>
            String(value).toLowerCase().includes(searchValue)
        );
    });
    renderTasks(filteredTasks);
};

// Function to render tasks
const renderTasks = (displayedTasks) => {
    const taskList = $('#taskList');
    const tasksContainer = $('#tasksContainer');
    tasksContainer.empty();

    if (displayedTasks.length === 0) {
        taskList.hide();
        return;
    } else {
        taskList.show();
    }

    displayedTasks.forEach(task => {
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

// Function to clear the task form after adding a task
const clearForm = () => {
    $('#taskTitle').val('');
    $('#taskDescription').val('');
    $('#taskAssignedTo').val('');
    $('#taskDueDate').val('');
    $('#taskPriority').val('Low');
    $('#taskStatus').val('Pending');
};

// Initialize the document when ready
$(document).ready(() => {
    // Event listener for adding task
    $('#addTaskButton').on('click', addTask);

    //Event listener for filtering task
    $('#searchInput').on('input', filterTasks);

    // Render tasks on page load
    renderTasks(tasks);
});