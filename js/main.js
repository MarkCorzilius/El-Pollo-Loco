let level = 1;
let currentLevel = 2;
let coinsCollected = 0;

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
basicBackgroundSound.volume = 0.1;

const finalBackgroundSound = new Audio("./audio/final-fight.mp3");

let soundEnabled = true;

let globalEnemyId = 0;
let world;

let startScreen = true;
let fullScreen = false;

let gameLost = false;

function startGame() {
  initLevel(currentLevel);
  startScreen = false;
  applyFullScreen();
  keyboard = new Keyboard();
  world = new World(canvas, keyboard, level);
  const intro = document.getElementById("startScreenElements");
  intro.classList.replace("d-block", "d-none");
  showMobileButtons();
  if (soundEnabled) {
    basicBackgroundSound.play().catch((e) => console.log(e));
  }
}

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  addComputerButtonsListener();
  addMobileButtonListeners();
  showMobileButtons();
  showMobileMenu();
}

function initLevel(level) {
  switch (level) {
    case 1:
      initLevel1();
      break;
    case 2:
      initLevel2();
      break;
    case 3:
      initLevel3();
      break;
    case 4:
      initLevel4();
      break;
    case 5:
      initLevel5();
      break;

    default:
      initLevel1();
      break;
  }
}

function playPreviousLevel() {
  resetGameStateFlags();
  startGame();
  closeAfterGameOverlay();
}

function repeatCurrentLevel() {
  resetGameStateFlags();
  startGame();
  closeAfterGameOverlay();
}

function playNextLevel() {
  resetGameStateFlags();
  startGame();
  closeAfterGameOverlay();
}

function closeAfterGameOverlay() {
  const overlay = document.getElementById("afterLevelOverlay");
  const dialog = document.getElementById("afterLevelDialog");
  overlay.classList.add("d-none");
  dialog.classList.replace("show", "d-none");
}

function restartGame() {
  location.reload();
}

function resetGameStateFlags() {
  gameLost = false;
  world.character.healthTracker = 100;
  gameIsOver = false;
  coinsCollected = 0;
  currentLevel += 1;
  endbossIsDead = false;
  bossAnimationPlayed = false;
  playerAnimationPlayed = false;
  playerIsDead = false;
}
