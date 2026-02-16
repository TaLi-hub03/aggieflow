require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());

// Test root
app.get("/", (req, res) => res.send("🚀 AggieFlow Backend Running"));

// Routes
const taskRoutes = require("./routes/tasks");
const teamRoutes = require("./routes/teams");

// Pass io for real-time events
taskRoutes.setSocketIO(io);

app.use("/api/tasks", taskRoutes);
app.use("/api/teams", teamRoutes);

// Socket.IO connection logging
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
