class Character extends movableObject {
  height = 200;
  width = 130;
  y = 225;
  x = 100;
  pushXSpeed = -8;
  floorY = 225;

  IMAGES_WALKING = [
    "./img/2_character_pepe/2_walk/W-22.png",
    "./img/2_character_pepe/2_walk/W-23.png",
    "./img/2_character_pepe/2_walk/W-21.png",
    "./img/2_character_pepe/2_walk/W-24.png",
    "./img/2_character_pepe/2_walk/W-25.png",
    "./img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "./img/2_character_pepe/3_jump/J-31.png",
    "./img/2_character_pepe/3_jump/J-32.png",
    "./img/2_character_pepe/3_jump/J-33.png",
    "./img/2_character_pepe/3_jump/J-34.png",
    "./img/2_character_pepe/3_jump/J-35.png",
    "./img/2_character_pepe/3_jump/J-36.png",
    "./img/2_character_pepe/3_jump/J-37.png",
    "./img/2_character_pepe/3_jump/J-38.png",
    "./img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "./img/2_character_pepe/5_dead/D-51.png",
    "./img/2_character_pepe/5_dead/D-52.png",
    "./img/2_character_pepe/5_dead/D-53.png",
    "./img/2_character_pepe/5_dead/D-54.png",
    "./img/2_character_pepe/5_dead/D-55.png",
    "./img/2_character_pepe/5_dead/D-56.png",
    "./img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = ["./img/2_character_pepe/4_hurt/H-41.png", "./img/2_character_pepe/4_hurt/H-42.png", "./img/2_character_pepe/4_hurt/H-43.png"];

  world;
  speed = 6;

  offset = {
    top: 100,
    bottom: 12,
    left: 35,
    right: 44,
  };
  enemyWasJumpedOn;

  constructor() {
    super();
    this.loadImage("./img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadMovementSprites(this.IMAGES_WALKING);
    this.loadMovementSprites(this.IMAGES_JUMPING);
    this.loadMovementSprites(this.IMAGES_DEAD);
    this.loadMovementSprites(this.IMAGES_HURT);
    this.applyGravity();
  }

  animate() {
    this.startMoveRightInterval();
    this.startMoveLeftAndJumpInterval();
    this.playCharacterAnimation();
  }

  startMoveLeftAndJumpInterval() {
    this.characterMoveLeftInterval = setInterval(() => {
      gameIntervals.push(this.characterMoveLeftInterval);
      if (this.canMoveLeft()) {
        this.moveLeft();
      }
      if (this.canJump()) {
        this.jump();
      }
      this.world.camera_x = -this.x + 200;
    }, 1000 / 60);
  }

  startMoveRightInterval() {
    this.characterMoveRightInterval = setInterval(() => {
      gameIntervals.push(this.characterMoveRightInterval);
      if (this.isNotMoving()) {
        this.loadImage("./img/2_character_pepe/1_idle/idle/I-1.png");
      }
      if (this.canMoveRight()) {
        this.moveRight();
      }
      this.world.camera_x = this.x;
    }, 1000 / 60);
  }

  shouldAnimateWalk() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }
  
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }
  
  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }
  
  canJump() {
    return this.world.keyboard.SPACE && !this.isAboveGround();
  }
  
  isNotMoving() {
    return !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.world.keyboard.SPACE;
  }

  playCharacterAnimation() {
    this.characterAnimationInterval = setInterval(() => {
      gameIntervals.push(this.characterAnimationInterval);
      if (this.isDead()) {
        this.handleDeathAnimation();
      } else if (this.isHurt()) {
        this.playObjectAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playObjectAnimation(this.IMAGES_JUMPING);
      } else if (this.shouldAnimateWalk()) {
        this.playObjectAnimation(this.IMAGES_WALKING);
      }
    }, 1000 / 60);
  }

  handleDeathAnimation() {
    this.playObjectAnimation(this.IMAGES_DEAD, true);
    gameLost = true;
    this.deathAnimationTimeOut = setTimeout(() => {
      gameTimeouts.push(this.deathAnimationTimeOut);
      playerIsDead = true;
      gameIsOver = true;
    }, this.IMAGES_DEAD.length * 50);
  }

  
  jump() {
    this.speedY = 22;
  }
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  pushCharacterAway() {
    clearInterval(this.world.gravityInterval);

    this.startPushAwayInterval();
  }

  startPushAwayInterval() {
    this.speedY = 18;
    this.pushAwayInterval = setInterval(() => {
      gameIntervals.push(this.pushAwayInterval);
      this.updatePushAwayConditions();
      this.handlePushAwayLanding();
    }, 1000 / 60);
  }

  updatePushAwayConditions() {
    this.x += this.pushXSpeed;
    this.y -= this.speedY;
    this.speedY -= 0.7;
  }

  handlePushAwayLanding() {
    if (this.y > this.floorY) {
      this.y = this.floorY;
      this.speedY = 0;
      clearInterval(this.pushAwayInterval);
      this.world.applyGravity();
    }
  }
}
