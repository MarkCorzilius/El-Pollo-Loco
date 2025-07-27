/**
 * Represents throwable objects like bottles with physics and animation.
 */
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

  offset = { top: 10, left: 10, right: 10, bottom: 10 };
  rotationInterval;
  gravityInterval;
  gravityDisabled;

  /**
   * Creates a new throwable object (e.g., a bottle) with position, animations, and throw behavior.
   * @param {number} x - The x-coordinate where the bottle starts.
   * @param {number} y - The y-coordinate where the bottle starts.
   * @param {Character} character - The character throwing the bottle.
   */
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

  /**
   * Initializes and executes the bottle throw action.
   *
   * @param {number} x - X position to start the throw.
   * @param {number} y - Y position to start the throw.
   * @param {Character} character - Character who throws the object.
   */
  throw(x, y, character) {
    this.character.characterAnimations.resetIdleAnimationStates();
    this.setInitialThrowState(x, y);
    this.playBottleThrowSound();
    this.determineThrowDirection(character);
  }

  /**
   * Sets the initial position and vertical speed of the throw.
   * @param {number} x
   * @param {number} y
   */
  setInitialThrowState(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 10;
  }

  /**
   * Plays the sound effect for throwing a bottle.
   */
  playBottleThrowSound() {
    this.bottleThrowSound.volume = soundEnabled ? 0.1 : 0;
    this.bottleThrowSound.play();
  }

  /**
   * Determines the throw direction based on character orientation.
   * @param {Character} character
   */
  determineThrowDirection(character) {
    if (character.otherDirection) {
      this.throwLeft();
    } else {
      this.throwRight();
    }
  }

  /**
   * Moves the bottle left while in the air.
   */
  throwLeft() {
    this.startRotationInterval();
    this.applyGravity();
    this.startLeftMovementInterval();
  }

  /**
   * Starts rotating the bottle during the throw.
   */
  startRotationInterval() {
    this.rotationInterval = setInterval(() => {
      gameIntervals.push(this.rotationInterval);
      this.playObjectAnimation(this.BOTTLE_ROTATION_IMAGES);
    }, 50);
  }

  /**
   * Moves the bottle right while in the air.
   */
  startLeftMovementInterval() {
    this.gravityInterval = setInterval(() => {
      gameIntervals.push(this.gravityInterval);
      if (this.gravityDisabled) return;
      this.x -= 12;
    }, 25);
  }

  /**
   * Initiates throwing the bottle to the right, including gravity and animation.
   */
  throwRight() {
    this.startRotationInterval();
    this.applyGravity();
    this.startRightMovementInterval();
  }

  /**
   * Moves the bottle right while in the air.
   */
  startRightMovementInterval() {
    this.gravityInterval = setInterval(() => {
      gameIntervals.push(this.gravityInterval);
      if (this.gravityDisabled) return;
      this.x += 12;
    }, 25);
  }

  /**
   * Checks if the bottle has impacted the ground and triggers effects.
   */
  checkGroundImpact() {
    if (this.hitTheGround()) {
      this.hasExploded = true;
      if (this.canCallBottleHit()) {
        this.callBottleSplit();
      }
    }
  }

  /**
   * Checks if the bottle has hit the ground.
   * @returns {boolean}
   */
  hitTheGround() {
    return this instanceof ThrowableObjects && this.y >= 380 && !this.hasExploded;
  }

  /**
   * Verifies if bottle impact callback can be executed.
   * @returns {boolean}
   */
  canCallBottleHit() {
    return this.world && typeof this.world.throwableManager.bottleHit === "function";
  }

  /**
   * Triggers bottle splash animation and removes it.
   */
  callBottleSplit() {
    this.world.throwableManager.bottleHit(this, this.world.throwableObjects.indexOf(this));
  }
}

/**
 * Manages the logic for creating and handling throwable bottles.
 */
class ThrowableManager {
  lastBottle = 0;

  /**
   * Creates an instance of ThrowableManager.
   * @param {World} world - The game world context.
   */
  constructor(world) {
    this.world = world;
    this.collidingBottleHit = new Set();
  }

  /**
   * Checks if bottle can be thrown and creates it.
   */
  checkThrowObjects() {
    const now = new Date().getTime();
    if (this.canThrowBottle(now)) {
      let bottle = this.createBottle();
      this.storeBottle(bottle);
      this.updateThrowState(now);
    }
  }

  /**
   * Checks conditions for throwing a new bottle.
   * @param {number} now - Current timestamp.
   * @returns {boolean}
   */
  canThrowBottle(now) {
    return this.world.keyboard.D && now - this.lastBottle > 1500 && this.world.character.bottlesTracker > 0;
  }

