class ThrowableManager {
  lastBottle = 0;
  constructor(world) {
    this.world = world;
    this.collidingBottleHit = new Set();
  }

  checkThrowObjects() {
    const now = new Date().getTime();
    if (this.world.keyboard.D && now - this.lastBottle > 1500 && this.world.character.bottlesTracker > 0) {
      let bottle = this.adjustBottleForDirection();
      bottle.world = this.world;
      this.world.throwableObjects.push(bottle);
      this.lastBottle = now;
      this.world.character.bottlesTracker -= 20;
      this.world.weaponBar.setPercentage(this.world.character.bottlesTracker, this.world.weaponBar.WEAPON_STATUS_IMAGES);
    }
  }

  adjustBottleForDirection() {
    let bottle;
    if (this.world.character.otherDirection) {
      bottle = new ThrowableObjects(this.world.character.x, this.world.character.y + 50, this.world.character); // adjust for direction
    } else {
      bottle = new ThrowableObjects(this.world.character.x + 100, this.world.character.y + 50, this.world.character); // adjust for direction
    }
    return bottle;
  }

  handleBottleAttack() {
    this.world.throwableObjects.forEach((bottle) => {
      this.world.level.enemies.forEach((enemy) => {
        const key = enemy.id;
        if (bottle.isColliding(enemy)) {
          if (!this.collidingBottleHit.has(key)) {
            this.bottleHit(bottle, enemy);
            this.collidingBottleHit.add(key);
          }
        } else {
          this.collidingBottleHit.delete(key);
        }
      });
    });
  }

  bottleHit(bottle, enemy) {
    bottle.gravityDisabled = true;
    clearInterval(bottle.rotationInterval);
    clearInterval(bottle.gravityInterval);

    this.world.handleEnemyHit(enemy);

    this.playBottleHitAnimation(bottle);
  }

  playBottleHitAnimation(bottle) {
    bottle.currentImage = 0;
    bottle.splashInterval = setInterval(() => {
      bottle.playObjectAnimation(bottle.BOTTLE_SPLASH_IMAGES, true);

      if (bottle.currentImage >= bottle.BOTTLE_SPLASH_IMAGES.length) {
        clearInterval(bottle.splashInterval);
        const index = this.world.throwableObjects.indexOf(bottle);
        if (index !== -1) {
          this.world.throwableObjects.splice(index, 1);
        }
      }
    }, 50);
  }
}
