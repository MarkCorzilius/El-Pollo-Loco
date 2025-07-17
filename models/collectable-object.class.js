/**
 * CollectableObject represents any object the player can collect.
 * Extends DrawableObject.
 */
class CollectableObject extends DrawableObject {
  /**
   * @param {string} imagePath - Image path of the object.
   * @param {number} x - X position.
   * @param {number} y - Y position.
   */
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80;
  }
}
