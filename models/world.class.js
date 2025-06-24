class World {
  character = new Character();
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.collidingEnemies = new Set();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach(enemy => {
        const key = enemy.id;
        if (this.character.isColliding(enemy)) {
          // If this enemy is not yet recorded as colliding
          if (!this.collidingEnemies.has(key)) {
            this.character.energy -= 10;
            this.collidingEnemies.add(key);
            console.log(`Collided with enemy ${key}, energy: ${this.character.energy}`);
          }
        } else {
          // No collision, remove from collidingEnemies so next collision counts again
          this.collidingEnemies.delete(key);
        }
      });
    }, 1000 / 60);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);

    this.addObjectsToMap(this.level.clouds);

    this.addToMap(this.character);

    this.addObjectsToMap(this.level.enemies);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function draw() {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(object) {
    if (object.otherDirection) {
        this.flipImage(object);
    }
    object.draw(this.ctx);
    object.drawFrame(this.ctx);


    if (object.otherDirection) {
        this.flipImageBack(object);
    }
  }

  flipImage(object){
    this.ctx.save();
    this.ctx.translate(object.width, 0);
    this.ctx.scale(-1, 1);
    object.x = object.x * -1;
  }

  flipImageBack(object) {
    this.ctx.restore();
    object.x = object.x * -1;
  }
}
