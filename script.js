let globalEnemyId = 0;
let world;

let startScreen = true;
let fullScreen = false;

function enterFullScreen() {
  fullScreen = true;
  const introScreen = document.getElementById('startScreenElements');
  const canvas = document.getElementById("canvas");
  if (startScreen && fullScreen) {
    introScreen.requestFullscreen();
  }
  if (!startScreen && fullScreen) {
    canvas.requestFullscreen();
  }
}

function toggleGameVolume() {
  const button = document.getElementById("volumeBtn");
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