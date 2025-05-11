const socket = io();

const functions = {
  setSpace: { func: setTokenSpace },
};

socket.emit("handshake");

socket.on("beginGameLoop", () => {
  drawScreen();
  socket.on("serverUpdate", (data) => {
    if (functions[data[0]]) {
      functions[data[0]].func(data[1]);
    }
  });
});

function drawScreen() {
  let mainContainer = document.getElementById("mainContainer");
  for (let i = 0; i < 12; i++) {
    console.log(i);
    if (i == 11) {
      mainContainer.innerHTML += `<div class="space" id="start">Start</div>`;
    } else {
      if (i == 6) {
        mainContainer.innerHTML += `<div class="space" id="safe">Safe</div>`;
      } else {
        if (i == 0) {
          mainContainer.innerHTML += `<div class="space" id="end">End</div>`;
        } else {
          mainContainer.innerHTML += `<div class="space" id="regular"></div>`;
        }
      }
    }
  }
  for (let j = 0; j < 4; j++) {
    let tokenContainer = document.getElementById("tokenContainer");
    tokenContainer.innerHTML += `<div class="token" id="token${j}">${j}</div>`;
  }
}

function setTokenSpace(data) {
  let token = data[0];
  let space = data[1];
  let currentToken = document.getElementById(`token${token}`);
  let pxToMove = space * 61;
  currentToken.style.marginTop = `${pxToMove + 10}px`;
}
