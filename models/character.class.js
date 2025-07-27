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
  pushXSpeed = -15;
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

  characterController = new CharacterController(this);
  characterAnimations = new CharacterAnimations(this);

  speed = 6;

  offset = {
    top: 90,
    bottom: 12,
    left: 35,
    right: 44,
  };
  enemyWasJumpedOn;
  animationSpeed = 80;

  elapsed;

  healthTracker = 100;

  /**
   * Initializes the character with default position, size,
   * sprite images, and starts gravity.
   */
  constructor() {
    super();
    this.deathAnimationPlayed = false;
    this.deathAnimationPlaying = false;
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
    this.characterController.startMoveRightInterval();
    this.characterController.startMoveLeftAndJumpInterval();
  }

  /**
   * Sets the reset flag for the idle image if idle just started.
   */
  prepareIdleImageReset() {
    if (!this.characterAnimations.idleStartTime) {
      this.characterAnimations.resetIdleImage = true;
    }
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
   * Sets the game state flags to reflect the character's death.
   * Marks the player as dead, ends the game, and clears the dying state flag.
   */
  setAfterDeathAnimationStates() {
    playerIsDead = true;
    gameIsOver = true;
    this.isDying = false;
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
      this.applyGravity();
    }
  }

  /**
   * Reduces health based on damage.
   * @param {number} damage
   */
  applyDamage(damage) {
    this.healthTracker -= damage;
    if (this.healthTracker <= 0) {
      this.healthTracker = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object is dead (health <= 0).
   * @returns {boolean}
   */
  isDead() {
    return this.healthTracker <= 0;
  }
}
