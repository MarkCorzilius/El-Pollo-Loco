class Level {
    level_end_x = 2100;

    enemies;
    clouds;
    backgroundObjects;

    constructor(enemies, clouds, backgroundObjects){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}