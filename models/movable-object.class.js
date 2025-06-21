class movableObject {
    x = 120;
    y = 325;
    img;
    width = 100;
    height = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadMovementSprites(arr){
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight() {
        console.log('Go right!');
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000/60);
    }
}