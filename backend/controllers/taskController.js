// Start with some dummy tasks for immediate frontend display
let tasks = [
  { id: 1, title: "Setup project", completed: false },
  { id: 2, title: "Create backend routes", completed: false },
  { id: 3, title: "Connect frontend", completed: true }
];

// Get all tasks
const getTasks = (req, res) => {
  res.json(tasks);
};

// Add a new task
const addTask = (req, res, io) => {  // io will be used for real-time
  const { title } = req.body;
  if (!title) return res.status(400).send("Task title is required");

  const newTask = { id: tasks.length + 1, title, completed: false };
  tasks.push(newTask);

  // Emit real-time event to all clients
  if (io) io.emit("taskAdded", newTask);

  res.status(201).json(newTask);
};

// Update a task (toggle completed)
const updateTask = (req, res, io) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id == id);
  if (!task) return res.status(404).send("Task not found");

  task.completed = !task.completed;

  // Emit real-time update
  if (io) io.emit("taskUpdated", task);

  res.json(task);
};

module.exports = { getTasks, addTask, updateTask };
