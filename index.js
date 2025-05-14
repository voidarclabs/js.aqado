const { on } = require("events");
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
const server = app.listen(4000, () => {
  console.log("Server listening on port 4000");
});

// declare websocket server
const io = socketio(server);

const functions = {
  triggerMove: { func: move },
};

var currentPlayer = 0;
var token1 = 11;
var token2 = 11;
var token3 = 11;
var token4 = 11;

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("handshake", () => {
    socket.emit("beginGameLoop");
    for (let i = 0; i < 4; i++) {
      setSpace(socket, i, 11);
    }
  });

  socket.on("clientUpdate", (data) => {
    if (functions[data[0]]) {
      functions[data[0]].func(data[1], socket);
    }
  });
});

function setSpace(socket, token, space) {
  socket.emit("serverUpdate", ["setSpace", [token, space]]);
}

function dice() {
  return Math.ceil(Math.random() * 4);
}

function move(data, socket) {
  socket.emit("serverUpdate", ["currentPlayer", currentPlayer]);
  let diceRoll = dice();
  socket.emit("diceRoll", diceRoll, (callback) => {
    console.log(currentPlayer);
    if (currentPlayer == 0) {
      if (callback.token > 1) {
        console.log("not one of  ur tokens bozo");
      } else {
        moveToken(callback.token, diceRoll, currentPlayer);
        currentPlayer += 1;
      }
    } else {
      if (callback.token < 2) {
        console.log("not one of ur tokens bozo");
      } else {
        moveToken(callback.token, diceRoll, currentPlayer);
        currentPlayer = 0;
      }
    }
  });
}

function moveToken(token, move, player) {
  if (player == 0) {
    if (move == 1) {
      socket.emit("serverUpdate", ["tokenMove", [token, move]]);
    }
  }
}
