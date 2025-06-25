class DrawableObject {
  img;
  x = 120;
  y = 325;
  width = 100;
  height = 100;
  imageCache = {};
  currentImage = 0;
  offset = { top: 0, left: 0, right: 0, bottom: 0 };
  coinsTracker = 0;
  healthTracker = 100;
  bottlesTracker = 100;


  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof Coins) {
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
  }

  loadMovementSprites(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
