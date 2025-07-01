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

  IMAGES_HURT = [
    "./img/4_enemie_boss_chicken/4_hurt/G21.png",
    "./img/4_enemie_boss_chicken/4_hurt/G22.png",
    "./img/4_enemie_boss_chicken/4_hurt/G23.png",
  ]

  IMAGES_DEAD = [
    "./img/4_enemie_boss_chicken/5_dead/G24.png",
    "./img/4_enemie_boss_chicken/5_dead/G25.png",
    "./img/4_enemie_boss_chicken/5_dead/G26.png",
  ]

  IMAGES_ATTACK = [
    "./img/4_enemie_boss_chicken/3_attack/G13.png",
    "./img/4_enemie_boss_chicken/3_attack/G14.png",
    "./img/4_enemie_boss_chicken/3_attack/G15.png",
    "./img/4_enemie_boss_chicken/3_attack/G16.png",
    "./img/4_enemie_boss_chicken/3_attack/G17.png",
    "./img/4_enemie_boss_chicken/3_attack/G18.png",
    "./img/4_enemie_boss_chicken/3_attack/G19.png",
    "./img/4_enemie_boss_chicken/3_attack/G20.png",

  ]

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
      this.x -= this.speed;
    }, 1000 / 60);
  }

}
// boss stops while alert / hurt
// if near character –> attack
// run after character
//boss disappears
