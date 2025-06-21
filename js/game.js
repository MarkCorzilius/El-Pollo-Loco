let canvas;
let world;
let background;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    ctx = canvas.getContext('2d');

    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                keyboard.LEFT = true;
                break;
            case 'ArrowRight':
                keyboard.RIGHT = true;
                break;
            case 'ArrowUp':
                keyboard.UP = true;
                break;
        }
    })

    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                keyboard.LEFT = false;
                break;
            case 'ArrowRight':
                keyboard.RIGHT = false;
                break;
            case 'ArrowUp':
                keyboard.UP = false;
                break;
        }
    })
}