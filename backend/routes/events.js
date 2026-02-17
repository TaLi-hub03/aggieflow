const express = require("express");
const router = express.Router();

// simple in-memory store for events
// { id, date, title, time, description }
let events = [];
let io;

router.setSocketIO = (socketIO) => { io = socketIO; };

// GET events by date query parameter
router.get("/", (req, res) => {
  const { date } = req.query;
  if (!date) {
    // return all events when no date is specified
    return res.json(events);
  }
  const result = events.filter((e) => e.date === date);
  res.json(result);
});

// POST new event
router.post("/", (req, res) => {
  const { date, title, time, description } = req.body;
  if (!date || !title) return res.status(400).send("date and title required");
  const newEvent = {
    id: Date.now(),
    date,
    title,
    time: time || "",
    description: description || "",
  };
  events.push(newEvent);
  // Emit real-time event to connected clients
  if (io) io.emit("eventAdded", newEvent);
  res.status(201).json(newEvent);
});

module.exports = router;
