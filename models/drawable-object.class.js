/**
 * Base drawable game object with image, position, and dimensions.
 */
class DrawableObject {
  otherDirection = false;
  img;
  x = 120;
  y = 325;
  width = 100;
  height = 100;
  imageCache = {};
  currentImage = 0;
  offset = { top: 0, left: 0, right: 0, bottom: 0 };
  coinsTracker = 0;
  bottlesTracker = 100;

  /**
   * Loads an image from a given path.
   * @param {string} path - Image path.
   */
  constructor() {
    this.active = true;
  }

  /**
   * Loads an image from a given path.
   * @param {string} path - Image path.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object on the given canvas context.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
   */
  draw(ctx) {
    if (!this.active) return;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a debug frame around the object if needed.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
   */
  drawFrame(ctx) {
    if (this.shouldDrawFrame()) {
      this.drawDebugRect(ctx);
    }
  }

  /**
   * Draws a red debug rectangle around the object using its offset.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
   */
  drawDebugRect(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "6";
    ctx.strokeStyle = "red";
    ctx.rect(
      this.x + this.offset.left,
      this.y + this.offset.top,
      this.width - this.offset.left - this.offset.right,
      this.height - this.offset.top - this.offset.bottom
    );
    ctx.stroke();
  }

  /**
   * Determines whether a debug frame should be drawn for the object.
   * @returns {boolean} True if object should have a debug frame.
   */
  shouldDrawFrame() {
    return (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof SmallChicken ||
      this instanceof Endboss ||
      this instanceof Coins ||
      this instanceof ThrowableObjects
    );
  }

  /**
   * Loads sprite images for animations.
   * @param {string[]} arr - Array of image paths.
   */
  loadMovementSprites(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Makes the object visible.
   */
  show() {
    this.active = true;
  }

  /**
   * Makes the object invisible.
   */
  hide() {
    this.active = false;
  }
}
