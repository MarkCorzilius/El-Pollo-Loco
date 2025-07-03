let globalEnemyId = 0;

function enterFullScreen() {
    const canvas = document.getElementById('canvas');
    canvas.requestFullscreen();
}

function toggleGameVolume() {
    const button = document.getElementById('volumeBtn');

    // Check if current image is volume-on
    if (button.src.includes("volume-on.png")) {
        button.src = "./img/volume-off.png";
    } else {
        button.src = "./img/volume-on.png";
    }
}