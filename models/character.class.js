/**
 * Represents the main game character with movement, animation,
 * jumping, and interaction capabilities.
 * Extends movableObject.
 */
class Character extends movableObject {
  height = 200;
  width = 130;
  y = 225;
  x = 100;
  pushXSpeed = -8;
  floorY = 225;

  IMAGES_LONG_IDLE = [
    "./img/2_character_pepe/1_idle/long_idle/I-11.png",
    "./img/2_character_pepe/1_idle/long_idle/I-12.png",
    "./img/2_character_pepe/1_idle/long_idle/I-13.png",
    "./img/2_character_pepe/1_idle/long_idle/I-14.png",
    "./img/2_character_pepe/1_idle/long_idle/I-15.png",
    "./img/2_character_pepe/1_idle/long_idle/I-16.png",
    "./img/2_character_pepe/1_idle/long_idle/I-17.png",
    "./img/2_character_pepe/1_idle/long_idle/I-18.png",
    "./img/2_character_pepe/1_idle/long_idle/I-19.png",
    "./img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_IDLE = [
    "./img/2_character_pepe/1_idle/idle/I-1.png",
    "./img/2_character_pepe/1_idle/idle/I-2.png",
    "./img/2_character_pepe/1_idle/idle/I-3.png",
    "./img/2_character_pepe/1_idle/idle/I-4.png",
    "./img/2_character_pepe/1_idle/idle/I-5.png",
    "./img/2_character_pepe/1_idle/idle/I-6.png",
    "./img/2_character_pepe/1_idle/idle/I-7.png",
    "./img/2_character_pepe/1_idle/idle/I-8.png",
    "./img/2_character_pepe/1_idle/idle/I-9.png",
    "./img/2_character_pepe/1_idle/idle/I-10.png",
  ];

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
    //"./img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = ["./img/2_character_pepe/4_hurt/H-41.png", "./img/2_character_pepe/4_hurt/H-42.png", "./img/2_character_pepe/4_hurt/H-43.png"];

  world;
  speed = 6;

  offset = {
    top: 90,
    bottom: 12,
    left: 35,
    right: 44,
  };
  enemyWasJumpedOn;

  lastAnimationTime = 0;
  animationInterval = 100;
  animationSpeed = 80;

  idleStartTime;
  elapsed;

  resetIdleImage = false;

  /**
   * Initializes the character with default position, size,
   * sprite images, and starts gravity.
   */
  constructor() {
    super();
    this.isLongIdle = false;
    this.deathAnimationPlayed = false;
    this.appliedDamage = 25;
    this.loadImage("./img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadMovementSprites(this.IMAGES_IDLE);
    this.loadMovementSprites(this.IMAGES_LONG_IDLE);
    this.loadMovementSprites(this.IMAGES_WALKING);
    this.loadMovementSprites(this.IMAGES_JUMPING);
    this.loadMovementSprites(this.IMAGES_DEAD);
    this.loadMovementSprites(this.IMAGES_HURT);
    this.applyGravity();
  }

  /**
   * Starts character animation and movement intervals.
   */
  animate() {
    this.startMoveRightInterval();
    this.startMoveLeftAndJumpInterval();
  }

  /**
   * Starts interval to move character left and jump.
   */
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

  /**
   * Starts interval to move character right.
   */
  startMoveRightInterval() {
    this.characterMoveRightInterval = setInterval(() => {
      gameIntervals.push(this.characterMoveRightInterval);
      if (this.canMoveRight()) {
        this.moveRight();
      }
      this.world.camera_x = this.x;
    }, 1000 / 60);
  }

  /**
   * Manages the character's idle animation state.
   * Initializes idle timing, optionally resets the idle image during
   * the first 3 seconds, and chooses between short and long idle animations.
   */
  playIdleAnimation() {
    this.initializeIdleStart();

    this.elapsed = performance.now() - this.idleStartTime;
    this.maybeResetIdleImage();

    if (this.isLongIdle) {
      this.playLongIdleCycle();
    } else {
      this.playIdleCycle();
    }
  }

  /**
   * Resets the character's image to the first idle frame if within
   * the initial 3 seconds of idling and the reset flag is set.
   * Prevents animation from starting too early and avoids flickering.
   */
  maybeResetIdleImage() {
    if (this.elapsed < 3000) {
      if (this.resetIdleImage) {
        this.setDefaultCharacterImage();
      }
      return;
    }
  }

  /**
   * Sets the character's image to the first idle frame and clears
   * the reset flag. Used to ensure a stable starting frame for idle.
   */
  setDefaultCharacterImage() {
    this.img = this.imageCache[this.IMAGES_IDLE[0]];
    this.resetIdleImage = false;
  }

  /**
   * Plays the long idle animation sequence.
   * Does not loop through reset idle image flag.
   */
  playLongIdleCycle() {
    this.playObjectAnimation(this.IMAGES_LONG_IDLE, false);
  }

  /**
   * Plays the normal idle animation sequence.
   * Sets the flag to reset the idle image and switches to long idle after 5 seconds.
   */
  playIdleCycle() {
    this.resetIdleImage = true;
    this.playObjectAnimation(this.IMAGES_IDLE, true);
    if (this.elapsed > 5000) {
      this.isLongIdle = true;
    }
  }

  /**
   * Initializes the idle animation start time and sets the initial image if not already initialized.
   */
  initializeIdleStart() {
    if (!this.idleStartTime) {
      this.idleStartTime = performance.now();

      this.currentImage = 0;
    }
  }

  /**
   * Resets the idle animation state and clears any pending long idle timeout.
   */
  resetIdleAnimationStates() {
    this.idleStartTime = null;
    this.isLongIdle = false;
    if (this.resetIdleImage) {
      this.currentImage = 0;
      this.resetIdleImage = false;
    }
  }

  /**
   * Checks if character should play walking animation.
   * @returns {boolean}
   */
  shouldAnimateWalk() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Checks if character can move left.
   * @returns {boolean}
   */
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  /**
   * Checks if character can move right.
   * @returns {boolean}
   */
  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }

