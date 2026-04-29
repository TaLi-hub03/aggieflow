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
  if (io) io.sockets.emit("eventAdded", newEvent);
  res.status(201).json(newEvent);
});

// PUT update event
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { date, title, time, description } = req.body;
  const event = events.find((e) => e.id === parseInt(id));
  if (!event) return res.status(404).send("event not found");
  event.date = date || event.date;
  event.title = title || event.title;
  event.time = time !== undefined ? time : event.time;
  event.description = description !== undefined ? description : event.description;
  if (io) io.sockets.emit("eventUpdated", event);
  res.json(event);
});

// DELETE event
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = events.findIndex((e) => e.id === parseInt(id));
  if (index === -1) return res.status(404).send("event not found");
  const deleted = events.splice(index, 1)[0];
  if (io) io.sockets.emit("eventDeleted", deleted.id);
  res.json(deleted);
});

module.exports = router;
