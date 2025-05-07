const socket = io();

const functions = {};

socket.emit("handshake");

socket.on("startGameLoop", () => {
  drawScreen();
  socket.on("serverUpdate", (data) => {
    if (functions[data[0]]) {
      functions[data[0]].func(data[1]);
    }
  });
});

function drawScreen() {
  let mainContainer = document.getElementById("mainContainer").innerHTML;
  for (let i = 0; i < 11; i++) {
    console.log(i);
    if (i == 0) {
      console.log("something");
      mainContainer += '<div class="space" id="start">start</div>';
    }
    if (i == 4) {
      mainContainer += '<div class="space" id="safe">safe</div>';
    }
    if (i == 10) {
      mainContainer += '<div class="space" id="end">end</div>';
    }
    if (i != 0 && i != 4 && i != 10) {
      mainContainer += '<div class="space" id="normal"></div>';
    }
  }
}
