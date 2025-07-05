let canvas;
let background;
let keyboard;

let hasSpotedCharacter = false;
let hasEndbossAlerted = false;
let gameIsOver = false;
let playerIsDead = false;
let endbossIsDead = false;

let playerAnimationPlayed = false;
let bossAnimationPlayed = false;

const basicBackgroundSound = new Audio("./audio/basic-background-music.mp3");
basicBackgroundSound.loop = true;
basicBackgroundSound.volume = 0.02;

const finalBackgroundSound = new Audio("./audio/final-fight.mp3");

let soundEnabled = true;
let gameStarted = false;

function startGame() {
  const btn = document.getElementById("startGameBtn");
  const intro = document.getElementById("introScreen");

  keyboard = new Keyboard();
  world = new World(canvas, keyboard);
  btn.classList.replace("d-block", "d-none");
  intro.classList.replace("d-block", "d-none");
  if (soundEnabled) {
    basicBackgroundSound.play().catch((e) => console.log(e));
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

function playPlayerLoseAnimations() {
  const gameOverScreen = document.getElementById("gameOverMessage");
  const gameLostScreen = document.getElementById("gameLostMessage");

  gameOverScreen.classList.replace("d-none", "d-block");

  setTimeout(() => {
    gameOverScreen.classList.replace("d-block", "d-none");
    gameLostScreen.classList.replace("d-none", "d-block");
  }, 1500);
}

function playPlayerWonAnimations() {
  const gameOverScreen = document.getElementById("gameSuccessfullyOverMessage");
  const gameWonScreen = document.getElementById("gameWonMessage");

  gameOverScreen.classList.replace("d-none", "d-block");

  setTimeout(() => {
    gameOverScreen.classList.replace("d-block", "d-none");
    gameWonScreen.classList.replace("d-none", "d-block");
  }, 1500);
}

function gameOver() {
  if (playerIsDead && !playerAnimationPlayed) {
    playerAnimationPlayed = true;
    stopAllCanvasMovements();
    playPlayerLoseAnimations();
  } else if (endbossIsDead && !bossAnimationPlayed) {
    bossAnimationPlayed = true;
    stopAllCanvasMovements();
    playPlayerWonAnimations();
  }
}

function stopAllCanvasMovements() {
  clearInterval(world.character.characterMoveRightInterval);
  clearInterval(world.character.characterMoveLeftInterval);
  world.level.enemies.forEach((enemy) => {
    clearInterval(enemy.walkingInterval);
  });
  world.level.enemies.forEach((enemy) => {
    clearInterval(enemy.moveLeftInterval);
  })
  clearInterval(world.endboss.movingInterval);
  clearInterval(world.endboss.alertAndWalkingInterval);
}
