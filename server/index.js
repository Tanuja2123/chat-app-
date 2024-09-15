const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = process.env.PORT || 4000;


const users = [{}];

app.use(cors({
  origin: "https://chat-app-c.vercel.app", // You can restrict this to your front-end domain, e.g., 'https://your-frontend.com'
  methods: ["GET", "POST"],
  credentials: true
}));

app.get("/", function (req, res) {
  res.send("Its working");
});
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined with socket ID: ${socket.id}`);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });
    // emit is only visible to you
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat ${users[socket.id]}`,
    });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message, id });
  });

  socket.on("disconnect", () => {
    console.log(`${users[socket.id]} has left`);
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} has left the chat`,
    });
    // delete users[socket.id];
  });
});

server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
