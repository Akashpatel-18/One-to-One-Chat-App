const express = require("express");
const app = express();
const dotenv = require("dotenv");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

dotenv.config();
const port = process.env.PORT || 5000;

app.use(express.json());

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
  });

  socket.on("sendMessage", (message) => {
    io.in(message.roomName).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});
