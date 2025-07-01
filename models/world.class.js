class World extends movableObject {
  character = new Character();
  weaponBar = new StatusBar(this, 0, "weapon");
  healthBar = new StatusBar(this, 45, "health");
  coinsBar = new StatusBar(this, 100, "coins");

  throwableObjects = [];
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  endboss;
  distanceCharacterEndboss;

  constructor(canvas, keyboard) {
    super();
    this.throwableManager = new ThrowableManager(this);
    this.coinCollector = new CoinCollector(this);
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.collidingEnemies = new Set();

    this.collidingCollectableBottle = new Set();
    this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    this.collidingEndboss = new Set();
    this.startCollisitionCheck();
    this.getDistanceBetweenEndbossAndCharacter();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  startCollisitionCheck() {
    setInterval(() => {
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
      this.didJumpOnChicken(enemy);
      if (!this.collidingEnemies.has(key) && !enemy.isDead) {
        this.character.hit(10);
        this.healthBar.setPercentage(this.character.healthTracker, this.healthBar.HEALTH_STATUS_IMAGES);
        this.collidingEnemies.add(key);
      }
    } else {
      this.collidingEnemies.delete(key);
    }
  }

  didJumpOnChicken(enemy) {
    if (enemy instanceof Chicken) {
      this.character.enemyWasJumpedOn = false;
      const characterBottom = this.character.y + this.character.height;
      const enemyTop = enemy.y + enemy.offset.top;

      if (this.character.speedY < 0 && characterBottom <= enemyTop + enemy.height / 2) {
        this.character.enemyWasJumpedOn = true;
        this.handleEnemyHit(enemy);
      }
    }
  }

  handleEnemyHit(enemy) {
    if (enemy instanceof Chicken) {
      this.showDeadChicken(enemy);
    }
    if (enemy instanceof Endboss) {
      this.endboss.hp -= 50;
      this.endboss.isHurt = true;
      this.hurtEndboss(this.endboss.hp);
    }
  }

  hurtEndboss(hp) {
    if (!this.endboss.isAttacking) {

      clearInterval(this.endboss.alertAndWalkingInterval);
      clearInterval(this.endboss.movingInterval);
      this.endboss.movingInterval = null;
      clearInterval(this.deadEndbossInterval);
      clearInterval(this.hurtEndbossInterval);
  
      this.endboss.currentImage = 0;
  
      if (hp <= 0) {
        this.endboss.hp = 0;
        this.deadEndbossInterval = setInterval(() => {
          this.endboss.playObjectAnimation(this.endboss.IMAGES_DEAD, true);
        }, 200);
        setTimeout(() => {
          this.endboss.hasDied = true; // ✅ set true here, just before removal
          const index = this.level.enemies.indexOf(this.endboss);
          if (index !== -1) {
            this.level.enemies.splice(index, 1);
          }
        }, this.endboss.IMAGES_DEAD.length * 300);
      } else {
        this.hurtEndbossInterval = setInterval(() => {
          this.endboss.playObjectAnimation(this.endboss.IMAGES_HURT, true);
        }, 200);
  
        setTimeout(() => {
          clearInterval(this.hurtEndbossInterval);
          this.endboss.currentImage = 0;
          this.endboss.isHurt = false;
          this.endboss.animate();
        }, this.endboss.IMAGES_HURT.length * 400);
      }

    }
  }

  showDeadChicken(enemy) {
    clearInterval(enemy.moveLeftInterval);
    clearInterval(enemy.walkingInterval);
    enemy.loadImage("./img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
    enemy.isDead = true;
    setTimeout(() => {
      const index = this.level.enemies.indexOf(enemy);
      this.level.enemies.indexOf(index, 1);
    }, 10000);
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

  getDistanceBetweenEndbossAndCharacter() {
    setInterval(() => {
      this.endboss.alertSituation = false;

      let characterX = this.character.x;
      let endbossX = this.endboss.x;
      this.distanceCharacterEndboss = Math.abs(characterX - endbossX);
      if (this.distanceCharacterEndboss <= 500) {
        this.endboss.alertSituation = true;
      }
      this.handleEndbossAttack();
    }, 50);
  }

  handleEndbossAttack() {
    if (this.distanceCharacterEndboss <= 250 && !this.endboss.isAttacking) {
      this.endboss.isAttacking = true;
      this.animateEndbossAttack();
    }
  }

  characterHitByEndboss() {
    if (this.distanceCharacterEndboss <= 400) {
      this.character.hit(20);
      this.character.playCharacterAnimation();
      this.healthBar.setPercentage(this.character.healthTracker, this.healthBar.HEALTH_STATUS_IMAGES);
    }
  }

  animateEndbossAttack() {
    clearInterval(this.endboss.alertAndWalkingInterval);
    clearInterval(this.endboss.movingInterval);
    this.endboss.movingInterval = null;
    clearInterval(this.hurtEndbossInterval);
    clearInterval(this.endbossAttackInterval);

    this.endboss.currentImage = 0;

    this.endbossAttackInterval = setInterval(() => {
      this.endboss.playObjectAnimation(this.endboss.IMAGES_ATTACK, true);
    }, 100);
    this.characterHitByEndboss();
    setTimeout(() => {
      this.endboss.isAttacking = false;
      this.endboss.animate()
    }, this.endboss.IMAGES_ATTACK.length * 200);
  }

}
