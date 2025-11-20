/**
 * Shows or hides mobile control buttons based on device and game state.
 */
function showMobileButtons() {
  const btnsContainer = document.getElementById("mobileButtons");
  if (!gameIsOver && !startScreen && mobileDevice) {
    btnsContainer.classList.replace("d-none", "d-flex");

    document.querySelectorAll(".mobile-touch-buttons").forEach((btn) => {
      if (!btn.hasListener) {
        btn.addEventListener("contextmenu", (e) => e.preventDefault());
        btn.hasListener = true;
      }
    });
  } else {
    btnsContainer.classList.replace("d-flex", "d-none");
  }
}

/**
 * Shows or hides the mobile menu depending on the screen width.
 */
function showMobileMenu() {
  const menu = document.getElementById("mobileMenu");

  menu.classList.remove("d-none", "d-flex");

  if (mobileDevice || window.innerWidth <= 1024) {
    menu.classList.add("d-flex"); // show
  } else {
    menu.classList.add("d-none"); // hide
  }
}

/**
 * Updates the visibility of overlay buttons after game over.
 */
function updateOverlayButtons() {
  updateRestartGameBtnAndText();
  updatePreviousLevelBtn();
  updateNextLevelBtn();
  updateRepeatLevelBtn();
}

/**
 * Updates the visibility of the "Previous Level" button based on the current level.
 */
function updatePreviousLevelBtn() {
  const prevBtn = document.getElementById("previousLevelBtn");
  if (currentLevel === 1 || (currentLevel === 5 && !gameLost)) {
    prevBtn.classList.add("d-none");
  } else {
    prevBtn.classList.remove("d-none");
  }
}

/**
 * Updates the visibility of the "Next Level" button based on the current level and game state.
 */
function updateNextLevelBtn() {
  const nextBtn = document.getElementById("nextLevelBtn");
  if (!gameLost && currentLevel !== 5) {
    nextBtn.classList.remove("d-none");
  } else {
    nextBtn.classList.add("d-none");
  }
}

/**
 * Updates the visibility of the "Repeat Level" button based on current level and game result.
 */
function updateRepeatLevelBtn() {
  const repeatBtn = document.getElementById("repeatLevelBtn");

  if (currentLevel !== 5 || gameLost) {
    repeatBtn.classList.remove("d-none");
  } else {
    repeatBtn.classList.add("d-none");
  }
}

/**
 * Updates the restart button and congratulatory text if final level is completed.
 */
function updateRestartGameBtnAndText() {
  const congrats = document.getElementById("congratulations");
  const restartBtn = document.getElementById("restartBtn");
  if (currentLevel === 5 && !gameLost) {
    congrats.classList.remove("d-none");
    restartBtn.classList.remove("d-none");
  } else {
    congrats.classList.add("d-none");
    restartBtn.classList.add("d-none");
  }
}

/**
 * Listens for changes to fullscreen mode and resets fullscreen
 * state and UI adjustments when exiting fullscreen.
 */
window.addEventListener("fullscreenchange", () => {
  if (isInFullscreen()) {
    adjustCanvasBasedOnScreen(true);
    fullScreen = false;
    removeObjectFitContain();
  } else {
    adjustCanvasBasedOnScreen(false);
  }
});


/**
 * Adjusts the canvas element's class based on fullscreen state.
 *
 * @param {boolean} [canvasFullScreen=false] - Whether the canvas should be fullscreen.
 */
 function adjustCanvasBasedOnScreen(canvasFullScreen = false) {
  const canvas = document.getElementById("canvas");
  if (canvasFullScreen) {
    canvas.classList.add("full-screen-canvas");
  } else {
    canvas.classList.remove("full-screen-canvas");
  }
 }

/**
 * Displays the game over overlay and dialog after level completion or loss.
 */
function showAfterGameOverScreen() {
  const overlay = document.getElementById("afterLevelOverlay");
  const dialog = document.getElementById("afterLevelDialog");
  overlay.classList.remove("d-none");
  dialog.classList.remove("d-none");
  setTimeout(() => {
    dialog.classList.add("show");
  }, 50);
}

/**
 * Inserts the achievements HTML block into the achievements container.
 */
function insertAchievementsBlock() {
  const container = document.getElementById("achievements");
  container.innerHTML = achievementsTemplate();
}

/**
 * Toggles visibility of the game info overlay and its dialog.
 */
