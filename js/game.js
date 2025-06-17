let canvas;
let world;
let background;

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas);
    ctx = canvas.getContext('2d');

    console.log("My character is: ", world.enemies)
}