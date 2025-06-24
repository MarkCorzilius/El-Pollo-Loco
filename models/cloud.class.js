class Cloud extends movableObject {
  y = 20;
  x = Math.random() * 500;
  width = 500;
  height = 300;
  speed = 0.1

  constructor(cloudPath, x) {
    super();
    this.x = x;
    this.loadImage(cloudPath);
    this.animate();
  }

  animate() {
    this.moveLeft();
  }
}
