class movableObject extends DrawableObject {
  world;
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

  coins = 0;
  health = 100;
  bottles = 100;

  lastHit = 0;

  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left && // Right -> Left
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && // Bottom -> Top
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right && // Left -> Right
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    ); // Top -> Bottom
  }

  hit() {
    this.health -= 10;
    if (this.health <= 0) {
      this.health = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() {
    return this.health == 0;
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
    if (this instanceof ThrowableObjects) {
      return true;
    }
    return this.y < 225;
  }
}
