class ThrowableObjects extends movableObject {

  bottleThrowSound = new Audio('./img/bottle-throw.mov');

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
    this.x = x;
    this.y = y;
    this.speedY = 15;
    this.bottleThrowSound.volume = soundEnabled ? 0.5 : 0;
    this.bottleThrowSound.play();
    if (character.otherDirection) {
      this.throwLeft();
    } else {
      this.throwRight();
    }
  }

  throwLeft() {
    this.rotationInterval = setInterval(() => {
      this.playObjectAnimation(this.BOTTLE_ROTATION_IMAGES);
    }, 50);

    this.applyGravity();
    this.gravityInterval = setInterval(() => {
      if (this.gravityDisabled) return;
      this.x -= 15;
    }, 25);
  }

  throwRight() {
    this.rotationInterval = setInterval(() => {
      this.playObjectAnimation(this.BOTTLE_ROTATION_IMAGES);
    }, 50);

    this.applyGravity();
    this.gravityInterval = setInterval(() => {
      if (this.gravityDisabled) return;
      this.x += 15;
    }, 25);
  }

  checkGroundImpact() {
    if (this instanceof ThrowableObjects && this.y >= 380 && !this.hasExploded) {
      this.hasExploded = true;
      if (this.world && typeof this.world.throwableManager.bottleHit === "function") {
        this.world.throwableManager.bottleHit(this, this.world.throwableObjects.indexOf(this));
        }
      }
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
    setInterval(() => {
      this.world.throwableObjects.forEach(bottle => {
        bottle.checkGroundImpact();
      });  
    }, 60);

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
