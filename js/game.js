function gameOver() {
  showMobileButtons();
  insertAchievementsBlock();
  if (playerIsDead && !playerAnimationPlayed) {
    handleGameOverLoss();
    clearAllCanvasIntervals();
  } else if (endbossIsDead && !bossAnimationPlayed) {
    handleGameOverWin();
    clearAllCanvasIntervals();
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

function stopAllCanvasMovements() { // check for doubling
  clearInterval(world.character.characterMoveRightInterval);
  clearInterval(world.character.characterMoveLeftInterval);
  world.level.enemies.forEach((enemy) => {
    clearInterval(enemy.walkingInterval);
  });
  world.level.enemies.forEach((enemy) => {
    clearInterval(enemy.moveLeftInterval);
  });
  clearInterval(world.endboss.movingInterval);
  clearInterval(world.endboss.alertAndWalkingInterval);
}