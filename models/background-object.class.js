/**
 * Represents a background object with a fixed size and position.
 * Extends movableObject.
 */
class BackgroundObject extends movableObject {
  width = 720;
  height = 500;

  /**
   * Creates a background object at a specified x position.
   * @param {string} imagePath - Path to the background image.
   * @param {number} x - Horizontal position on the canvas.
   */
  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
