# Task Manager Application

This Task Manager application provides a way to manage tasks via a web interface. It supports both **server-side mode** and **client-only mode**, allowing flexibility in how the application is deployed and used.

---

## Features

1. **CRUD Operations**:
   - Create, Read, Update, and Delete tasks through a simple web interface.
   - Tasks are stored in a `tasks.json` file on the server in server-side mode.

2. **Modes**:
   - **Server-Side Mode**: The application is hosted on a Node.js server with an Express-based REST API.
   - **Client-Only Mode**: The application runs directly from the `TaskManage.html` file, fetching tasks from the server via AJAX requests.

3. **Validation**:
   - Required fields (Title, Description, Assigned To, Due Date) are validated before submission.

4.	**Features**:
	•	All tasks are stored in tasks.json on the server.
	•	Supports task management via REST API endpoints:
	•	GET /api/tasks - Retrieve all tasks.
	•	GET /api/tasks/:id - Retrieve a single task by ID.
	•	POST /api/tasks - Create a new task.
	•	PUT /api/tasks/:id - Update an existing task by ID.
	•	DELETE /api/tasks/:id - Delete a task by ID.   

---

## Setup Instructions

### Prerequisites

- Node.js installed on your system.
- A web browser (e.g., Chrome, Firefox).

---

### 1. Server-Side Mode

In this mode, the application is served via a Node.js server. The server hosts both the frontend (HTML, CSS, JavaScript) and a REST API for managing tasks.

#### Steps:

1. Clone the Repository
    •	git clone <git@github.com:jianglei919/task_manager.git>
    •	cd <server>

2. Install Dependencies
    •	npm install

3. Start the Server
    •	npm start

4. Access the Application
    •	Open your browser and navigate to: http://localhost:3000


### 2. Client-Side Mode

In this mode, the application runs directly from the TaskManage.html file. Tasks are still fetched and updated on the server via AJAX requests, but no server is required to host the frontend.

#### Steps:

1. Locate the Files
    •	Open the TaskManage.html file in a web browser.
2. Ensure Server is Running
    •	Start the server by following the instructions in the Server-Side Mode section.
3. Access the Application
    •	The application will load in your browser.
    •	Tasks will be fetched from the server and managed through the REST API.

├── server.js           # Node.js server with REST API
├── tasks.json          # File for storing tasks (server-side mode)
├── TaskManage.html     # Main HTML file
├── script.js           # Client-side JavaScript
├── styles.css          # Application styling
├── package.json        # Node.js dependencies
└── README.md           # Documentation

   