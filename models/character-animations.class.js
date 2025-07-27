class CharacterAnimations {
  lastAnimationTime = 0;
  animationInterval = 100;
  idleStartTime;
  resetIdleImage = false;

  constructor(character) {
    this.character = character;
    this.isLongIdle = false;
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
   * Plays the appropriate animation based on character state.
   */
  updateCharacterAnimation(currentTime) {
    if (currentTime - this.lastAnimationTime < this.animationInterval) {
      return;
    }
    this.lastAnimationTime = currentTime;
    if (!gameIsOver) {
      this.selectCharacterAnimation();
    }
  }

  /**
   * Selects and plays the appropriate character animation based on current state flags.
   * Resets idle animation states where applicable and handles death animation playback once.
   */
  selectCharacterAnimation() {
    let { isDead, isHurt, isJumping, isWalking, isIdle } = this.createAnimationFlags();

    if (isDead) {
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
      this.character.prepareIdleImageReset();
      this.playIdleAnimation();
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
    const isDead = this.character.world.character.isDead();
    const isHurt = this.character.isHurt();
    const isJumping = this.character.isAboveGround();
    const isWalking = this.character.characterController.shouldAnimateWalk();
    const isIdle = this.character.characterController.isNotMoving();

    return { isDead, isHurt, isJumping, isWalking, isIdle };
  }

  /**
   * Plays the walking animation sequence.
   */
  playWalkAnimation() {
    this.character.setAnimation(this.character.IMAGES_WALKING, 60, false);
  }

  /**
   * Plays the jumping animation sequence with variable speed.
   * Calls decideAnimationSpeedForJump to adjust speed before playing.
   */
  playJumpAnimation() {
    this.character.decideAnimationSpeedForJump();
    this.character.setAnimation(this.character.IMAGES_JUMPING, this.animationSpeed, false);
  }

  /**
   * Plays the hurt animation sequence.
   */
  playHurtAnimation() {
    this.character.setAnimation(this.character.IMAGES_HURT, 200, true);
  }

  /**
   * Initiates the death animation sequence for the character.
   * Sets the animation to play once and marks the game as lost.
   * Ensures the death sequence is only triggered once.
   */
  playDeathAnimation() {
    this.character.setAnimation(this.character.IMAGES_DEAD, 150, true);
    gameLost = true;
    if (!this.deathAnimationPlaying) {
      this.deathAnimationPlaying = true;
      this.scheduleGameOverAfterDeath();
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
    this.character.img = this.character.imageCache[this.character.IMAGES_IDLE[0]];
    this.resetIdleImage = false;
  }

  /**
   * Plays the long idle animation sequence.
   * Does not loop through reset idle image flag.
   */
  playLongIdleCycle() {
    this.character.playObjectAnimation(this.character.IMAGES_LONG_IDLE, false);
  }

  /**
   * Plays the normal idle animation sequence.
   * Sets the flag to reset the idle image and switches to long idle after 5 seconds.
   */
  playIdleCycle() {
    this.resetIdleImage = true;
    this.character.playObjectAnimation(this.character.IMAGES_IDLE, true);
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
   * Schedules the game-over logic to be executed after the death animation finishes.
   * Adds the timeout to the gameTimeouts array for tracking.
   * Calls the method to update post-death state flags.
   */
  scheduleGameOverAfterDeath() {
    this.deathAnimationTimeOut = setTimeout(() => {
      this.deathAnimationPlaying = true;
      gameTimeouts.push(this.deathAnimationTimeOut);
      this.character.setAfterDeathAnimationStates();
      startGameOverCheckInterval();
    }, this.character.IMAGES_DEAD.length * 160);
  }
}
