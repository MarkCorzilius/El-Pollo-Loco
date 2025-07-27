class CharacterController {
  constructor(character) {
    this.world = world;
    this.character = character;
  }

  /**
   * Starts interval to move character left and jump.
   */
  startMoveLeftAndJumpInterval() {
    this.characterMoveLeftInterval = setInterval(() => {
      gameIntervals.push(this.characterMoveLeftInterval);
      if (this.canMoveLeft()) {
        this.character.moveLeft();
      }
      if (this.canJump()) {
        this.character.jump();
      }
      this.character.world.camera_x = -this.character.world.character.x + 200;
    }, 1000 / 60);
  }

  /**
   * Starts interval to move character right.
   */
  startMoveRightInterval() {
    this.characterMoveRightInterval = setInterval(() => {
      gameIntervals.push(this.characterMoveRightInterval);
      if (this.canMoveRight()) {
        this.character.moveRight();
      }
      this.camera_x = this.character.x;
    }, 1000 / 60);
  }

  /**
   * Checks if character can move left.
   * @returns {boolean}
   */
  canMoveLeft() {
    return this.character.world.keyboard.LEFT && this.character.x > 0;
  }

  /**
   * Checks if character can move right.
   * @returns {boolean}
   */
  canMoveRight() {
    return this.character.world.keyboard.RIGHT && this.character.x < this.character.world.level.level_end_x;
  }

  /**
   * Checks if character can jump.
   * @returns {boolean}
   */
  canJump() {
    return this.character.world.keyboard.SPACE && !this.character.isAboveGround();
  }

  /**
   * Checks if character is not moving.
   * @returns {boolean}
   */
  isNotMoving() {
    return !this.character.world.keyboard.RIGHT && !this.character.world.keyboard.LEFT && !this.character.world.keyboard.SPACE;
  }

  /**
   * Checks if character should play walking animation.
   * @returns {boolean}
   */
  shouldAnimateWalk() {
    return this.character.world.keyboard.RIGHT || this.character.world.keyboard.LEFT;
  }
}
