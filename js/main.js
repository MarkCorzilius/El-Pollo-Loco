let gameIntervals = [];
let gameTimeouts = [];

let level = 1;
let currentLevel = 5;
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

/**
 * Starts the game by initializing the level, world, keyboard, and audio.
 * Hides the start screen and shows mobile buttons.
 */
function startGame() {
  initLevel(currentLevel);
  startScreen = false;
  applyFullScreen();
  keyboard = new Keyboard();
  world = new World(canvas, keyboard, level);
  hideStartScreen();
  showMobileButtons();
  if (soundEnabled) {
    basicBackgroundSound.play().catch((e) => console.log(e));
  }
}

/**
 * Hides the start screen UI elements when the game starts.
 */
function hideStartScreen() {
  const intro = document.getElementById("startScreenElements");
  intro.classList.replace("d-block", "d-none");
}

/**
 * Initializes the game on load.
 * Sets up canvas, control listeners, and UI elements.
 */
function init() {
  toggleGameInfoOverlay();
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  addComputerButtonsListener();
  addMobileButtonListeners();
  showMobileButtons();
  showMobileMenu();
}

/**
 * Initializes the appropriate level based on the current level number.
 * @param {number} level - The level number to initialize.
 */
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

/**
 * Decreases the current level and restarts the game from the previous level.
 * Also closes the after-game overlay.
 */
function playPreviousLevel() {
  resetGameStateFlags(currentLevel -= 1);
  startGame();
  closeAfterGameOverlay();
}

/**
 * Restarts the current level from the beginning.
 * Also closes the after-game overlay.
 */
function repeatCurrentLevel() {
  resetGameStateFlags(currentLevel);
  startGame();
  closeAfterGameOverlay();
}

/**
 * Increases the current level and starts the next level.
 * Also closes the after-game overlay.
 */
function playNextLevel() {
  resetGameStateFlags(currentLevel += 1);
  startGame();
  closeAfterGameOverlay();
}

/**
 * Hides the overlay and dialog shown after a level is completed or failed.
 */
function closeAfterGameOverlay() {
  const overlay = document.getElementById("afterLevelOverlay");
  const dialog = document.getElementById("afterLevelDialog");
  overlay.classList.add("d-none");
  dialog.classList.replace("show", "d-none");
}

/**
 * Reloads the browser window to restart the entire game from scratch.
 */
function restartGame() {
  location.reload();
}

/**
 * Resets all flags and counters necessary to restart or load a new level.
 * @param {number} newLevel - The new level number to set.
 */
function resetGameStateFlags(newLevel) {
  currentLevel = newLevel;
  gameLost = false;
  gameIsOver = false;
  coinsCollected = 0;
  endbossIsDead = false;
  bossAnimationPlayed = false;
  playerAnimationPlayed = false;
  playerIsDead = false;
}
