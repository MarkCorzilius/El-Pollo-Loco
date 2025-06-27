class Level {
    level_end_x = 2100;

    enemies;
    clouds;
    backgroundObjects;
    coins;
    collectableObjects;

    constructor(enemies, clouds, backgroundObjects, coins, collectableObjects){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.collectableObjects = collectableObjects;
    }
}