class Character extends movableObject {
  height = 200;
  width = 130;
  y = 225;
  x = 100;
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

  world;
  speed = 6;

  offset = {
    top: 90,
    bottom: 0,
    left: 30,
    right: 35
  }
  energy = 100;

  constructor() {
    super().loadImage("./img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadMovementSprites(this.IMAGES_WALKING);
    this.loadMovementSprites(this.IMAGES_JUMPING);
    this.applyGravity();
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
      }
      this.world.camera_x = this.x;
    }, 1000 / 60);

    setInterval(() => {
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }

      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isAboveGround()) {
        this.playObjectAnimation(this.IMAGES_JUMPING);
      }

      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playObjectAnimation(this.IMAGES_WALKING);
      }
    }, 50);
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
}
