let canvas;
let background;
let keyboard;

const basicBackgroundSound = new Audio('./audio/basic-background-music.mp3');
basicBackgroundSound.loop = true;
basicBackgroundSound.volume = 0.02;

const finalBackgroundSound = new Audio('./audio/final-fight.mp3');

let soundEnabled = true;
let gameStarted = false;

function startGame() {
  const btn = document.getElementById('startGameBtn');
  const intro = document.getElementById('introScreen');

  keyboard = new Keyboard();
  world = new World(canvas, keyboard);
  btn.classList.replace('d-block', 'd-none');
  intro.classList.replace('d-block', 'd-none');
  if (soundEnabled) {
      basicBackgroundSound.play().catch(e => console.log(e));
  }
}

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  window.addEventListener("keydown", (event) => {
    if (!keyboard) return;
    switch (event.key) {
      case "ArrowLeft":
        keyboard.LEFT = true;
        break;
      case "ArrowRight":
        keyboard.RIGHT = true;
        break;
      case " ":
        keyboard.SPACE = true;
        break;
      case "d":
        keyboard.D = true;
        break;
    }
  });

  window.addEventListener("keyup", (event) => {
    if (!keyboard) return;
    switch (event.key) {
      case "ArrowLeft":
        keyboard.LEFT = false;
        break;
      case "ArrowRight":
        keyboard.RIGHT = false;
        break;
      case " ":
        keyboard.SPACE = false;
        break;
      case "d":
        keyboard.D = false;
        break;
    }
  });
}
