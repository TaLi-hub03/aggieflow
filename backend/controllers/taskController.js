// Start with some dummy tasks for immediate frontend display
let tasks = [
  { id: 1, title: "Setup project", completed: false, assignee: "", description: "" },
  { id: 2, title: "Create backend routes", completed: false, assignee: "", description: "" },
  { id: 3, title: "Connect frontend", completed: true, assignee: "", description: "" }
];

// Get all tasks
const getTasks = (req, res) => {
  res.json(tasks);
};

// Add a new task
const addTask = (req, res, io) => {  // io will be used for real-time
  const { title, description, assignee } = req.body;
  if (!title) return res.status(400).send("Task title is required");

  const newTask = { id: tasks.length + 1, title, completed: false, description: description || "", assignee: assignee || "" };
  tasks.push(newTask);

  // Emit to OTHER clients only (not the sender) to avoid double entries
  if (io) io.emit("taskAdded", newTask);

  res.status(201).json(newTask);
};

// Update a task (partial update: title/description/assignee/completed)
const updateTask = (req, res, io) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id == id);
  if (!task) return res.status(404).send("Task not found");

  const { title, description, assignee, completed } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (assignee !== undefined) task.assignee = assignee;
  if (completed !== undefined) task.completed = !!completed;

  // Emit to all clients
  if (io) io.emit("taskUpdated", task);

  res.json(task);
};

// Delete a task
const deleteTask = (req, res, io) => {
  const { id } = req.params;
  const idx = tasks.findIndex(t => t.id == id);
  if (idx === -1) return res.status(404).send("Task not found");
  const removed = tasks.splice(idx, 1)[0];
  if (io) io.emit("taskDeleted", removed);
  res.json({ success: true, id });
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
