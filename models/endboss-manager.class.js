/**
 * Manages the logic, damage handling, direction, and animations of the Endboss.
 */
class EndbossManager extends movableObject {
  attackTimeout = false;
  acceleration = 2;
  speedY = 14;
  jumpXSpeed = -10;
  floorY = 120;
  jumpCounter = 0;
  jumpLimit = 1;

  /**
   * Creates an instance of EndbossManager to control endboss behavior.
   * @param {World} world - The game world containing all game objects and logic.
   */
  constructor(world) {
    super();
    this.world = world;
    this.distanceCharacterEndboss = 0;
    this.startDecidingEndbossDirection();
  }

  /**
   * Initiates the endboss jump attack if it hasn't already been performed.
   * Clears gravity and starts the jump interval.
   */
  handleJumpAttack() {
    if (this.jumpCounter < this.jumpLimit) {
      clearInterval(this.gravityInterval);
      this.startEndbossJumpInterval();
      this.jumpCounter++;
    }
  }

  /**
   * Starts an interval that updates the endboss's position to simulate a jump.
   * Runs at 60 FPS and checks for landing.
   */
  startEndbossJumpInterval() {
    this.endbossJumpInterval = setInterval(() => {
      gameIntervals.push(this.endbossJumpInterval);
      this.updateEndbossJumpConditions();
      this.handleEnbossLanding();
    }, 1000 / 60);
  }

  /**
   * Updates the endboss's x and y coordinates during the jump.
   * Simulates upward motion with decreasing vertical speed (gravity effect).
   */
  updateEndbossJumpConditions() {
    this.world.endboss.x += this.jumpXSpeed;
    this.world.endboss.y -= this.speedY;
    this.speedY -= 0.7;
  }

  /**
   * Handles the endboss landing when reaching the ground level.
   * Stops the jump interval, resets vertical speed, and re-applies gravity.
   */
  handleEnbossLanding() {
    if (this.world.endboss.y > this.floorY) {
      this.world.endboss.y = this.floorY;
      this.speedY = 14;
      clearInterval(this.endbossJumpInterval);
      this.world.applyGravity();
    }
  }

  /**
   * Hurts the endboss, handles death, or triggers hurt animations.
   */
  hurtEndboss() {
    this.reduceEndbossHpAndSetHurt();
    this.updateEnbossHealthBar();
    this.handleEndbossAfterHit();
  }

  /**
   * Handles hurt or death state after taking damage.
   * @param {number} hp - Current HP after damage.
   */
  handleEndbossAfterHit() {
    if (!this.world.endbossBar.isAttacking) {
      this.stopEndbossAnimations();
      if (this.world.endboss.hp <= 0) {
        this.playDeathAnimation();
        this.removeEndbossFromLevel();
      } else {
        this.playHurtAnimation();
        this.resetAndResumeAnimation();
        this.world.endboss.speed += 0.4;
      }
    }
  }

  /**
   * Updates the health bar based on current HP.
   */
  updateEnbossHealthBar() {
    this.world.endbossBar.setPercentage(this.world.endboss.hp, this.world.endbossBar.ENDBOSS_STATUS_IMAGES);
  }

  /**
   * Reduces endboss HP and sets it to hurt state.
   */
  reduceEndbossHpAndSetHurt() {
    this.world.endboss.hp -= this.world.character.appliedDamage;
    this.world.endboss.isHurt = true;
  }

  /**
   * Removes the endboss from the level after death.
   */
  removeEndbossFromLevel() {
    setTimeout(() => {
      this.world.endboss.hasDied = true;
      const index = this.world.level.enemies.findIndex((enemy) => enemy instanceof Endboss);
      this.world.level.enemies.splice(index, 1);
    }, this.world.endboss.IMAGES_DEAD.length * 300);
  }

  /**
   * Plays death animation and handles game over flags.
   */
  playDeathAnimation() {
    this.world.endboss.hp = 0;
    this.playEndbossDeathSound();
    this.startDeadEndbossInterval();
    setTimeout(() => {
      this.setEndGameFlags();
    }, this.world.endboss.IMAGES_DEAD.length * 400);
  }

  /**
   * Sets global end-game flags.
   */
  setEndGameFlags() {
    endbossIsDead = true;
    gameIsOver = true;
    startGameOverCheckInterval();
  }

  /**
   * Starts the dead animation interval.
   */
  startDeadEndbossInterval() {
    this.world.deadEndbossInterval = setInterval(() => {
      gameIntervals.push(this.world.deadEndbossInterval);
      this.world.endboss.playObjectAnimation(this.world.endboss.IMAGES_DEAD, true);
    }, 200);
  }

  /**
   * Plays endboss death sound.
   */
  playEndbossDeathSound() {
    this.world.deadBossSound.volume = soundEnabled ? 0.2 : 0;
    this.world.deadBossSound.play();
  }

