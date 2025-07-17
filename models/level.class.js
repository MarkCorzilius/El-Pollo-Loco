/**
 * Represents a level with enemies, clouds, background, coins, and collectibles.
 */
class Level {
  level_end_x = 4000;

  enemies;
  clouds;
  backgroundObjects;
  coins;
  collectableObjects;

  /**
   * @param {Array} enemies - Enemy objects in the level.
   * @param {Array} clouds - Cloud background objects.
   * @param {Array} backgroundObjects - Background images/tiles.
   * @param {Array} coins - Collectable coins.
   * @param {Array} collectableObjects - Other collectable items.
   */
  constructor(enemies, clouds, backgroundObjects, coins, collectableObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.collectableObjects = collectableObjects;
  }
}
