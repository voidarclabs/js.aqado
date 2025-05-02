const express = require("express");
const app = express();
const path = require("path");
const socketio = require("socket.io");

// Serve the index.html file when the root path is requested
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve static files from the public directory
app.use(express.static("public"));

// Start the server
const server = app.listen(9000, () => {
  console.log("Server listening on port 9000");
});

// declare websocket server
const io = socketio(server);

const functions = {
  test: { func: test },
};

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("clientUpdate", (data) => {
    if (functions[data[0]]) {
      functions[data[0]].func(data[1]);
    }
  });
});
