class CoinCollector {
    constructor(world) {
        this.world = world;
        this.collidingCoins = new Set();
        this.coinsTracker = 0;
    }

    handleCoinCollisition(coin, index) {
        const key = coin.id;
        if (this.world.character.isColliding(coin)) {
          if (!this.collidingCoins.has(key)) {
            this.increaseCoinBar();
            this.deleteCoinFromUI(index);
            this.collidingCoins.add(key);
          }
        } else {
          this.collidingCoins.delete(key);
        }
      }
    
      increaseCoinBar() {
        this.coinsTracker += 20;
        if (this.coinsTracker >= 100) {
          this.coinsTracker = 100;
        }
        this.world.coinsBar.setPercentage(this.coinsTracker, this.world.coinsBar.COINS_STATUS_IMAGES);
      }
    
      deleteCoinFromUI(index) {
        this.world.level.coins.splice(index, 1);
      }
}