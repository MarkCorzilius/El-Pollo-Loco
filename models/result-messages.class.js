class LoseMessage extends DrawableObject {
    height = 400;
    width = 700;
    constructor(world) {
      super();
      this.world = world;
      const canvas = world.canvas;
      const centerX = canvas.width / 2 - this.width / 2;
      const centerY = canvas.height / 2 - this.height / 2;
      this.x = centerX;
      this.y = centerY;
      this.loadImage('./img/You won, you lost/Game Over.png');
      this.active = false;
    }
  }

class WinMessage extends DrawableObject {
    height = 420;
    width = 720;
    constructor(world) {
      super();
      this.world = world;
      const canvas = world.canvas;
      const centerX = canvas.width / 2 - this.width / 2;
      const centerY = canvas.height / 2 - this.height / 2; 
      this.x = centerX;
      this.y = centerY;
      this.loadImage('./img/You won, you lost/Game over A.png');
      this.active = false;
    }
  }


  // add graphics to canvas