const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Serve static files (TaskManage.html, script.js, styles.css, etc.)
app.use(express.static(path.join(__dirname)));

// JSON file for storing tasks
const TASK_FILE = 'tasks.json';

const readTasks = () => {
    if (!fs.existsSync(TASK_FILE)) return [];
    const data = fs.readFileSync(TASK_FILE, 'utf8');
    return JSON.parse(data || '[]');
};

const writeTasks = (tasks) => {
    fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
};

// Routes
app.get('/api/tasks', (req, res) => {
    console.log('get /api/tasks starting...');
    const tasks = readTasks();
    res.json(tasks);
});

app.get('/api/tasks/:id', (req, res) => {
    console.log('get /api/tasks/' + req.params.id + ' starting...');
    const tasks = readTasks();
    const task = tasks.find((t) => t.id === parseInt(req.params.id));
    task ? res.json(task) : res.status(404).json({ error: 'Task not found' });
});

app.post('/api/tasks', (req, res) => {
    console.log('post /api/tasks starting...');
    const tasks = readTasks();
    const newTask = { id: Date.now(), ...req.body };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    console.log('put /api/tasks/' + req.params.id + ' starting...');
    const tasks = readTasks();
    const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...req.body };
        writeTasks(tasks);
        res.json(tasks[index]);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.delete('/api/tasks/:id', (req, res) => {
    console.log('delete /api/tasks/' + req.params.id + ' starting...');
    const tasks = readTasks();
    const filteredTasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
    if (filteredTasks.length !== tasks.length) {
        writeTasks(filteredTasks);
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Default route to serve TaskManage.html
app.get('/', (req, res) => {
    console.log('get home page starting...');
    res.sendFile(path.join(__dirname, 'TaskManage.html'));
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));