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
  if (currentLevel === 1 || currentLevel === 5) {
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

  if (currentLevel !== 5) {
    repeatBtn.classList.remove("d-none");
  } else {
    repeatBtn.classList.add("d-none");
  }
}

function updateRestartGameBtnAndText() {
  const congrats = document.getElementById("congratulations");
  const restartBtn = document.getElementById("restartBtn");
  if (currentLevel === 5) {
    congrats.classList.remove("d-none");
    restartBtn.classList.remove("d-none");
    return true;
  }
}

window.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    fullScreen = false;
    removeObjectFitContain();
  }
});
