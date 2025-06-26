class World extends movableObject {
  character = new Character();
  weaponBar = new StatusBar(this, 0, "weapon");
  healthBar = new StatusBar(this, 45, "health");
  coinsBar = new StatusBar(this, 100, "coins");

  throwableObjects = [new ThrowableObjects()];
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  lastBottle = 0;

  constructor(canvas, keyboard) {
    super();
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.collidingEnemies = new Set();
    this.collidingCoins = new Set();
    this.collidingBottleHit = new Set();
    this.startCollisitionCheck();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  startCollisitionCheck() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        this.handleEnemyCollisition(enemy);
        this.checkThrowObjects();
      });
      this.level.coins.forEach((coin, index) => {
        this.handleCoinCollisition(coin, index);
      });
      this.handleBottleAttack();
    }, 1000 / 60);
  }

  checkThrowObjects() {
    const now = new Date().getTime();
    if (this.keyboard.D && now - this.lastBottle > 1500 && this.character.bottlesTracker > 0) {
      let bottle = new ThrowableObjects(this.character.x + 100, this.character.y + 50);
      this.throwableObjects.push(bottle);
      this.lastBottle = now;
      this.character.bottlesTracker -= 20;
      this.weaponBar.setPercentage(this.character.bottlesTracker, this.weaponBar.WEAPON_STATUS_IMAGES);
    }
  }

  handleEnemyCollisition(enemy) {
    const key = enemy.id;
    if (this.character.isColliding(enemy)) {
      if (!this.collidingEnemies.has(key)) {
        this.character.hit();
        this.healthBar.setPercentage(this.character.healthTracker, this.healthBar.HEALTH_STATUS_IMAGES);
        this.collidingEnemies.add(key);
      }
    } else {
      this.collidingEnemies.delete(key);
    }
  }

  // if hit one of the enemies –> stop;
  // play animation of the bottle hit.

  handleBottleAttack() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        const key = enemy.id;
        if (bottle.isColliding(enemy)) {
          if (!this.collidingBottleHit.has(key)) {
            this.bottleHit(bottle);
            this.collidingBottleHit.add(key);
          }
        } else {
          this.collidingBottleHit.delete(key);
        }
      });
    });
  }

  bottleHit(bottle) {
    bottle.gravityDisabled = true;
    console.log(bottle.gravityDisabled)
    this.playBottleHitAnimation(bottle);
  }

  playBottleHitAnimation(bottle) {
    console.log(bottle.BOTTLE_SPLASH_IMAGES);
    setInterval(() => {
      bottle.playObjectAnimation(bottle.BOTTLE_SPLASH_IMAGES);
    }, 25);
  }

  handleCoinCollisition(coin, index) {
    const key = coin.id;
    if (this.character.isColliding(coin)) {
      if (!this.collidingCoins.has(key)) {
        this.increaseCoinBar();
        this.deleteCoinFromUI(index);
        this.collidingCoins.add(key);
      }
    } else {
      this.collidingCoins.delete(key);
    }
  }

  increaseCoinBar() {
    this.character.coinsTracker += 20;
    if (this.character.coinsTracker >= 100) {
      this.character.coinsTracker = 100;
    }
    this.coinsBar.setPercentage(this.character.coinsTracker, this.coinsBar.COINS_STATUS_IMAGES);
  }

  deleteCoinFromUI(index) {
    this.level.coins.splice(index, 1);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);

    this.addObjectsToMap(this.level.clouds);

    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.healthBar);
    this.addToMap(this.weaponBar);
    this.addToMap(this.coinsBar);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.enemies);

    this.addObjectsToMap(this.level.coins);

    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

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
