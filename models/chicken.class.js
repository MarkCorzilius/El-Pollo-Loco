/**
 * Represents a normal chicken enemy that walks left and animates.
 * Extends movableObject.
 */
class Chicken extends movableObject {
  moveLeftInterval;
  walkingInterval;
  isDead = false;

  offset = {
    top: 10,
    bottom: 10,
    left: 5,
    right: 5,
  };

  height = 80;
  width = 80;
  y = 345;
  x = 800;
  IMAGES_WALKING = [
    "./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Creates a Chicken with randomized speed and walking animation.
   */
  constructor() {
    super().loadImage(`./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png`);
    this.loadMovementSprites(this.IMAGES_WALKING);
    this.speed = 0.55 + Math.random() * 0.25;
    this.id = globalEnemyId++;
    this.damage = 10;
    this.animate();
  }

  /**
   * Starts walking animation and moves chicken left.
   */
  animate() {
    this.startWalkingInterval();
    this.moveLeft();
  }

  /**
   * Moves the chicken left continuously.
   */
  moveLeft() {
    this.moveLeftInterval = setInterval(() => {
      gameIntervals.push(this.moveLeftInterval);
      this.x -= this.speed;
    }, 1000 / 60);
  }

  /**
   * Starts walking animation interval.
   */
  startWalkingInterval() {
    this.walkingInterval = setInterval(() => {
      gameIntervals.push(this.walkingInterval);
      this.playObjectAnimation(this.IMAGES_WALKING);
    }, 200);
  }
}

/**
 * Represents a smaller chicken enemy with similar behavior to Chicken.
 * Extends movableObject.
 */
class SmallChicken extends movableObject {
  chickenHandler = new ChickenHandler();
  moveLeftInterval;
  walkingInterval;
  isDead = false;

  offset = {
    top: 10,
    bottom: 10,
    left: 5,
    right: 5,
  };

  height = 80;
  width = 80;
  y = 345;
  x = 800;

  IMAGES_WALKING = [
    "./img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * Creates a SmallChicken with randomized speed and walking animation.
   */
  constructor() {
    super().loadImage(`./img/3_enemies_chicken/chicken_small/1_walk/1_w.png`);
    this.loadMovementSprites(this.IMAGES_WALKING);
    this.speed = 0.15 + Math.random() * 0.25;
    this.id = globalEnemyId++;
    this.damage = 5;
    this.animate();
  }

  /**
   * Starts walking animation and moves small chicken left.
   */
  animate() {
    this.walkingInterval = setInterval(() => {
      gameIntervals.push(this.walkingInterval);
      this.playObjectAnimation(this.IMAGES_WALKING);
    }, 200);

    this.moveLeft();
  }

  /**
   * Moves the small chicken left continuously.
   */
  moveLeft() {
    this.moveLeftInterval = setInterval(() => {
      gameIntervals.push(this.moveLeftInterval);
      this.x -= this.speed;
    }, 1000 / 60);
  }
}

/**
 * Handles spawning and interaction logic for chicken enemies.
 */
class ChickenHandler {
  /**
   * Creates a ChickenHandler for managing chickens in the given world.
   * @param {Object} world - The game world instance.
   */
  constructor(world) {
    this.world = world;
    this.chickenPositions = [];
    this.minDistance = 100;
  }

  /**
   * Generates a valid x position for a new chicken, avoiding overlap.
   * @param {number} [start=300] - Start of the range.
   * @param {number} [range=2500] - Length of the range.
   * @returns {number} Valid x position.
   */
  generateValidX(start = 300, range = 2500) {
    const x = this.findValidChickenPosition(start, range);
    this.chickenPositions.push(x);
    return x;
  }

  /**
   * Finds a valid chicken position within the range.
   * @param {number} start
   * @param {number} range
   * @returns {number|undefined}
   */
  findValidChickenPosition(start, range) {
    let x;
    let isValid = false;

    for (let i = 0; i < 1000; i++) {
      x = start + Math.random() * range;
      isValid = this.chickenPositions.every((pos) => Math.abs(pos - x) >= this.minDistance);
      if (isValid) return x;
    }
  }

  /**
   * Checks if the character has jumped on a chicken enemy and handles hit.
   * @param {Object} enemy - The enemy to check.
   */
  didJumpOnChicken(enemy) {
    if (this.isNormalEnemy(enemy)) {
      this.world.character.enemyWasJumpedOn = false;
      const characterBottom = this.world.character.y + this.world.character.height;
      const enemyTop = enemy.y + enemy.offset.top;

      if (this.world.character.speedY < 0 && characterBottom <= enemyTop + enemy.height / 2) {
        this.world.character.enemyWasJumpedOn = true;
        this.world.handleEnemyHit(enemy);
      }
    }
  }

  /**
   * Checks if the enemy is a normal chicken or small chicken.
   * @param {Object} enemy
   * @returns {boolean}
   */
  isNormalEnemy(enemy) {
    return enemy instanceof Chicken || enemy instanceof SmallChicken;
  }

  /**
   * Shows the dead chicken animation and removes the enemy after timeout.
   * @param {Object} enemy - The enemy to mark as dead.
   * @param {string} deadImages - Image(s) to display on death.
   */
  showDeadChicken(enemy, deadImages) {
    clearInterval(enemy.moveLeftInterval);
    clearInterval(enemy.walkingInterval);
    enemy.loadImage(deadImages);
    enemy.isDead = true;
    setTimeout(() => {
      const index = this.world.level.enemies.indexOf(enemy);
      if (index !== -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 10000);
  }
}
