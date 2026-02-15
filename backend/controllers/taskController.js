let tasks = []; // temporary storage for demo

const getTasks = (req, res) => res.json(tasks);

const createTask = (req, res) => {
  const task = { id: tasks.length + 1, ...req.body };
  tasks.push(task);
  res.status(201).json(task);
};

const updateTask = (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) return res.status(404).send("Task not found");
  Object.assign(task, req.body);
  res.json(task);
};

module.exports = { getTasks, createTask, updateTask };
