class Level {
    level_end_x = 2100;

    enemies;
    clouds;
    backgroundObjects;
    coins;

    constructor(enemies, clouds, backgroundObjects, coins){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
    }
}