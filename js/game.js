/**
 * Determines and handles the end of the game, whether win or loss.
 * Displays achievements, plays the correct animations and sounds,
 * and stops the game loop accordingly.
 */
function gameOver() {
  showMobileButtons();
  if (playerIsDead && !playerAnimationPlayed) {
    handleGameOverLoss();
    stopGame();
  } else if (endbossIsDead && !bossAnimationPlayed) {
    handleGameOverWin();
    stopGame();
  }
  updateOverlayButtons();

}

/**
 * Handles the game over sequence when the player dies.
 * Pauses final music and triggers loss animations.
 */
function handleGameOverLoss() {
  playerAnimationPlayed = true;
  finalBackgroundSound.pause();
  playLoseAnimations();
}

/**
 * Handles the game over sequence when the endboss is defeated.
 * Pauses final music and triggers win animations.
 */
function handleGameOverWin() {
  bossAnimationPlayed = true;
  finalBackgroundSound.pause();
  playWinAnimations();
}

/**
 * Plays animations and transitions for a game win,
 * including delayed image and screen display.
 */
function playWinAnimations() {
  insertAchievementsBlock();
  playWinSound();
  world.winMessage.show();

  setTimeout(() => {
    world.winMessage.loadImage("./img/You won, you lost/You won A.png");
  }, 1500);
  setTimeout(() => {
    showAfterGameOverScreen();
  }, 3000);
}

/**
 * Plays the game win sound if sound is enabled.
 */
function playWinSound() {
  if (soundEnabled) {
    world.gameWonSound.volume = 0.2;
    world.gameWonSound.play();
  }
}

/**
 * Plays animations and transitions for a game loss,
 * including delayed image and screen display.
 */
function playLoseAnimations() {
  insertAchievementsBlock();
  playLostSound();
  world.loseMessage.show();

  setTimeout(() => {
    world.loseMessage.loadImage("./img/You won, you lost/You lost.png");
  }, 2500);
  setTimeout(() => {
    showAfterGameOverScreen();
  }, 4000);
}

/**
 * Plays the game lost sound if sound is enabled.
 */
function playLostSound() {
  if (soundEnabled) {
    world.gameLostSound.volume = 0.2;
    world.gameLostSound.play();
  }
}

/**
 * Starts a stoppable interval and tracks its ID for later clearing.
 * @param {Function} fn - The function to be executed repeatedly.
 * @param {number} time - Interval time in milliseconds.
 */
function setStoppableIntervals(fn, time) {
  let id = setInterval(fn, time);
  gameIntervals.push(id);
}

/**
 * Starts a stoppable timeout and tracks its ID for later clearing.
 * @param {Function} fn - The function to be executed once after the timeout.
 * @param {number} time - Delay time in milliseconds.
 */
function setStoppableTimeouts(fn, time) {
  let id = setTimeout(fn, time);
  gameTimeouts.push(id);
}

/**
 * Clears all tracked intervals and timeouts to stop the game logic.
 */
function stopGame() {
  gameIntervals.forEach(clearInterval);
  gameTimeouts.forEach(clearTimeout);
}

/**
 * Starts a regular interval to check whether the game has ended.
 * Adds the interval ID to the list of stoppable intervals.
 */
function startGameOverCheckInterval() {
  gameOverInterval = setInterval(() => {
    if (playerIsDead || endbossIsDead) {
      gameOver();
    }
  }, 100);
  gameIntervals.push(gameOverInterval);
}
