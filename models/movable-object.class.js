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
  speedY = 0;
  acceleration = 2;

  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  energy = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = "6";
      ctx.strokeStyle = "red";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.left - this.offset.right,
        this.height - this.offset.top - this.offset.bottom
      );
      ctx.stroke();
    }
  }

  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left && // Right -> Left
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && // Bottom -> Top
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right && // Left -> Right
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    ); // Top -> Bottom
  }

  loadMovementSprites(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveRight() {
    console.log("Go right!");
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }

  playObjectAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 225;
  }
}
