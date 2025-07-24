/**
 * Represents the Endboss enemy with multiple animation states and behaviors.
 * Extends movableObject.
 */
class Endboss extends movableObject {
  width = 280;
  height = 320;
  y = 120;

  offset = {
    top: 80,
    bottom: 40,
    left: 30,
    right: 35,
  };
  speed = 1;
  hp;
  isDead = false;
  isHurt = false;
  hasDied = false;
  isAttacking = false;
  otherDirection = false;
  damage = 30;

  IMAGES_ALERT = [
    "./img/4_enemie_boss_chicken/2_alert/G5.png",
    "./img/4_enemie_boss_chicken/2_alert/G6.png",
    "./img/4_enemie_boss_chicken/2_alert/G7.png",
    "./img/4_enemie_boss_chicken/2_alert/G8.png",
    "./img/4_enemie_boss_chicken/2_alert/G9.png",
    "./img/4_enemie_boss_chicken/2_alert/G10.png",
    "./img/4_enemie_boss_chicken/2_alert/G11.png",
    "./img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_WALKING = [
    "./img/4_enemie_boss_chicken/1_walk/G1.png",
    "./img/4_enemie_boss_chicken/1_walk/G2.png",
    "./img/4_enemie_boss_chicken/1_walk/G3.png",
    "./img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_HURT = ["./img/4_enemie_boss_chicken/4_hurt/G21.png", "./img/4_enemie_boss_chicken/4_hurt/G22.png", "./img/4_enemie_boss_chicken/4_hurt/G23.png"];

  IMAGES_DEAD = ["./img/4_enemie_boss_chicken/5_dead/G24.png", "./img/4_enemie_boss_chicken/5_dead/G25.png", "./img/4_enemie_boss_chicken/5_dead/G26.png"];

  IMAGES_ATTACK = [
    "./img/4_enemie_boss_chicken/3_attack/G13.png",
    "./img/4_enemie_boss_chicken/3_attack/G14.png",
    "./img/4_enemie_boss_chicken/3_attack/G15.png",
    "./img/4_enemie_boss_chicken/3_attack/G16.png",
    "./img/4_enemie_boss_chicken/3_attack/G17.png",
    "./img/4_enemie_boss_chicken/3_attack/G18.png",
    "./img/4_enemie_boss_chicken/3_attack/G19.png",
    "./img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /**
   * @param {number} x - Initial horizontal position of the endboss.
   */
  constructor(x) {
    super();
    this.x = x;
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadMovementSprites(this.IMAGES_WALKING);
    this.loadMovementSprites(this.IMAGES_ALERT);
    this.loadMovementSprites(this.IMAGES_HURT);
    this.loadMovementSprites(this.IMAGES_DEAD);
    this.loadMovementSprites(this.IMAGES_ATTACK);
    this.id = globalEnemyId++;
    this.hp = 100;
    this.animate();
  }

  /**
   * Initiates the endboss behavior unless attacking or game is over.
   */
  animate() {
    if (this.isAttacking || gameIsOver) return;
    clearInterval(this.alertAndWalkingInterval);
    this.handleAlertAndWalkingInterval();
  }

  /**
   * Starts the alert or walking behavior when character is nearby.
   */
  handleAlertAndWalkingInterval() {
    this.alertAndWalkingInterval = setInterval(() => {
      gameIntervals.push(this.alertAndWalkingInterval);
      if (hasSpotedCharacter) {
        if (!hasEndbossAlerted) this.alertEndboss();
        setTimeout(() => this.startWalkingIfNotHurt(), 100);
      }
    }, 100);
  }

  /**
   * Starts walking animation and movement if not hurt.
   */
  startWalkingIfNotHurt() {
    if (!this.isHurt) {
      this.playObjectAnimation(this.IMAGES_WALKING, false);
      this.startMoving();
    }
  }

  /**
   * Plays the alert animation once.
   */
  alertEndboss() {
    this.playObjectAnimation(this.IMAGES_ALERT, true);
    hasEndbossAlerted = true;
  }

  /**
   * Begins movement logic if allowed.
   */
  startMoving() {
    if (!this.allowMoving()) return;
    this.startMovingInterval();
  }

  /**
   * Repeatedly moves the endboss left or right.
   */
  startMovingInterval() {
    this.movingInterval = setInterval(() => {
      gameIntervals.push(this.movingInterval);
      if (this.otherDirection) {
        this.x += this.speed;
      } else {
        this.x -= this.speed;
      }
    }, 1000 / 60);
  }

  /**
   * Checks if the endboss can start moving.
   * @returns {boolean}
   */
  allowMoving() {
    return !this.movingInterval && !this.isAttacking && !gameIsOver;
  }
}