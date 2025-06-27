class ThrowableObjects extends movableObject {
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
}