  /**
   * Creates and initializes a new bottle.
   * @returns {ThrowableObjects}
   */
  createBottle() {
    let bottle = this.adjustBottleForDirection();
    bottle.world = this.world;
    return bottle;
  }

  /**
   * Stores the new bottle in the world.
   * @param {ThrowableObjects} bottle
   */
  storeBottle(bottle) {
    this.world.throwableObjects.push(bottle);
  }

  /**
   * Updates internal state after throwing a bottle.
   * @param {number} now - Current timestamp.
   */
  updateThrowState(now) {
    this.lastBottle = now;
    this.world.character.bottlesTracker -= 20;
    this.world.weaponBar.setPercentage(this.world.character.bottlesTracker, this.world.weaponBar.WEAPON_STATUS_IMAGES);
  }

  /**
   * Adjusts bottle starting position based on character direction.
   * @returns {ThrowableObjects}
   */
  adjustBottleForDirection() {
    let bottle;
    if (this.world.character.otherDirection) {
      bottle = new ThrowableObjects(this.world.character.x, this.world.character.y + 50, this.world.character); // adjust for direction
    } else {
      bottle = new ThrowableObjects(this.world.character.x + 100, this.world.character.y + 50, this.world.character); // adjust for direction
    }
    return bottle;
  }

  /**
   * Manages enemy collisions and ground checks for bottles.
   */
  handleBottleAttack() {
    this.startGroundCheckInterval();
    this.world.throwableObjects.forEach((bottle) => this.checkBottleCollisions(bottle));
  }

  /**
   * Checks if a bottle collides with enemies.
   * @param {ThrowableObjects} bottle
   */
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

  /**
   * Triggers bottle hit effect if it hasn't already hit the enemy.
   * @param {ThrowableObjects} bottle
   * @param {Enemy} enemy
   * @param {string} key - Unique enemy identifier.
   */
  tryBottleHit(bottle, enemy, key) {
    if (!this.collidingBottleHit.has(key)) {
      this.bottleHit(bottle, enemy);
      this.collidingBottleHit.add(key);
    }
  }

  /**
   * Resets hit tracking for a bottle-enemy collision.
   * @param {string} key - Enemy identifier.
   */
  resetBottle(key) {
    this.collidingBottleHit.delete(key);
  }

  /**
   * Sets interval to check for ground impacts.
   */
  startGroundCheckInterval() {
    this.groundCheckInterval = setInterval(() => {
      gameIntervals.push(this.groundCheckInterval);
      this.world.throwableObjects.forEach((bottle) => {
        bottle.checkGroundImpact();
      });
    }, 60);
  }

  /**
   * Handles what happens when a bottle hits an enemy.
   * @param {ThrowableObjects} bottle
   * @param {Enemy} enemy
   */
  bottleHit(bottle, enemy) {
    this.resetBottleStatesAfterHit(bottle);

    this.world.handleEnemyHit(enemy);

    this.startBottleHitInterval(bottle);
  }

  /**
   * Stops movement and rotation when a bottle hits an enemy.
   * @param {ThrowableObjects} bottle
   */
  resetBottleStatesAfterHit(bottle) {
    bottle.gravityDisabled = true;
    clearInterval(bottle.rotationInterval);
    clearInterval(bottle.gravityInterval);
  }

  /**
   * Starts splash animation after bottle hit.
   * @param {ThrowableObjects} bottle
   */
  startBottleHitInterval(bottle) {
    bottle.currentImage = 0;
    bottle.splashInterval = this.createBottleSplashInterval(bottle);
  }

  /**
   * Creates splash animation interval.
   * @param {ThrowableObjects} bottle
   * @returns {number} Interval ID
   */
  createBottleSplashInterval(bottle) {
    return setInterval(() => {
      gameIntervals.push(bottle.splashInterval);
      this.world.character.characterAnimations.resetIdleAnimationStates();
      bottle.playObjectAnimation(bottle.BOTTLE_SPLASH_IMAGES, true);

      if (this.playedAllSplashImages(bottle)) {
        this.removeBottleAfterAnimation(bottle);
      }
    }, 50);
  }

  /**
   * Removes bottle after splash animation ends.
   * @param {ThrowableObjects} bottle
   */
  removeBottleAfterAnimation(bottle) {
    clearInterval(bottle.splashInterval);
    const index = this.world.throwableObjects.indexOf(bottle);
    if (index !== -1) {
      this.world.throwableObjects.splice(index, 1);
    }
  }

  /**
   * Checks if splash animation has completed.
   * @param {ThrowableObjects} bottle
   * @returns {boolean}
   */
  playedAllSplashImages(bottle) {
    return bottle.currentImage >= bottle.BOTTLE_SPLASH_IMAGES.length;
  }
}
