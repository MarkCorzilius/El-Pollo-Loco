class movableObject extends DrawableObject {
  world;
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;

  lastHit = 0;

  constructor() {
    super();
    this.gameOverInterval = setInterval(() => {
      gameOver();
    }, 100);
  }

  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left && // Right -> Left
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && // Bottom -> Top
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right && // Left -> Right
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    ); // Top -> Bottom
  }

  hit(damage) {
    if (this.enemyWasJumpedOn) return;
    this.world.characterHurtSound.volume = soundEnabled ? 0.5 : 0;
    this.world.characterHurtSound.play();
    this.healthTracker -= damage;
    if (this.healthTracker <= 0) {
      this.healthTracker = 0;
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
    return this.healthTracker == 0;
  }

  moveRight() {
    console.log("Go right!");
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }

  playObjectAnimation(images, stopAtEnd = false) {
    if (this.currentAnimation !== images) {
      this.currentAnimation = images;
      this.currentImage = 0;
    }
      if (stopAtEnd) {
        if (this.currentImage < images.length) {
          let path = images[this.currentImage];
          this.img = this.imageCache[path];
          this.currentImage++;
        }
        
      } else {
        let path = images[this.currentImage % images.length];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
  }

  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        if (this.gravityDisabled) return;
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObjects) {
        return this.y <= 380;
    }
    return this.y < 225;
  }
}
