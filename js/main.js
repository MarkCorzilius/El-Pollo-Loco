let gameIntervals = [];
let gameTimeouts = [];

let level = 1;
let currentLevel = 1;
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

let soundEnabled = JSON.parse(localStorage.getItem('soundEnabled') ?? 'true');

let globalEnemyId = 0;
let world;

let startScreen = true;
let fullScreen = false;

let gameIsLoading = true;

let gameLost = false;

/**
 * Starts the game by initializing the level, world, keyboard, and audio.
 * Hides the start screen and shows mobile buttons.
 */
async function startGame() {
  showLoadingSpinner();
  createNewWorld();
  startScreen = false;
  showMobileButtons();
  if (soundEnabled) {
    basicBackgroundSound.play().catch((e) => console.log(e));
  }
  startGameLoadingInterval();
}

/**
 * Starts an interval to check if the game is loading.
 * When loading begins, hides the start screen and spinner, then clears the interval.
 */
function startGameLoadingInterval() {
  const loadingGameInterval = setInterval(() => {
    if (!gameIsLoading) {
      gameIsLoading = true;
      setTimeout(() => {
        hideStartScreen();
        hideLoadingSpinner();   
      }, 1000);
      clearInterval(loadingGameInterval);
    }
  }, 1000 / 60);
}

/**
 * Reset the old world.
 * Creates new world instance.
 */
async function createNewWorld() {
  world = null;
  initLevel(currentLevel);
  keyboard = new Keyboard();
  world = new World(canvas, keyboard, level);
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
  setGameVolumeImage('volumeBtn');
  setGameVolumeImage('mobileVolumeBtn');
  adjustUIForMobileDevices();
  checkDeviceOrientation();
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
  resetGameStateFlags((currentLevel -= 1));
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
  resetGameStateFlags((currentLevel += 1));
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
  world.level.enemies.forEach((enemy) => {
    enemy.isDeadChicken = false;
  });
  world.character.healthTracker = 100;
  hasSpotedCharacter = false;
  currentLevel = newLevel;
  endbossIsDead = false;
  playerIsDead = false;
  gameLost = false;
  gameIsOver = false;
  coinsCollected = 0;
  bossAnimationPlayed = false;
  playerAnimationPlayed = false;
  hasEndbossAlerted = false;
}
