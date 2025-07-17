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
  speed = 0.4;
  hp;
  isDead = false;
  isHurt = false;
  hasDied = false;
  isAttacking = false;
  otherDirection = false;
  damage = 20;

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
    this.speed = 0.3;
    this.animate();
  }

  animate() {
    if (this.isAttacking || gameIsOver) return;
    clearInterval(this.alertAndWalkingInterval);
    this.handleAlertAndWalkingInterval();
  }

  handleAlertAndWalkingInterval() {
    this.alertAndWalkingInterval = setInterval(() => {
      gameIntervals.push(this.alertAndWalkingInterval);
      if (hasSpotedCharacter) {
        if (!hasEndbossAlerted) this.alertEndboss();
        setTimeout(() => this.startWalkingIfNotHurt(), 100);
      }
    }, 100);
  }

  startWalkingIfNotHurt() {
    if (!this.isHurt) {
      this.playObjectAnimation(this.IMAGES_WALKING, false);
      this.startMoving();
    }
  }

  alertEndboss() {
    this.playObjectAnimation(this.IMAGES_ALERT, true);
    hasEndbossAlerted = true;
  }

  startMoving() {
    if (!this.allowMoving()) return;
    this.startMovingInterval();
  }

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

  allowMoving() {
    return !this.movingInterval && !this.isAttacking && !gameIsOver;
  }
}

class EndbossManager {
  attackTimeout = false;

  constructor(world) {
    this.world = world;
    this.distanceCharacterEndboss = 0;
    this.startDecidingEndbossDirection();
  }

  hurtEndboss(hp) {
    this.reduceEndbossHpAndSetHurt();
    this.increaseEndbossPower();
    this.updateEnbossHealthBar();
    this.handleEndbossAfterHit(hp);
  }

  handleEndbossAfterHit(hp) {
    if (!this.world.endbossBar.isAttacking) {
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

  updateEnbossHealthBar() {
    this.world.endbossBar.setPercentage(this.world.endboss.hp, this.world.endbossBar.ENDBOSS_STATUS_IMAGES);
  }

  reduceEndbossHpAndSetHurt() {
    this.world.endboss.hp -= 20;
    this.world.endboss.isHurt = true;
  }

  increaseEndbossPower() {
    if (currentLevel === 4 || currentLevel === 5) {
      this.world.endboss.speed += 0.3;
      this.world.endboss.damage += 10;
    } else {
      this.world.endboss.speed += 0.2;
      this.world.endboss.damage += 5;
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
    this.playEndbossDeathSound();
    this.startDeadEndbossInterval();
    setTimeout(() => {
      this.setEndGameFlags();
    }, this.world.endboss.IMAGES_DEAD.length * 400);
  }

  setEndGameFlags() {
    endbossIsDead = true;
    gameIsOver = true;
  }

  startDeadEndbossInterval() {
    this.world.deadEndbossInterval = setInterval(() => {
      gameIntervals.push(this.world.deadEndbossInterval);
      this.world.endboss.playObjectAnimation(this.world.endboss.IMAGES_DEAD, true);
    }, 200);
  }

  playEndbossDeathSound() {
    this.world.deadBossSound.volume = soundEnabled ? 0.2 : 0;
    this.world.deadBossSound.play();
  }

  playHurtAnimation() {
    this.world.hurtEndbossInterval = setInterval(() => {
      gameIntervals.push(this.world.hurtEndbossInterval);
      this.world.endboss.playObjectAnimation(this.world.endboss.IMAGES_HURT, true);
    }, 200);
  }

  resetAndResumeAnimation() {
    setTimeout(() => {
      clearInterval(this.world.hurtEndbossInterval);
      this.world.endboss.currentImage = 0;
      this.world.endboss.isHurt = false;
      this.world.endboss.animate();
    }, this.world.endboss.IMAGES_HURT.length * 100);
  }

  getDistanceBetweenEndbossAndCharacter() {
    this.distanceCharacterEndbossInterval = setInterval(() => {
      gameIntervals.push(this.distanceCharacterEndbossInterval);
      this.updateDistanceCharacterEndboss();
      this.checkIfCharacterSpotted();
      this.handleEndbossAttack();
    }, 50);
  }

  checkIfCharacterSpotted() {
    if (this.distanceCharacterEndboss <= 500) {
      hasSpotedCharacter = true;
    }
  }

  updateDistanceCharacterEndboss() {
    let characterCenter = this.calculateCenterX(this.world.character);
    let endbossCenter = this.calculateCenterX(this.world.endboss);
    this.distanceCharacterEndboss = Math.abs(characterCenter - endbossCenter);
  }

  calculateCenterX(object) {
    return object.x + object.width / 2;
  }

  handleEndbossAttack() {
    if (this.distanceCharacterEndboss <= 310 && !this.world.endboss.isAttacking) {
      this.world.endboss.isAttacking = true;
      this.animateEndbossAttack();
    }
  }

  characterHitByEndboss() {
    if (this.distanceCharacterEndboss <= 400) {
      this.world.character.hit(this.world.endboss.damage);
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
    this.world.playEndbossHurtSound();
    this.startAttackInterval();

    setTimeout(() => {
      this.stopAttackInterval();
    }, this.world.endboss.IMAGES_ATTACK.length * 50); // problem
  }

  stopAttackInterval() {
    clearInterval(this.endbossAttackInterval);
    this.attackTimeout = false;
  }

  startAttackInterval() {
    if (!this.attackTimeout) {
      this.attackTimeout = true;
      this.endbossAttackInterval = setInterval(() => {
        gameIntervals.push(this.endbossAttackInterval);
        this.world.endboss.playObjectAnimation(this.world.endboss.IMAGES_ATTACK, true);
      }, 1000 / 60);
    }
  }

  resumeIdleAnimation() {
    setTimeout(() => {
      this.resetEndbossStates();
      this.world.endboss.animate();
    }, this.world.endboss.IMAGES_ATTACK.length * 50);
  }

  resetEndbossStates() {
    this.world.endboss.isAttacking = false;
    this.world.endboss.isHurt = false;
  }

  stopEndbossAnimations() {
    this.world.endboss.currentImage = 0;
    clearInterval(this.world.endboss.alertAndWalkingInterval);
    clearInterval(this.world.endboss.movingInterval);
    this.world.endboss.movingInterval = null;
    clearInterval(this.world.hurtEndbossInterval);
    clearInterval(this.world.endbossAttackInterval);
  }

  startDecidingEndbossDirection() {
    this.decideEndbossDirectionInterval = setInterval(() => {
      gameIntervals.push(this.decideEndbossDirectionInterval);
      this.decideEnbossDirection()
    }, 1000);
  }

  decideEnbossDirection() {
    this.world.endboss.otherDirection = false;
    if (this.world.character.x > this.world.endboss.x) {
      this.world.endboss.otherDirection = true;
    }
  }
}