  /**
   * Plays the hurt animation repeatedly.
   */
  playHurtAnimation() {
    this.world.playEndbossHurtSound();
    this.world.hurtEndbossInterval = setInterval(() => {
      gameIntervals.push(this.world.hurtEndbossInterval);
      this.world.endboss.playObjectAnimation(this.world.endboss.IMAGES_HURT, true);
    }, 200);
  }

  /**
   * Resets hurt animation and resumes idle animation.
   */
  resetAndResumeAnimation() {
    setTimeout(() => {
      clearInterval(this.world.hurtEndbossInterval);
      this.world.endboss.currentImage = 0;
      this.world.endboss.isHurt = false;
      this.world.endboss.animate();
    }, this.world.endboss.IMAGES_HURT.length * 100);
  }

  /**
   * Begins tracking the distance between character and endboss.
   */
  getDistanceBetweenEndbossAndCharacter() {
    this.distanceCharacterEndbossInterval = setInterval(() => {
      gameIntervals.push(this.distanceCharacterEndbossInterval);
      this.updateDistanceCharacterEndboss();
      this.checkIfCharacterSpotted();
      this.handleEndbossAttack();
    }, 50);
  }

  /**
   * Marks character as spotted if close enough.
   */
  checkIfCharacterSpotted() {
    if (this.distanceCharacterEndboss <= 500) {
      hasSpotedCharacter = true;
    }
  }

  /**
   * Updates the distance between character and endboss.
   */
  updateDistanceCharacterEndboss() {
    let characterCenter = this.calculateCenterX(this.world.character);
    let endbossCenter = this.calculateCenterX(this.world.endboss);
    this.distanceCharacterEndboss = Math.abs(characterCenter - endbossCenter);
  }

  /**
   * Calculates the center X coordinate of an object.
   * @param {Object} object
   * @returns {number}
   */
  calculateCenterX(object) {
    return object.x + object.width / 2;
  }

  /**
   * Triggers endboss attack if within attack range.
   */
  handleEndbossAttack() {
    if (this.distanceCharacterEndboss <= 150 && !this.world.endboss.isAttacking) {
      this.world.endboss.isAttacking = true;
      this.animateEndbossAttack();
    }
  }

  /**
   * Applies damage and knockback to character if close.
   */
  characterHitByEndboss() {
    if (this.distanceCharacterEndboss <= 200) {
      this.world.character.hit(this.world.endboss.damage);
      this.world.character.pushCharacterAway();
      this.world.healthBar.setPercentage(this.world.character.healthTracker, this.world.healthBar.HEALTH_STATUS_IMAGES);
    }
  }

  /**
   * Plays attack animation and resumes idle afterward.
   */
  animateEndbossAttack() {
    this.stopEndbossAnimations();
    this.startAttackAnimation();
    this.characterHitByEndboss();
    this.resumeIdleAnimation();
  }

  /**
   * Starts the attack animation interval.
   */
  startAttackAnimation() {
    this.startAttackInterval();

    setTimeout(() => {
      this.stopAttackInterval();
    }, this.world.endboss.IMAGES_ATTACK.length * 50); // problem
  }

  /**
   * Stops the current attack animation interval.
   */
  stopAttackInterval() {
    clearInterval(this.endbossAttackInterval);
    this.attackTimeout = false;
  }

  /**
   * Starts repeating the attack animation.
   */
  startAttackInterval() {
    if (!this.attackTimeout) {
      this.attackTimeout = true;
      this.endbossAttackInterval = setInterval(() => {
        gameIntervals.push(this.endbossAttackInterval);
        this.world.endboss.playObjectAnimation(this.world.endboss.IMAGES_ATTACK, true);
      }, 1000 / 60);
    }
  }

  /**
   * Resumes idle animation after attack ends.
   */
  resumeIdleAnimation() {
    setTimeout(() => {
      this.resetEndbossStates();
      this.world.endboss.animate();
    }, this.world.endboss.IMAGES_ATTACK.length * 50);
  }

  /**
   * Resets attacking and hurt states.
   */
  resetEndbossStates() {
    this.world.endboss.isAttacking = false;
    this.world.endboss.isHurt = false;
  }

  /**
   * Stops all active endboss-related animation intervals.
   */
  stopEndbossAnimations() {
    this.world.endboss.currentImage = 0;
    clearInterval(this.world.endboss.alertAndWalkingInterval);
    clearInterval(this.world.endboss.movingInterval);
    this.world.endboss.movingInterval = null;
    clearInterval(this.world.hurtEndbossInterval);
    clearInterval(this.world.endbossAttackInterval);
  }

  /**
   * Starts checking and updating endboss direction every second.
   */
  startDecidingEndbossDirection() {
    this.decideEndbossDirectionInterval = setInterval(() => {
      gameIntervals.push(this.decideEndbossDirectionInterval);
      this.decideEnbossDirection();
    }, 1000);
  }

  /**
   * Updates the direction the endboss should face.
   */
  decideEnbossDirection() {
    this.world.endboss.otherDirection = false;
    if (this.world.character.x > this.world.endboss.x) {
      this.world.endboss.otherDirection = true;
    }
  }
}
