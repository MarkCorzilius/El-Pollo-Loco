class World extends movableObject {
  character = new Character();
  healthBar = new StatusBar(this, 0, 10, "health");
  weaponBar = new StatusBar(this, 55, 10, "weapon");
  coinsBar = new StatusBar(this, 105, 10, "coins");
  endbossBar = new StatusBar(this, 10, 450, "endboss");

  characterHurtSound = new Audio('./audio/player-hurt.wav');
  chickenHurtSound = new Audio('./audio/chicken-clucking.short.mov');
  chickenBossHurtSound = new Audio('./audio/chicken.boss-hurt.mov');
  deadBossSound = new Audio('./audio/dead-boss.mov');
  bottleCollectSound = new Audio('./audio/bottle-collect.mp3');
  coinCollectSound = new Audio('./audio/coin-collect.mp3');
  gameWonSound = new Audio('./audio/win-sound.mov');
  gameLostSound = new Audio('./audio/lost-sound.mov');

  throwableObjects = [];

  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  endboss;
  endbossFightTime;

  constructor(canvas, keyboard, level) {
    super();
    this.level = level;
    this.throwableManager = new ThrowableManager(this);
    this.chickenHandler = new ChickenHandler(this);
    this.endbossManager = new EndbossManager(this);
    this.coinCollector = new CoinCollector(this);

    this.finalFight = false;

    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.loseMessage = new LoseMessage(this, this.canvas);
    this.winMessage = new WinMessage(this, this.canvas);

    this.draw();
    this.setWorld();

    this.level.enemies.forEach(enemy => {
      if (enemy instanceof Chicken || enemy instanceof SmallChicken){
        enemy.world = this;
        enemy.x = this.chickenHandler.generateValidX();
      }  
    });

    this.level.coins.forEach((coin) => {
      coin.world = this;
    })

    this.collidingEnemies = new Set();
    this.collidingCollectableBottle = new Set();
    this.collidingEndboss = new Set();

    this.endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    this.startCollisitionCheck();
    this.endbossManager.getDistanceBetweenEndbossAndCharacter();

    startGameOverCheckInterval();

  }

  setWorld() {
    this.endbossBar.hide();
    this.character.world = this;
    this.character.animate();
  }

  changeToFinalFightSound() {
    this.finalFight = true;
    if (soundEnabled) {
      basicBackgroundSound.pause();
      basicBackgroundSound.currentTime = 0;
      finalBackgroundSound.play();
      finalBackgroundSound.loop = true;
      finalBackgroundSound.volume = 0.05;
    }
  }


  startCollisitionCheck() {
    this.collisionCheckInterval = setInterval(() => {
      gameIntervals.push(this.collisionCheckInterval)
      this.level.enemies.forEach((enemy) => {
        this.handleEnemyCollisition(enemy);
        this.throwableManager.checkThrowObjects();
      });
      this.level.coins.forEach((coin, index) => {
        this.coinCollector.handleCoinCollisition(coin, index);
      });
      this.level.collectableObjects.forEach((collectableBottle, index) => {
        this.handleCollectableBottleCollisition(collectableBottle, index);
      });
      this.throwableManager.handleBottleAttack();
    }, 1000 / 60);
  }

  handleEnemyCollisition(enemy) {
    const key = enemy.id;
    if (this.character.isColliding(enemy)) {
      this.chickenHandler.didJumpOnChicken(enemy);
      if (!this.collidingEnemies.has(key) && !enemy.isDead) {
        this.character.hit(enemy.damage);
        this.healthBar.setPercentage(this.character.healthTracker, this.healthBar.HEALTH_STATUS_IMAGES);
        this.collidingEnemies.add(key);
      }
    } else {
      this.collidingEnemies.delete(key);
    }
  }

  handleEnemyHit(enemy) {
    if (enemy instanceof Chicken) {
      if (!enemy.isDead) {
        this.chickenHurtSound.volume = soundEnabled ? 0.5 : 0;
        this.chickenHurtSound.play();
      }
      this.chickenHandler.showDeadChicken(enemy, "./img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
    }
    if (enemy instanceof SmallChicken) {
      if (!enemy.isDead) {
        this.chickenHurtSound.volume = soundEnabled ? 0.5 : 0;
        this.chickenHurtSound.play();
      }
      this.chickenHandler.showDeadChicken(enemy, "./img/3_enemies_chicken/chicken_small/2_dead/dead.png");
    }
    if (enemy instanceof Endboss) {
      this.chickenBossHurtSound.volume = soundEnabled ? 0.5 : 0;
      this.chickenBossHurtSound.play();
      this.endbossManager.hurtEndboss(this.endboss.hp);
    }
  }

  handleCollectableBottleCollisition(bottle, index) {
    const key = bottle.id;
    if (this.character.isColliding(bottle)) {
      if (!this.collidingCollectableBottle.has(key)) {
        this.collectBottle(index);
        this.collidingCollectableBottle.add(key);
      }
    } else {
      this.collidingCollectableBottle.delete(key);
    }
  }

  collectBottle(index) {
    if (this.character.bottlesTracker >= 100) return;

    this.bottleCollectSound.volume = soundEnabled ? 0.5 : 0;
    this.bottleCollectSound.play();
    this.character.bottlesTracker += 20;
    this.level.collectableObjects.splice(index, 1);
    this.weaponBar.setPercentage(this.character.bottlesTracker, this.weaponBar.WEAPON_STATUS_IMAGES);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);

    this.addObjectsToMap(this.level.collectableObjects);

    this.addObjectsToMap(this.level.clouds);

    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.healthBar);
    this.addToMap(this.weaponBar);
    this.addToMap(this.coinsBar);
    this.addToMap(this.endbossBar);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.enemies);

    this.addObjectsToMap(this.level.coins);

    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.loseMessage);
    this.addToMap(this.winMessage);

    let self = this;
    requestAnimationFrame(function draw() {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

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

  flipImage(object) {
    this.ctx.save();
    this.ctx.translate(object.width, 0);
    this.ctx.scale(-1, 1);
    object.x = object.x * -1;
  }

  flipImageBack(object) {
    this.ctx.restore();
    object.x = object.x * -1;
  }
}
