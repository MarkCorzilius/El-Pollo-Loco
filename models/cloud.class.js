/**
 * Cloud moves slowly from right to left.
 * Extends movableObject.
 */
class Cloud extends movableObject {
  y = 20;
  x = Math.random() * 500;
  width = 500;
  height = 300;
  speed = 0.1;

  /**
   * @param {string} cloudPath - Path to the cloud image.
   * @param {number} x - Initial x position.
   */
  constructor(cloudPath, x) {
    super();
    this.x = x;
    this.loadImage(cloudPath);
    this.animate();
  }

  /**
   * Starts cloud movement to the left.
   */
  animate() {
    this.moveLeft();
  }
}
