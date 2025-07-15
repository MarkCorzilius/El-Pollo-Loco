function gameOver() {
  showMobileButtons();
  insertAchievementsBlock();
  if (playerIsDead && !playerAnimationPlayed) {
    handleGameOverLoss();
    stopGame();
  } else if (endbossIsDead && !bossAnimationPlayed) {
    handleGameOverWin();
    stopGame();
  }
  updateOverlayButtons();
}

function handleGameOverLoss() {
  playerAnimationPlayed = true;
  finalBackgroundSound.pause();
  playLoseAnimations();
}

function handleGameOverWin() {
  bossAnimationPlayed = true;
  finalBackgroundSound.pause();
  playWinAnimations();
}

function playWinAnimations() {
  world.gameWonSound.play();
  world.winMessage.show();

  setTimeout(() => {
    world.winMessage.loadImage("./img/You won, you lost/You won A.png");
  }, 1500);
  setTimeout(() => {
    showAfterGameOverScreen();
  }, 3000);
}

function playLoseAnimations() {
  world.gameLostSound.play();
  world.loseMessage.show();

  setTimeout(() => {
    world.loseMessage.loadImage("./img/You won, you lost/You lost.png");
  }, 1500);
  setTimeout(() => {
    showAfterGameOverScreen();
  }, 3000);
}

function setStoppableIntervals(fn, time) {
  let id = setInterval(fn, time);
  gameIntervals.push(id);
}

function setStoppableTimeouts(fn, time) {
  let id = setTimeout(fn, time);
  gameTimeouts.push(id);
}

function stopGame() {
  gameIntervals.forEach(clearInterval);
  gameTimeouts.forEach(clearTimeout);
}

function startGameOverCheckInterval() {
  gameOverInterval = setInterval(() => {
    gameIntervals.push(gameOverInterval);
    gameOver();
  }, 100);
}