function toggleGameInfoOverlay() {
  const overlay = document.getElementById("gameInfoOverlay");
  const dialog = document.getElementById("gameInfoDialog");
  if (overlay.classList.contains("d-none")) {
    showInfoOverlayAndDialog(overlay, dialog);
  } else {
    hideInfoOverlayAndDialog(overlay, dialog);
  }
}

/**
 * Displays the game info overlay and dialog with a slight animation delay.
 * @param {HTMLElement} overlay - The overlay element to show.
 * @param {HTMLElement} dialog - The dialog element to show.
 */
function showInfoOverlayAndDialog(overlay, dialog) {
  overlay.classList.remove("d-none");
  dialog.classList.remove("d-none");
  setTimeout(() => {
    dialog.classList.add("show");
  }, 50);
}

/**
 * Hides the game info overlay and dialog.
 * @param {HTMLElement} overlay - The overlay element to hide.
 * @param {HTMLElement} dialog - The dialog element to hide.
 */
function hideInfoOverlayAndDialog(overlay, dialog) {
  overlay.classList.add("d-none");
  dialog.classList.replace("show", "d-none");
}

/**
 * Toggles the visibility of mobile menu elements.
 */
function toggleMobileMenu() {
  const elements = document.getElementById("mobileMenuElements");
  if (elements.classList.contains("d-block")) {
    elements.classList.replace("d-block", "d-none");
  } else {
    elements.classList.replace("d-none", "d-block");
  }
}

/**
 * Adds 'object-fit-contain' to the intro screen if full screen and on start screen.
 */
function objectFitContain() {
  const introScreen = document.getElementById("introScreen");
  if (fullScreen && startScreen) {
    introScreen.classList.add("object-fit-contain");
  }
}

/**
 * Removes 'object-fit-contain' class from the intro screen.
 */
function removeObjectFitContain() {
  const introScreen = document.getElementById("introScreen");
  introScreen.classList.remove("object-fit-contain");
}

/**
 * Enters full screen mode and adjusts screen fitting styles.
 */
function enterFullScreen() {
  fullScreen = true;
  applyFullScreen();
  objectFitContain();
}

/**
 * Applies full screen mode to the start screen or game canvas
 * depending on the current game state.
 */
function applyFullScreen() {
  if (mobileDevice) return;
  const introScreen = document.getElementById("startScreenElements");
  if (startScreen && fullScreen) {
    introScreen.requestFullscreen();
  }
  if (!startScreen && fullScreen) {
    canvas.requestFullscreen();
  }
}

/**
 * Toggles game volume and updates the volume icon image.
 * @param {string} id - The DOM ID of the volume button image.
 */
function toggleGameVolume(id) {
  const button = document.getElementById(id);
  if (button.src.includes("volume-on.png")) {
    button.src = "./img/volume-off.png";
  } else {
    button.src = "./img/volume-on.png";
  }
  toggleSounds();
}

function setGameVolumeImage(id) {
  const savedSound = JSON.parse(localStorage.getItem('soundEnabled'))
  const button = document.getElementById(id);
  if (!savedSound) {
    button.src = "./img/volume-off.png";
  } else {
    button.src = "./img/volume-on.png";
  }
}

/**
 * Enables or disables all game sounds and updates audio state accordingly.
 */
function toggleSounds() {
  const savedSound = JSON.parse(localStorage.getItem('soundEnabled'))
  soundEnabled = savedSound;
  soundEnabled = soundEnabled ? false : true;
  localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
  if (world === undefined || !world.character) return;
  updateSoundState();
}

/**
 * Updates sound playback state based on whether sounds are enabled.
 */
function updateSoundState() {
  if (!soundEnabled) {
    basicBackgroundSound.pause();
    finalBackgroundSound.pause();
  } else {
    playAppropriateBackgroundSound();
  }
}

/**
 * Plays the appropriate background sound based on the game phase (normal or final fight).
 */
function playAppropriateBackgroundSound() {
  if (world.finalFight) {
    finalBackgroundSound.play();
    finalBackgroundSound.volume = 0.05;
  } else {
    basicBackgroundSound.play();
    basicBackgroundSound.volume = 0.1;
  }
}

function togglePrivacyPolicyOverlay() {
  const overlay = document.getElementById('privacyPolicyOverlay');
  const dialog = document.getElementById('privacyPolicyDialog');
  if (overlay.classList.contains('d-none')) {
    showInfoOverlayAndDialog(overlay, dialog)
  } else {
    hideInfoOverlayAndDialog(overlay, dialog)
  }
}