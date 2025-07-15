class ThrowableObjects extends movableObject {
  bottleThrowSound = new Audio("./audio/bottle-throw.mov");

  BOTTLE_ROTATION_IMAGES = [
    "./img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  BOTTLE_SPLASH_IMAGES = [
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  offset = { top: 50, left: 40, right: 40, bottom: 50 };
  rotationInterval;
  gravityInterval;
  gravityDisabled;

  constructor(x, y, character) {
    super().loadImage(`./img/6_salsa_bottle/salsa_bottle.png`);
    this.gravityDisabled = false;
    this.hasExploded = false;
    this.loadMovementSprites(this.BOTTLE_ROTATION_IMAGES);
    this.loadMovementSprites(this.BOTTLE_SPLASH_IMAGES);
    this.height = 60;
    this.width = 60;
    this.character = character;
    this.throw(x, y, this.character);
  }

  throw(x, y, character) {
    this.setInitialThrowState(x, y);
    this.playBottleThrowSound();
    this.determineThrowDirection(character);
  }

  setInitialThrowState(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 10;
  }

  playBottleThrowSound() {
    this.bottleThrowSound.volume = soundEnabled ? 0.5 : 0;
    this.bottleThrowSound.play();
  }

  determineThrowDirection(character) {
    if (character.otherDirection) {
      this.throwLeft();
    } else {
      this.throwRight();
    }
  }

  throwLeft() {
    this.startRotationInterval();
    this.applyGravity();
    this.startLeftMovementInterval();
  }

  startRotationInterval() {
    this.rotationInterval = setInterval(() => {
      gameIntervals.push(this.rotationInterval);
      this.playObjectAnimation(this.BOTTLE_ROTATION_IMAGES);
    }, 50);
  }

  startLeftMovementInterval() {
    this.gravityInterval = setInterval(() => {
      gameIntervals.push(this.gravityInterval);
      if (this.gravityDisabled) return;
      this.x -= 12;
    }, 25);
  }

  throwRight() {
    this.startRotationInterval();
    this.applyGravity();
    this.startRightMovementInterval();
  }

  startRightMovementInterval() {
    this.gravityInterval = setInterval(() => {
      gameIntervals.push(this.gravityInterval);
      if (this.gravityDisabled) return;
      this.x += 12;
    }, 25);
  }

  checkGroundImpact() {
    if (this.hitTheGround()) {
      this.hasExploded = true;
      if (this.canCallBottleHit()) {
        this.callBottleSplit();
      }
    }
  }

  hitTheGround() {
    return this instanceof ThrowableObjects && this.y >= 380 && !this.hasExploded;
  }

  canCallBottleHit() {
    return this.world && typeof this.world.throwableManager.bottleHit === "function";
  }

  callBottleSplit() {
    this.world.throwableManager.bottleHit(this, this.world.throwableObjects.indexOf(this));
  }
}

class ThrowableManager {
  lastBottle = 0;
  constructor(world) {
    this.world = world;
    this.collidingBottleHit = new Set();
  }

  checkThrowObjects() {
    const now = new Date().getTime();
    if (this.canThrowBottle(now)) {
      let bottle = this.createBottle();
      this.storeBottle(bottle);
      this.updateThrowState(now);
    }
  }

  canThrowBottle(now) {
    return this.world.keyboard.D && now - this.lastBottle > 1500 && this.world.character.bottlesTracker > 0;
  }

  createBottle() {
    let bottle = this.adjustBottleForDirection();
    bottle.world = this.world;
    return bottle;
  }

  storeBottle(bottle) {
    this.world.throwableObjects.push(bottle);
  }

  updateThrowState(now) {
    this.lastBottle = now;
    this.world.character.bottlesTracker -= 20;
    this.world.weaponBar.setPercentage(this.world.character.bottlesTracker, this.world.weaponBar.WEAPON_STATUS_IMAGES);
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
    this.startGroundCheckInterval();
    this.world.throwableObjects.forEach((bottle) => this.checkBottleCollisions(bottle));
  }

  checkBottleCollisions(bottle) {
    this.world.level.enemies.forEach((enemy) => {
      const key = enemy.id;
      if (bottle.isColliding(enemy)) {
        this.tryBottleHit(bottle, enemy, key);
      } else {
        this.resetBottle(key);
      }
    });
  }

  tryBottleHit(bottle, enemy, key) {
    if (!this.collidingBottleHit.has(key)) {
      this.bottleHit(bottle, enemy);
      this.collidingBottleHit.add(key);
    }
  }

  resetBottle(key) {
    this.collidingBottleHit.delete(key);
  }

  startGroundCheckInterval() {
    this.groundCheckInterval = setInterval(() => {
      gameIntervals.push(this.groundCheckInterval);
      this.world.throwableObjects.forEach((bottle) => {
        bottle.checkGroundImpact();
      });
    }, 60);
  }

  bottleHit(bottle, enemy) {
    this.resetBottleStatesAfterHit(bottle);

    this.world.handleEnemyHit(enemy);

    this.startBottleHitInterval(bottle);
  }

  resetBottleStatesAfterHit(bottle) {
    bottle.gravityDisabled = true;
    clearInterval(bottle.rotationInterval);
    clearInterval(bottle.gravityInterval);
  }

  startBottleHitInterval(bottle) {
    bottle.currentImage = 0;
    bottle.splashInterval = this.createBottleSplashInterval(bottle);
  }

  createBottleSplashInterval(bottle) {
    return setInterval(() => {
      gameIntervals.push(bottle.splashInterval);
      bottle.playObjectAnimation(bottle.BOTTLE_SPLASH_IMAGES, true);

      if (this.playedAllSplashImages(bottle)) {
        this.removeBottleAfterAnimation(bottle);
      }
    }, 50);
  }

  removeBottleAfterAnimation(bottle) {
    clearInterval(bottle.splashInterval);
    const index = this.world.throwableObjects.indexOf(bottle);
    if (index !== -1) {
      this.world.throwableObjects.splice(index, 1);
    }
  }

  playedAllSplashImages(bottle) {
    return bottle.currentImage >= bottle.BOTTLE_SPLASH_IMAGES.length;
  }
}
