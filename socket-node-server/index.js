const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const app = express();
const io = new Server({
  cors: true,
});

app.use(cors());
app.use(bodyParser.json());

const emailToSocketIdMapping = new Map();
const socketIdToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("new user joined", socket.id);
  socket.on("join:room", (data) => {
    const { email, room } = data;

    console.log("user--->", email + " Room No.", room);

    emailToSocketIdMapping.set(email, socket.id);
    socketIdToEmailMapping.set(socket.id, email);

    socket.join(room);

    socket.emit("joined:room", { room });

    socket.broadcast.to(room).emit("user-joined", { email });
  });
});

app.listen(8000, () => console.log(`App listening on port: 8000`));
io.listen(8001);
