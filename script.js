let globalEnemyId = 0;
let world;

let startScreen = true;
let fullScreen = false;


function enterFullScreen() {
  fullScreen = true;
  applyFullScreen();
  objectFitContain();
}

function applyFullScreen() {
  const introScreen = document.getElementById('startScreenElements');

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
    if (world.finalFight) {
      finalBackgroundSound.play();
      finalBackgroundSound.volume = 0.5;
    } else {
      basicBackgroundSound.play();
      basicBackgroundSound.volume = 0.02; // softer background
    }
  }
}


function objectFitContain() {
  const introScreen = document.getElementById('introScreen');
    if (fullScreen && startScreen) {
      introScreen.classList.add('object-fit-contain');
    }
}

function removeObjectFitContain() {
  const introScreen = document.getElementById('introScreen');
  introScreen.classList.remove('object-fit-contain');
}

function showAfterGameOverScreen() {
  const overlay = document.getElementById('afterLevelOverlay');
  const dialog = document.getElementById('afterLevelDialog');
  overlay.classList.remove('d-none');
  dialog.classList.remove('d-none');
  setTimeout(() => {
    dialog.classList.add('show');
  }, 50);
}

function insertAchievementsBlock() {
  const container = document.getElementById('achievements');
  container.innerHTML = achievementsTemplate();
}

function toggleGameInfoOverlay() {
  const overlay = document.getElementById('gameInfoOverlay');
  const dialog = document.getElementById('gameInfoDialog');
  if (overlay.classList.contains('d-none')) {
    overlay.classList.remove('d-none');
    dialog.classList.remove('d-none');
    setTimeout(() => {
      dialog.classList.add('show');
    }, 50);
  } else {
    overlay.classList.add('d-none');
    dialog.classList.replace('show', 'd-none');
  }
}

function toggleMobileMenu() {
  const elements = document.getElementById('mobileMenuElements');
  if (elements.classList.contains('d-block')) {
    elements.classList.replace('d-block', 'd-none');
  } else {
    elements.classList.replace('d-none', 'd-block');
  }
}