class movableObject extends DrawableObject {
  world;
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;

  lastHit = 0;

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
    this.playCharacterHurtSound();
    this.applyDamage(damage);
  }

  applyDamage(damage) {
    this.healthTracker -= damage;
    if (this.healthTracker <= 0) {
      this.healthTracker = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  playCharacterHurtSound() {
    this.world.characterHurtSound.volume = soundEnabled ? 0.5 : 0;
    this.world.characterHurtSound.play();
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
    this.moveLeftInterval = setInterval(() => {
      gameIntervals.push(this.moveLeftInterval);
      this.x -= this.speed;
    }, 1000 / 60);
  }

  playObjectAnimation(images, stopAtEnd = false) {
    this.resetImagesIfChanged(images);
    if (stopAtEnd) {
      this.playAnimationStopAtEnd(images);
    } else {
      this.playLoopingAnimation(images);
    }
  }

  playAnimationStopAtEnd(images) {
    if (this.currentImage < images.length) {
      let path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage++;
    }
  }

  playLoopingAnimation(images) {
    let path = images[this.currentImage % images.length];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  resetImagesIfChanged(images) {
    if (this.currentAnimation !== images) {
      this.currentAnimation = images;
      this.currentImage = 0;
    }
  }

  applyGravity() {
    this.gravityInterval = setInterval(() => {
      gameIntervals.push(this.gravityInterval);
      this.updateVerticalPosition();
    }, 1000 / 25);
  }

  updateVerticalPosition() {
    if (this.isInAirOrMovingUp()) {
      if (this.gravityDisabled) return;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    }
  }

  isInAirOrMovingUp() {
    return this.isAboveGround() || this.speedY > 0;
  }

  isAboveGround() {
    if (this instanceof ThrowableObjects) {
      return this.y <= 380;
    }
    return this.y < 225;
  }
}
