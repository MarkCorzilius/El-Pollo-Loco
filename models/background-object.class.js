class BackgroundObject extends movableObject{
    width = 720;
    height = 500;
    constructor(imagePath, x){
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}