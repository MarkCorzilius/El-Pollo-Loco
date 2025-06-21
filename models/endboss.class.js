class Endboss extends movableObject {
    width = 280;
    height = 320;
    x = 500;
    y = 120;
    IMAGES_WALKING = [
        './img/4_enemie_boss_chicken/2_alert/G5.png',
        './img/4_enemie_boss_chicken/2_alert/G6.png',
        './img/4_enemie_boss_chicken/2_alert/G7.png',
        './img/4_enemie_boss_chicken/2_alert/G8.png',
        './img/4_enemie_boss_chicken/2_alert/G9.png',
        './img/4_enemie_boss_chicken/2_alert/G10.png',
        './img/4_enemie_boss_chicken/2_alert/G11.png',
        './img/4_enemie_boss_chicken/2_alert/G12.png',
    ]

    constructor(){
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadMovementSprites(this.IMAGES_WALKING);
        this.playObjectAnimation(this.IMAGES_WALKING);
        this.animate();
    }

    animate(){
        setInterval(() => {
            this.playObjectAnimation(this.IMAGES_WALKING)
        }, 1000);
    }
}