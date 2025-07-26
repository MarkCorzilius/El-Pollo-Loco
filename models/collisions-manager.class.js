class CollisionsManager extends movableObject {
  lastHit = 0;
  constructor(world) {
    super();
    this.world = world;
  }

  /**
   * Starts the interval for continuous collision checks within the world.
   */
  startCollisitionCheck() {
    this.collisionCheckInterval = setInterval(() => {
      gameIntervals.push(this.collisionCheckInterval);
      this.checkEnemiesForCollision();
      this.checkCoinsForCollision();
      this.checkCollectableObjectsCollision();
      this.world.throwableManager.handleBottleAttack();
    }, 1000 / 60);
  }

  /**
   * Checks for collisions between the character and collectable bottles.
   */
  checkCollectableObjectsCollision() {
    this.world.level.collectableObjects.forEach((collectableBottle, index) => {
      this.handleCollectableBottleCollisition(collectableBottle, index);
    });
  }

  /**
   * Checks for collisions between the character and coins.
   */
  checkCoinsForCollision() {
    this.world.level.coins.forEach((coin, index) => {
      this.world.coinCollector.handleCoinCollisition(coin, index);
    });
  }

  /**
   * Checks for collisions between the character and enemies,
   * and also initiates bottle throw checks.
   */
  checkEnemiesForCollision() {
    this.world.level.enemies.forEach((enemy) => {
      this.handleEnemyCollision(enemy);
      this.world.throwableManager.checkThrowObjects();
    });
  }

  /**
   * Handles collision logic between the character and an enemy.
   * Determines if the enemy was jumped on or damage should be processed.
   *
   * @param {Enemy} enemy - The enemy involved in the collision.
   */
  handleEnemyCollision(enemy) {
    if (this.world.character.isColliding(enemy)) {
      this.world.chickenHandler.didJumpOnChicken(enemy);
      this.processEnemyDamage(enemy);
    }
  }

  /**
   * Handles the logic when the character collides with a collectable bottle.
   * @param {Object} bottle - The bottle object.
   * @param {number} index - The index of the bottle in the level array.
   */
  handleCollectableBottleCollisition(bottle, index) {
    const key = bottle.id;
    if (this.world.character.isColliding(bottle)) {
      this.attemptBottleCollection(key, index);
    } else {
      this.resetBottleCollision(key);
    }
  }

  /**
   * Removes a bottle's key from the collision tracking set.
   * @param {string|number} key - The unique ID of the bottle.
   */
  resetBottleCollision(key) {
    this.world.collidingCollectableBottle.delete(key);
  }

  /**
   * Attempts to collect a bottle if not already processed.
   * @param {string|number} key - The bottle's unique ID.
   * @param {number} index - The index of the bottle in the level array.
   */
  attemptBottleCollection(key, index) {
    if (!this.world.collidingCollectableBottle.has(key)) {
      this.collectBottle(index);
      this.world.collidingCollectableBottle.add(key);
    }
  }

  /**
   * Increases bottle ammo and removes the collected bottle from the level.
   * @param {number} index - The index of the bottle to remove.
   */
  collectBottle(index) {
    if (this.world.character.bottlesTracker >= 100) return;

    this.world.playBottleCollectSound();
    this.updateBottleStatus(index);
  }

  /**
   * Updates the character’s weapon bar after bottle collection.
   * @param {number} index - The index of the bottle in the array.
   */
  updateBottleStatus(index) {
    this.world.character.bottlesTracker += 20;
    this.world.level.collectableObjects.splice(index, 1);
    this.world.weaponBar.setPercentage(this.world.character.bottlesTracker, this.world.weaponBar.WEAPON_STATUS_IMAGES);
  }

  /**
   * Processes the damage dealt to the character by a specific enemy.
   * Updates the last hit time, applies damage, and updates the health bar.
   *
   * @param {Enemy} enemy - The enemy causing the damage.
   */
  processEnemyDamage(enemy) {
    if (!enemy.isDead) {
      this.lastHit = performance.now();
      this.world.character.hit(enemy.damage);
      this.world.healthBar.setPercentage(this.world.character.healthTracker, this.world.healthBar.HEALTH_STATUS_IMAGES);
    }
  }
}
