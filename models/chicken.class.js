class Chicken extends movableObject {
  moveLeftInterval;
  walkingInterval;
  isDead = false;

  offset = {
    top: 10,
    bottom: 10,
    left: 5,
    right: 5,
  };

  height = 80;
  width = 80;
  y = 345;
  x = 800;
  IMAGES_WALKING = [
    "./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage(`./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png`);
    this.loadMovementSprites(this.IMAGES_WALKING);
    this.speed = 0.15 + Math.random() * 0.25;
    this.id = globalEnemyId++;
    this.damage = 10;
    this.animate();
  }

  animate() {
    this.walkingInterval = setInterval(() => {
      this.playObjectAnimation(this.IMAGES_WALKING);
    }, 200);

    this.moveLeft();
  }

  moveLeft() {
    this.moveLeftInterval = setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}

class SmallChicken extends movableObject {
  chickenHandler = new ChickenHandler();
  moveLeftInterval;
  walkingInterval;
  isDead = false;

  offset = {
    top: 10,
    bottom: 10,
    left: 5,
    right: 5,
  };

  height = 80;
  width = 80;
  y = 345;
  x = 800;
  IMAGES_WALKING = [
    "./img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage(`./img/3_enemies_chicken/chicken_small/1_walk/1_w.png`);
    this.loadMovementSprites(this.IMAGES_WALKING);
    this.speed = 0.15 + Math.random() * 0.25;
    this.id = globalEnemyId++;
    this.damage = 5;
    this.animate();
  }

  animate() {
    this.walkingInterval = setInterval(() => {
      this.playObjectAnimation(this.IMAGES_WALKING);
    }, 200);

    this.moveLeft();
  }

  moveLeft() {
    this.moveLeftInterval = setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}

class ChickenHandler {
  constructor(world) {
    this.world = world;
    this.chickenPositions = [];
    this.minDistance = 100;
  }

  generateValidX(start = 300, range = 2500) {
    let x;
    let isValid = false;

    for (let i = 0; i < 1000; i++) {
      x = start + Math.random() * range;
      isValid = this.chickenPositions.every((pos) => Math.abs(pos - x) >= this.minDistance);
      if (isValid) break;
      
    }
    this.chickenPositions.push(x);
    return x;
  }

  didJumpOnChicken(enemy) {
    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
      this.world.character.enemyWasJumpedOn = false;
      const characterBottom = this.world.character.y + this.world.character.height;
      const enemyTop = enemy.y + enemy.offset.top;

      if (this.world.character.speedY < 0 && characterBottom <= enemyTop + enemy.height / 2) {
        this.world.character.enemyWasJumpedOn = true;
        this.world.handleEnemyHit(enemy);
      }
    }
  }

  showDeadChicken(enemy, deadImages) {
    clearInterval(enemy.moveLeftInterval);
    clearInterval(enemy.walkingInterval);
    enemy.loadImage(deadImages);
    enemy.isDead = true;
    setTimeout(() => {
      const index = this.world.level.enemies.indexOf(enemy);
      this.world.level.enemies.indexOf(index, 1);
    }, 10000);
  }
}
