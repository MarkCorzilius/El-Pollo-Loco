class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];

  clouds = [
    new Cloud(`./img/5_background/layers/4_clouds/1.png`),
    new Cloud(`./img/5_background/layers/4_clouds/2.png`)
  ];
  backgroundObjects = [
    new BackgroundObject("./img/5_background/layers/air.png", -720),
    new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", -720),
    new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", -720),
    new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", -720),

    new BackgroundObject("./img/5_background/layers/air.png", 0),
    new BackgroundObject("./img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("./img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("./img/5_background/layers/1_first_layer/1.png", 0),

    new BackgroundObject("./img/5_background/layers/air.png", 720),
    new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", 720),
    new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", 720),
    new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", 720),

    new BackgroundObject("./img/5_background/layers/air.png", 720 * 2),
    new BackgroundObject("./img/5_background/layers/3_third_layer/1.png", 720 * 2),
    new BackgroundObject("./img/5_background/layers/2_second_layer/1.png", 720 * 2),
    new BackgroundObject("./img/5_background/layers/1_first_layer/1.png", 720 * 2),

    new BackgroundObject("./img/5_background/layers/air.png", 720 * 3),
    new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", 720 * 3),
    new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", 720 * 3),
    new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", 720 * 3),
  ];

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
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundObjects);

    this.addObjectsToMap(this.clouds);

    this.addToMap(this.character);

    this.addObjectsToMap(this.enemies);

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
        this.ctx.save();
        this.ctx.translate(object.width, 0)
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }
    this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
    if(object.otherDirection){
        this.ctx.restore();
        object.x = object.x * -1;
    }
  }
}
