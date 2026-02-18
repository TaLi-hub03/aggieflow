const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// We will attach io from server.js for real-time events
let io;
router.setSocketIO = (socketIO) => { io = socketIO; };

// GET all tasks
router.get("/", (req, res) => taskController.getTasks(req, res));

// POST new task
router.post("/", (req, res) => taskController.addTask(req, res, io));

// PATCH / update task
// PUT / update task (partial update)
router.put("/:id", (req, res) => taskController.updateTask(req, res, io));

// DELETE task
router.delete("/:id", (req, res) => taskController.deleteTask(req, res, io));

module.exports = router;
