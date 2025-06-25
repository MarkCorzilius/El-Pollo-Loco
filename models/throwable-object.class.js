class ThrowableObjects extends movableObject {

  constructor(x, y) {
    super().loadImage(`./img/6_salsa_bottle/salsa_bottle.png`);
    this.height = 60;
    this.width = 60;
    this.throw(x, y);
  }

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 20;
    this.applyGravity();
    setInterval(() => {
      this.x += 10;
    }, 25);
  }
}
