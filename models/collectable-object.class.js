class CollectableObject extends DrawableObject {

    constructor(imagePath, x, y) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
    }
}