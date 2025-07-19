/**
 * Represents the game world, managing rendering, collisions, object states, and gameplay logic.
 * Extends movableObject to gain movement-related properties.
 */
class World extends movableObject {
  character = new Character();
  healthBar = new StatusBar(this, 0, 10, "health");
  weaponBar = new StatusBar(this, 55, 10, "weapon");
  coinsBar = new StatusBar(this, 105, 10, "coins");
  endbossBar = new StatusBar(this, 10, 450, "endboss");

  characterHurtSound = new Audio("./audio/player-hurt.wav");
  chickenHurtSound = new Audio("./audio/chicken-clucking.short.mov");
  chickenBossHurtSound = new Audio("./audio/chicken.boss-hurt.mov");
  deadBossSound = new Audio("./audio/dead-boss.mov");
  bottleCollectSound = new Audio("./audio/bottle-collect.mp3");
  coinCollectSound = new Audio("./audio/coin-collect.mp3");
  gameWonSound = new Audio("./audio/win-sound.mov");
  gameLostSound = new Audio("./audio/lost-sound.mov");

  throwableObjects = [];

  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  endboss;
  endbossFightTime;

  /**
   * Creates a new game world that includes the character, enemies, items, UI bars, sounds, and game logic.
   * @param {HTMLCanvasElement} canvas - The canvas element on which the game is rendered.
   * @param {Object} keyboard - The object tracking keyboard input states.
   * @param {Level} level - The level object containing enemies, objects, coins, and background elements.
   */
  constructor(canvas, keyboard, level) {
    super();
    this.level = level;
    this.endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    this.throwableManager = new ThrowableManager(this);
    this.chickenHandler = new ChickenHandler(this);
    this.endbossManager = new EndbossManager(this);
    this.coinCollector = new CoinCollector(this);
    this.collisionsManager = new CollisionsManager(this);

    this.finalFight = false;

    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.loseMessage = new LoseMessage(this, this.canvas);
    this.winMessage = new WinMessage(this, this.canvas);

    this.setWorld();
    this.draw();

    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
        enemy.world = this;
        enemy.x = this.chickenHandler.generateValidX();
      }
    });

    this.level.coins.forEach((coin) => {
      coin.world = this;
    });

    this.collidingEnemies = new Set();
    this.collidingCollectableBottle = new Set();
    this.collidingEndboss = new Set();

    this.collisionsManager.startCollisitionCheck();
    this.endbossManager.getDistanceBetweenEndbossAndCharacter();
  }

  /**
   * Initializes world references and animations for the main character.
   */
  setWorld() {
    this.endbossBar.hide();
    this.character.world = this;
    this.character.animate();
  }

  /**
   * Transitions the background music and state to the final fight mode.
   */
  changeToFinalFightSound() {
    this.finalFight = true;
    if (soundEnabled) {
      this.activateFinalBackgroundSound();
    }
  }

  /**
   * Plays the final background soundtrack with adjusted volume and loop settings.
   */
  activateFinalBackgroundSound() {
    basicBackgroundSound.pause();
    basicBackgroundSound.currentTime = 0;
    finalBackgroundSound.play();
    finalBackgroundSound.loop = true;
    finalBackgroundSound.volume = 0.05;
  }

  /**
   * Processes what happens when a bottle hits an enemy.
   * @param {Enemy} enemy - The enemy that was hit.
   */
  handleEnemyHit(enemy) {
    this.processChickenHit(enemy);
    this.processSmallChickenHit(enemy);
    this.processEndbossHit(enemy);
  }

  /**
   * Applies damage logic to the endboss enemy.
   * @param {Enemy} enemy - The enemy being processed (assumed to be Endboss).
   */
  processEndbossHit(enemy) {
    if (enemy instanceof Endboss) {
      this.endbossManager.hurtEndboss(this.endboss.hp);
    }
  }

  /**
   * Processes the hit logic for small chickens.
   * @param {Enemy} enemy - The small chicken enemy hit by a bottle.
   */
  processSmallChickenHit(enemy) {
    if (enemy instanceof SmallChicken) {
      this.playDeadChickenSound(enemy);
      this.chickenHandler.showDeadChicken(enemy, "./img/3_enemies_chicken/chicken_small/2_dead/dead.png");
      this.removeDeadChickenBody(enemy);
    }
  }

  /**
   * Processes the hit logic for regular chickens.
   * @param {Enemy} enemy - The chicken enemy hit by a bottle.
   */
  processChickenHit(enemy) {
    if (enemy instanceof Chicken) {
      this.playDeadChickenSound(enemy);
      this.chickenHandler.showDeadChicken(enemy, "./img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
      this.removeDeadChickenBody(enemy);
    }
  }

  /**
   * Removes a chicken enemy from the level after a delay.
   * @param {Enemy} enemy - The enemy to remove.
   */
  removeDeadChickenBody(enemy) {
    setTimeout(() => {
      const index = this.level.enemies.indexOf(enemy);
      if (index != -1) {
        this.level.enemies.splice(index, 1);
      }
    }, 5000);
  }

  /**
   * Plays the sound effect for the endboss being hurt.
   */
  playEndbossHurtSound() {
    this.chickenBossHurtSound.volume = soundEnabled ? 0.1 : 0;
    this.chickenBossHurtSound.play();
  }

  /**
   * Plays the death sound for a chicken enemy if it hasn't already died.
   * @param {Enemy} enemy - The chicken enemy.
   */
  playDeadChickenSound(enemy) {
    if (!enemy.isDead) {
      this.chickenHurtSound.volume = soundEnabled ? 0.1 : 0;
      this.chickenHurtSound.play();
    }
  }

  /**
   * Plays the sound effect for collecting a bottle.
   */
  playBottleCollectSound() {
    this.bottleCollectSound.volume = soundEnabled ? 0.1 : 0;
    this.bottleCollectSound.play();
  }

  /**
   * Draws all game elements onto the canvas for the current frame.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.addSceneryToMap();
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.collectableObjects);
    this.addBarsToMap();
    this.addObjectsToMap(this.level.enemies);
    this.addItemsToMap();

    this.ctx.translate(-this.camera_x, 0);

    this.addEndgameMessagesToMap();
    this.createDrawAnimationFrame();
  }

  /**
   * Adds the win/lose messages to the canvas.
   */
  addEndgameMessagesToMap() {
    this.addToMap(this.loseMessage);
    this.addToMap(this.winMessage);
  }

  /**
   * Adds collectable items (coins and throwable objects) to the canvas.
   */
  addItemsToMap() {
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.throwableObjects);
  }

  addSceneryToMap() {
    this.addObjectsToMap(this.level.backgroundObjects);

    this.addObjectsToMap(this.level.clouds);
  }

  /**
   * Draws UI status bars like health, weapon, and coin indicators.
   */
  addBarsToMap() {
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.healthBar);
    this.addToMap(this.weaponBar);
    this.addToMap(this.coinsBar);
    this.addToMap(this.endbossBar);
    this.ctx.translate(this.camera_x, 0);
  }

  /**
   * Continuously redraws the canvas using requestAnimationFrame.
   */
  createDrawAnimationFrame() {
    let self = this;
    let firstFrame = true;

    requestAnimationFrame(function draw() {
      self.draw();

      if (firstFrame) {
        firstFrame = false;
        // Set the loading flag to false after the first frame is drawn
        gameIsLoading = false;
      }
    });
  }

  /**
   * Adds multiple objects to the canvas.
   * @param {Array<Object>} objects - Array of drawable objects.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  /**
   * Draws a single object on the canvas, flipping it if it's facing the other direction.
   * @param {Object} object - The object to draw.
   */
  addToMap(object) {
    if (object.otherDirection) {
      this.flipImage(object);
    }
    object.draw(this.ctx);
    object.drawFrame(this.ctx);

    if (object.otherDirection) {
      this.flipImageBack(object);
    }
  }

  /**
   * Flips an object horizontally before drawing to simulate left-facing direction.
   * @param {Object} object - The object to flip.
   */
  flipImage(object) {
    this.ctx.save();
    this.ctx.translate(object.width, 0);
    this.ctx.scale(-1, 1);
    object.x = object.x * -1;
  }

  /**
   * Restores the original orientation after drawing a flipped object.
   * @param {Object} object - The object to restore.
   */
  flipImageBack(object) {
    this.ctx.restore();
    object.x = object.x * -1;
  }
}
