let world;

let globalEnemyId = 0;
let soundEnabled = true;

function enterFullScreen() {
  const canvas = document.getElementById("canvas");
  canvas.requestFullscreen();
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
  updateSoundState(world);
}

function updateSoundState(world) {
  if (!world || !world.character) return;

  const obj = world;

  if (!soundEnabled) {
    obj.basicBackgroundSound.pause();
    obj.finalBackgroundSound.pause();
  } else {
    if (world.finalFight) {
        obj.finalBackgroundSound.play();
        obj.finalBackgroundSound.volume = 0.5;
    } else {
        obj.basicBackgroundSound.play();
        obj.basicBackgroundSound.volume = 0.02; // softer background
    }
  }
}
