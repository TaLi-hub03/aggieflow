require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Import routes
const taskRoutes = require("./routes/tasks");
const teamRoutes = require("./routes/teams");

app.use("/api/tasks", taskRoutes);
app.use("/api/teams", teamRoutes);

// Real-time updates
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("taskUpdated", (data) => {
    io.emit("taskUpdated", data); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
