class Coins extends DrawableObject {

    COIN_IMAGES = [
        "./img/8_coin/coin_1.png",
        "./img/8_coin/coin_2.png",
    ]

    constructor(x, y) {
        super();
        this.loadImage(this.COIN_IMAGES[0]);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 200;
        this.loadMovementSprites(this.COIN_IMAGES);
    }


}