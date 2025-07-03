class Endboss extends movableObject {
  width = 280;
  height = 320;
  x = 1600;
  y = 120;

  offset = {
    top: 80,
    bottom: 40,
    left: 30,
    right: 35,
  };
  speed = 0.3;
  hp;
  alertSituation;
  isDead = false;
  isHurt = false;
  hasDied = false;
  isAttacking = false;
  otherDirection = false;

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

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadMovementSprites(this.IMAGES_WALKING);
    this.loadMovementSprites(this.IMAGES_ALERT);
    this.loadMovementSprites(this.IMAGES_HURT);
    this.loadMovementSprites(this.IMAGES_DEAD);
    this.loadMovementSprites(this.IMAGES_ATTACK);
    this.id = globalEnemyId++;
    this.alertSituation = false;
    this.hp = 200;
    this.speed = 0.3;
    this.animate();
  }

  animate() {
    console.log("isAttacking: ", this.isAttacking);
    console.log("isHurt: ", this.isHurt);
    console.log("alertSituation: ", this.alertSituation);

    if (this.isAttacking) return;
    clearInterval(this.alertAndWalkingInterval);
    this.alertAndWalkingInterval = setInterval(() => {
      if (this.alertSituation) {
        this.playObjectAnimation(this.IMAGES_ALERT, true);
        setTimeout(() => {
          if (!this.isHurt) {
            this.playObjectAnimation(this.IMAGES_WALKING, false);
            this.startMoving();
          }
        }, 300);
      }
    }, 300);
  }

  startMoving() {
    if (this.movingInterval || this.isAttacking) return;

    this.movingInterval = setInterval(() => {
      if (this.otherDirection) {
        this.x += this.speed;
      } else {
        this.x -= this.speed;
      }
    }, 1000 / 60);
  }
}

class EndbossManager {
  constructor(world) {
    this.world = world;
    this.distanceCharacterEndboss = 0;
    this.decideEnbossDirection();
  }

  hurtEndboss(hp) {
    if (!this.world.endboss.isAttacking) {
      this.stopEndbossAnimations();
      if (hp <= 0) {
        this.playDeathAnimation();
        this.removeEndbossFromLevel();
      } else {
        this.playHurtAnimation();
        this.resetAndResumeAnimation();
      }
    }
  }

  removeEndbossFromLevel() {
    setTimeout(() => {
      this.world.endboss.hasDied = true;
      const index = this.world.level.enemies.indexOf(this.endboss);
      this.world.level.enemies.splice(index, 1);
    }, this.world.endboss.IMAGES_DEAD.length * 300);
  }

  playDeathAnimation() {
    this.world.endboss.hp = 0;
    this.world.deadEndbossInterval = setInterval(() => {
      this.world.endboss.playObjectAnimation(this.world.endboss.IMAGES_DEAD, true);
    }, 200);
  }

  playHurtAnimation() {
    this.world.hurtEndbossInterval = setInterval(() => {
      this.world.endboss.playObjectAnimation(this.world.endboss.IMAGES_HURT, true);
    }, 200);
  }

  resetAndResumeAnimation() {
    setTimeout(() => {
      clearInterval(this.world.hurtEndbossInterval);
      this.world.endboss.currentImage = 0;
      this.world.endboss.isHurt = false;
      this.world.endboss.animate();
    }, this.world.endboss.IMAGES_HURT.length * 400);
  }

  getDistanceBetweenEndbossAndCharacter() {
    setInterval(() => {
      this.world.endboss.alertSituation = false;
      let characterCenter = this.world.character.x + this.world.character.width / 2;
      let endbossCenter = this.world.endboss.x + this.world.endboss.width / 2;
      this.distanceCharacterEndboss = Math.abs(characterCenter - endbossCenter);
      if (this.distanceCharacterEndboss <= 600) {
        this.world.endboss.alertSituation = true;
      }
      this.handleEndbossAttack();
    }, 50);
  }

  handleEndbossAttack() {
    if (this.distanceCharacterEndboss <= 310 && !this.world.endboss.isAttacking) {
      this.world.endboss.isAttacking = true;
      this.animateEndbossAttack();
    }
  }

  characterHitByEndboss() {
    if (this.distanceCharacterEndboss <= 400) {
      this.world.character.hit(20);
      this.world.character.pushCharacterAway();
      this.world.character.playCharacterAnimation();
      this.world.healthBar.setPercentage(this.world.character.healthTracker, this.world.healthBar.HEALTH_STATUS_IMAGES);
    }
  }

  animateEndbossAttack() {
    this.stopEndbossAnimations();
    this.startAttackAnimation();
    this.characterHitByEndboss();
    this.resumeIdleAnimation();
  }

  startAttackAnimation() {
    this.endbossAttackInterval = setInterval(() => {
      this.world.endboss.playObjectAnimation(this.world.endboss.IMAGES_ATTACK, true);
    }, 200);
  }

  resumeIdleAnimation() {
    setTimeout(() => {
      this.world.endboss.isAttacking = false;
      this.world.endboss.isHurt = false;
      this.world.endboss.animate();
    }, this.world.endboss.IMAGES_ATTACK.length * 150);
  }

  stopEndbossAnimations() {
    this.world.endboss.currentImage = 0;
    clearInterval(this.world.endboss.alertAndWalkingInterval);
    clearInterval(this.world.endboss.movingInterval);
    this.world.endboss.movingInterval = null;
    clearInterval(this.world.hurtEndbossInterval);
    clearInterval(this.world.endbossAttackInterval);
  }

  decideEnbossDirection() {
    setInterval(() => {
      this.world.endboss.otherDirection = false;
      if (this.world.character.x > this.world.endboss.x) {
        this.world.endboss.otherDirection = true;
      }
    }, 1000);
  }
}
