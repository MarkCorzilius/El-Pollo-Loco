function showMobileButtons() {
  const btnsContainer = document.getElementById("mobileButtons");
  if (!gameIsOver && !startScreen && window.innerWidth <= 750) {
    btnsContainer.classList.replace("d-none", "d-flex");
  } else {
    btnsContainer.classList.replace("d-flex", "d-none");
  }
}

function showMobileMenu() {
  const menu = document.getElementById("mobileMenu");

  menu.classList.remove("d-none", "d-flex");

  if (window.innerWidth <= 750) {
    menu.classList.add("d-flex"); // show
  } else {
    menu.classList.add("d-none"); // hide
  }
}

function updateOverlayButtons() {
  updateRestartGameBtnAndText();
  updatePreviousLevelBtn();
  updateNextLevelBtn();
  updateRepeatLevelBtn();
}

function updatePreviousLevelBtn() {
  const prevBtn = document.getElementById("previousLevelBtn");
  if (currentLevel === 1 || (currentLevel === 5 && !gameLost)) {
    prevBtn.classList.add("d-none");
  } else {
    prevBtn.classList.remove("d-none");
  }
}

function updateNextLevelBtn() {
  const nextBtn = document.getElementById("nextLevelBtn");
  if (!gameLost && currentLevel !== 5) {
    nextBtn.classList.remove("d-none");
  } else {
    nextBtn.classList.add("d-none");
  }
}

function updateRepeatLevelBtn() {
  const repeatBtn = document.getElementById("repeatLevelBtn");

  if (currentLevel !== 5 || gameLost) {
    repeatBtn.classList.remove("d-none");
  } else {
    repeatBtn.classList.add("d-none");
  }
}

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

window.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    fullScreen = false;
    removeObjectFitContain();
  }
});

function showAfterGameOverScreen() {
  const overlay = document.getElementById("afterLevelOverlay");
  const dialog = document.getElementById("afterLevelDialog");
  overlay.classList.remove("d-none");
  dialog.classList.remove("d-none");
  setTimeout(() => {
    dialog.classList.add("show");
  }, 50);
}

function insertAchievementsBlock() {
  const container = document.getElementById("achievements");
  container.innerHTML = achievementsTemplate();
}

function toggleGameInfoOverlay() {
  const overlay = document.getElementById("gameInfoOverlay");
  const dialog = document.getElementById("gameInfoDialog");
  if (overlay.classList.contains("d-none")) {
    showInfoOverlayAndDialog(overlay, dialog);
  } else {
    hideInfoOverlayAndDialog(overlay, dialog);
  }
}

function showInfoOverlayAndDialog(overlay, dialog) {
  overlay.classList.remove("d-none");
  dialog.classList.remove("d-none");
  setTimeout(() => {
    dialog.classList.add("show");
  }, 50);
}

function hideInfoOverlayAndDialog(overlay, dialog) {
  overlay.classList.add("d-none");
  dialog.classList.replace("show", "d-none");
}

function toggleMobileMenu() {
  const elements = document.getElementById("mobileMenuElements");
  if (elements.classList.contains("d-block")) {
    elements.classList.replace("d-block", "d-none");
  } else {
    elements.classList.replace("d-none", "d-block");
  }
}

function objectFitContain() {
  const introScreen = document.getElementById("introScreen");
  if (fullScreen && startScreen) {
    introScreen.classList.add("object-fit-contain");
  }
}

function removeObjectFitContain() {
  const introScreen = document.getElementById("introScreen");
  introScreen.classList.remove("object-fit-contain");
}

function enterFullScreen() {
  fullScreen = true;
  applyFullScreen();
  objectFitContain();
}

function applyFullScreen() {
  const introScreen = document.getElementById("startScreenElements");

  if (startScreen && fullScreen) {
    introScreen.requestFullscreen();
  }
  if (!startScreen && fullScreen) {
    canvas.requestFullscreen();
  }
}

function toggleGameVolume(id) {
  const button = document.getElementById(id);
  toggleSounds();
  if (button.src.includes("volume-on.png")) {
    button.src = "./img/volume-off.png";
  } else {
    button.src = "./img/volume-on.png";
  }
}

function toggleSounds() {
  soundEnabled = soundEnabled ? false : true;
  if (world === undefined || !world.character) return;
  updateSoundState();
}

function updateSoundState() {
  if (!soundEnabled) {
    basicBackgroundSound.pause();
    finalBackgroundSound.pause();
  } else {
    playAppropriateBackgroundSound();
  }
}

function playAppropriateBackgroundSound() {
  if (world.finalFight) {
    finalBackgroundSound.play();
    finalBackgroundSound.volume = 0.05;
  } else {
    basicBackgroundSound.play();
    basicBackgroundSound.volume = 0.1;
  }
}
