class World {
  character = new Character();
  statusBar = new StatusBar();
  throwableObjects = [new ThrowableObjects()];
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  lastBottle = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.collidingEnemies = new Set();
    this.startCollisitionCheck();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  startCollisitionCheck() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        this.handleCollision(enemy);
        this.checkThrowObjects();
      });
    }, 1000 / 60);
  }

  checkThrowObjects() {
    const now = new Date().getTime();
    if (this.keyboard.D && now - this.lastBottle > 1500) {
      let bottle = new ThrowableObjects(this.character.x, this.character.y);
      this.throwableObjects.push(bottle);
      this.lastBottle = now;
    }
  }

  handleCollision(enemy) {
    const key = enemy.id;
    if (this.character.isColliding(enemy)) {
      if (!this.collidingEnemies.has(key)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        this.collidingEnemies.add(key);
      }
    } else {
      this.collidingEnemies.delete(key);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);

    this.addObjectsToMap(this.level.clouds);

    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.enemies);

    this.addObjectsToMap(this.throwableObjects);

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

  flipImage(object) {
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
