/**
 * Displays the "Game Over" message when the player loses.
 */
class LoseMessage extends DrawableObject {
  height = 420;
  width = 680;
  /**
   * @param {Object} world - The game world.
   */
  constructor(world) {
    super();
    this.world = world;
    const canvas = world.canvas;
    const centerX = canvas.width / 2 - this.width / 2;
    const centerY = canvas.height / 2 - this.height / 2;
    this.x = centerX;
    this.y = centerY;
    this.loadImage("./img/You won, you lost/Game Over.png");
    this.active = false;
  }
}

/**
 * Displays the "You Win" message when the player wins.
 */
class WinMessage extends DrawableObject {
  height = 480;
  width = 720;
  /**
   * @param {Object} world - The game world.
   */
  constructor(world) {
    super();
    this.world = world;
    const canvas = world.canvas;
    const centerX = canvas.width / 2 - this.width / 2;
    const centerY = canvas.height / 2 - this.height / 2;
    this.x = centerX;
    this.y = centerY;
    this.loadImage("./img/You won, you lost/Game over A.png");
    this.active = false;
  }
}
