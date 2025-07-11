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
basicBackgroundSound.volume = 0.02;

const finalBackgroundSound = new Audio("./audio/final-fight.mp3");

let soundEnabled = true;

function startGame() {
  initLevel1();
  startScreen = false;
  applyFullScreen();
  const intro = document.getElementById("startScreenElements");

  keyboard = new Keyboard();
  world = new World(canvas, keyboard, level1);
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

function gameOver() {
  insertAchievementsBlock();
  if (playerIsDead && !playerAnimationPlayed) {
    playerAnimationPlayed = true;
    finalBackgroundSound.pause();
    stopAllCanvasMovements();
    playLoseAnimations()
  } else if (endbossIsDead && !bossAnimationPlayed) {
    bossAnimationPlayed = true;
    finalBackgroundSound.pause();
    stopAllCanvasMovements();
    playWinAnimations();
  }
}

function playWinAnimations() {
  world.gameWonSound.play();
  world.winMessage.show();

  setTimeout(() => {
    world.winMessage.loadImage('./img/You won, you lost/You won A.png')
  }, 1500);
  setTimeout(() => {
    showAfterGameOverScreen();
  }, 3000);
}

function playLoseAnimations() {
  world.gameLostSound.play();
  world.loseMessage.show();

  setTimeout(() => {
    world.loseMessage.loadImage('./img/You won, you lost/You lost.png')
  }, 1500);
  setTimeout(() => {
    showAfterGameOverScreen();
  }, 3000);
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

window.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    fullScreen = false;
    removeObjectFitContain();
  }
})

function playPreviousLevel() {
  const overlay = document.getElementById('afterLevelOverlay');
  const dialog = document.getElementById('afterLevelDialog');
  currentLevel -= 1;
  level = `level${currentLevel}`;
  overlay.classList.add('d-none');
  dialog.classList.replace('show', 'd-none');

}

function repeatCurrentLevel() {
}

function playNextLevel() {
  
}