/**
 * Base class for all movable game objects. Extends DrawableObject.
 */
class movableObject extends DrawableObject {
  world;
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  gravityInterval;
  lastHit = 0;

  /**
   * Checks for collision with another movable object.
   * @param {Object} mo - Object to check collision with.
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left && // Right -> Left
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && // Bottom -> Top
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right && // Left -> Right
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    ); // Top -> Bottom
  }

  /**
   * Applies damage to the character unless the enemy was jumped on.
   * Plays a hurt sound and updates the last hit time if damage is applied.
   *
   * @param {number} damage - The amount of damage to apply.
   */
  hit(damage) {
    if (this.enemyWasJumpedOn) return;
    if (!this.isHurt()) {
      this.playCharacterHurtSound();
      this.applyDamage(damage);
      this.lastHit = performance.now();
    }
  }

  /**
   * Plays the character hurt sound.
   */
  playCharacterHurtSound() {
    this.world.characterHurtSound.volume = soundEnabled ? 0.2 : 0;
    this.world.characterHurtSound.play();
  }

  /**
   * Checks if the object was recently hit.
   * @returns {boolean}
   */
  isHurt() {
    let timepassed = performance.now() - this.lastHit;
    return timepassed < 400;
  }

  /**
   * Starts moving the object left continuously.
   */
  moveLeft() {
    this.moveLeftInterval = setInterval(() => {
      gameIntervals.push(this.moveLeftInterval);
      this.x -= this.speed;
    }, 1000 / 60);
  }

  /**
   * Plays animation from a set of images.
   * @param {Array} images
   * @param {boolean} [stopAtEnd=false]
   */
  playObjectAnimation(images, stopAtEnd = false) {
    this.resetImagesIfChanged(images);
    if (stopAtEnd) {
      this.playAnimationStopAtEnd(images);
    } else {
      this.playLoopingAnimation(images);
    }
  }

  /**
   * Plays animation and stops at the end.
   * @param {Array} images
   */
  playAnimationStopAtEnd(images) {
    if (this.currentImage < images.length) {
      let path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage++;
    }
  }

  /**
   * Plays a looping animation.
   * @param {Array} images
   */
  playLoopingAnimation(images) {
    let path = images[this.currentImage % images.length];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Resets animation images if changed.
   * @param {Array} images
   */
  resetImagesIfChanged(images) {
    if (this.currentAnimation !== images) {
      this.currentAnimation = images;
      this.currentImage = 0;
    }
  }

  /**
   * Applies gravity to the object.
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      gameIntervals.push(this.gravityInterval);
      this.updateVerticalPosition();
    }, 1000 / 25);
  }

  /**
   * Updates the vertical position based on gravity.
   */
  updateVerticalPosition() {
    if (this.isInAirOrMovingUp()) {
      if (this.gravityDisabled) return;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    }
  }

  /**
   * Checks if the object is above ground or moving up.
   * @returns {boolean}
   */
  isInAirOrMovingUp() {
    return this.isAboveGround() || this.speedY > 0;
  }

  /**
   * Checks if the object is above the ground threshold.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObjects) {
      return this.y <= 380;
    }
    return this.y < 225;
  }

  /**
   * Sets the animation speed and starts playing the given image sequence.
   * @param {string[]} images - Array of image paths for the animation frames.
   * @param {number} interval - Time in milliseconds between animation frames.
   * @param {boolean} stopAtEnd - Whether to stop the animation when it reaches the last frame.
   */
  setAnimation(images, interval, stopAtEnd) {
    this.animationInterval = interval;
    this.playObjectAnimation(images, stopAtEnd);
  }
}
