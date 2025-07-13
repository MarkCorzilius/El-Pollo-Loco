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
      finalBackgroundSound.volume = 0.05;
    } else {
      basicBackgroundSound.play();
      basicBackgroundSound.volume = 0.1;
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

function clearAllCanvasIntervals() {
  clearInterval(world.character.characterAnimationInterval);

  world.level.enemies.forEach(enemy => {
    clearInterval(enemy.walkingInterval);
    clearInterval(enemy.moveLeftInterval);
  });
  clearInterval(world.endboss.alertAndWalkingInterval);
  clearInterval(world.endbossManager.movingInterval);

  clearInterval(world.deadEndbossInterval);
  clearInterval(world.hurtEndbossInterval);
  clearInterval(world.endbossManager.distanceCharacterEndbossInterval);
  clearInterval(world.endbossManager.endbossAttackInterval)

  clearInterval(world.gameOverInterval);
  clearInterval(world.moveLeftInterval);
  clearInterval(world.gravityInterval);

  world.level.clouds.forEach(cloud => {
    clearInterval(cloud.moveLeftInterval);
  })

  world.level.coins.forEach(coin => {
    clearInterval(coin.coinAnimationInterval);
  })

  clearInterval(world.throwableManager.groundCheckInterval);
}