  /**
   * Checks if character can jump.
   * @returns {boolean}
   */
  canJump() {
    return this.world.keyboard.SPACE && !this.isAboveGround();
  }

  /**
   * Checks if character is not moving.
   * @returns {boolean}
   */
  isNotMoving() {
    return !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.world.keyboard.SPACE;
  }

  /**
   * Plays the appropriate animation based on character state.
   */
  updateCharacterAnimation(currentTime) {
    if (currentTime - this.lastAnimationTime < this.animationInterval) {
      return;
    }
    this.lastAnimationTime = currentTime;

    this.selectCharacterAnimation();
  }

  /**
   * Selects and plays the appropriate character animation based on current state flags.
   * Resets idle animation states where applicable and handles death animation playback once.
   */
  selectCharacterAnimation() {
    let { isDead, isHurt, isJumping, isWalking, isIdle } = this.createAnimationFlags();

    if (isDead && !this.deathAnimationPlayed) {
      this.resetIdleAnimationStates();
      this.playDeathAnimation();
    } else if (isHurt) {
      this.resetIdleAnimationStates();
      this.playHurtAnimation();
    } else if (isJumping) {
      this.resetIdleAnimationStates();
      this.playJumpAnimation();
    } else if (isWalking) {
      this.resetIdleAnimationStates();
      this.playWalkAnimation();
    } else if (isIdle) {
      this.prepareIdleImageReset();
      this.playIdleAnimation();
    }
  }

  /**
   * Sets the reset flag for the idle image if idle just started.
   */
  prepareIdleImageReset() {
    if (!this.idleStartTime) {
      this.resetIdleImage = true;
    }
  }

  /**
   * Computes the character's animation state flags based on current inputs and conditions.
   *
   * @returns {Object} Object containing boolean flags:
   * - isDead: whether the character is dead
   * - isHurt: whether the character is hurt
   * - isJumping: whether the character is currently above ground (jumping)
   * - isWalking: whether the character is currently moving left or right
   * - isIdle: whether the character is standing still (no movement input)
   */
  createAnimationFlags() {
    const isDead = this.isDead();
    const isHurt = this.isHurt();
    const isJumping = this.isAboveGround();
    const isWalking = this.shouldAnimateWalk();
    const isIdle = this.isNotMoving();

    return { isDead, isHurt, isJumping, isWalking, isIdle };
  }

  /**
   * Determines the animation speed for jumping based on movement keys pressed.
   * Sets a faster animation speed if moving left or right, slower otherwise.
   */
  decideAnimationSpeedForJump() {
    if (this.world.keyboard.LEFT || this.world.keyboard.RIGHT) {
      this.animationSpeed = 85;
    } else {
      this.animationSpeed = 100;
    }
  }

  /**
   * Plays the walking animation sequence.
   */
  playWalkAnimation() {
    this.setAnimation(this.IMAGES_WALKING, 60, false);
  }

  /**
   * Plays the jumping animation sequence with variable speed.
   * Calls decideAnimationSpeedForJump to adjust speed before playing.
   */
  playJumpAnimation() {
    this.decideAnimationSpeedForJump();
    this.setAnimation(this.IMAGES_JUMPING, this.animationSpeed, false);
  }

  /**
   * Plays the hurt animation sequence.
   */
  playHurtAnimation() {
    this.setAnimation(this.IMAGES_HURT, 60, true);
  }

  /**
   * Starts the death animation and triggers game over logic after it finishes.
   * Marks the death animation as played to prevent replay.
   */
  playDeathAnimation() {
    this.setAnimation(this.IMAGES_DEAD, 120, true);
    gameLost = true;
    this.deathAnimationTimeOut = setTimeout(() => {
      gameTimeouts.push(this.deathAnimationTimeOut);
      this.deathAnimationPlayed = true;
      playerIsDead = true;
      gameIsOver = true;
      startGameOverCheckInterval();
    }, this.IMAGES_DEAD.length * 200);
  }

  /**
   * Makes the character jump by setting vertical speed.
   */
  jump() {
    this.speedY = 22;
  }

  /**
   * Moves the character to the right.
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Moves the character to the left.
   */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  /**
   * Starts the push away effect when character is hit.
   */
  pushCharacterAway() {
    clearInterval(this.world.gravityInterval);

    this.startPushAwayInterval();
  }

  /**
   * Starts the interval to handle the push away movement.
   */
  startPushAwayInterval() {
    this.speedY = 18;
    this.pushAwayInterval = setInterval(() => {
      gameIntervals.push(this.pushAwayInterval);
      this.updatePushAwayConditions();
      this.handlePushAwayLanding();
    }, 1000 / 60);
  }

  /**
   * Updates character position and speed during push away.
   */
  updatePushAwayConditions() {
    this.x += this.pushXSpeed;
    this.y -= this.speedY;
    this.speedY -= 0.7;
  }

  /**
   * Handles landing after push away effect ends.
   */
  handlePushAwayLanding() {
    if (this.y > this.floorY) {
      this.y = this.floorY;
      this.speedY = 0;
      clearInterval(this.pushAwayInterval);
      this.world.applyGravity();
    }
  }
}
