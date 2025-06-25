class Chicken extends movableObject {
    height = 80;
    width = 80;
    y = 345;
    x = 200 + Math.random() * 500;
    IMAGES_WALKING = [
        './img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ]

    constructor(){
        super().loadImage(`./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png`);
        this.loadMovementSprites(this.IMAGES_WALKING);
        this.speed = 0.15 + Math.random() * 0.25;
        this.id = globalEnemyId++;
        this.animate();
    }
    
    animate(){
        setInterval(() => {
            this.playObjectAnimation(this.IMAGES_WALKING);    
        }, 200);

        this.moveLeft();
    }
}