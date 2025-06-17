class movableObject {
    x = 120;
    y = 400;
    img;
    width = 100;
    height = 150;


    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log('Go right!');
    }

    moveLeft() {
        console.log("Go left!");
    }
}