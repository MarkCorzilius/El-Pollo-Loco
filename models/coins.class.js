class Coins extends movableObject {
  static coinId = 0;

  world;

  COIN_IMAGES = ["./img/8_coin/coin_1.png", "./img/8_coin/coin_2.png"];

  offset = { top: 77, left: 77, right: 77, bottom: 77 };

  coinAnimationInterval;

  constructor(x, y) {
    super();
    this.loadImage(this.COIN_IMAGES[0]);
    this.animateCoins();
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 200;
    this.loadMovementSprites(this.COIN_IMAGES);
    this.id = Coins.coinId++;
  }

  animateCoins(){
    this.coinAnimationInterval = setInterval(() => {
      gameIntervals.push(this.coinAnimationInterval);
      this.playObjectAnimation(this.COIN_IMAGES);
    }, 100);
  }
}

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
        this.handleCoinSounds();
        this.applyCoinCollection(coin, index, key);
      }
    } else {
      this.collidingCoins.delete(key);
    }
  }

  applyCoinCollection(coin, index, key) {
    this.increaseCoinBar();
    this.deleteCoinFromUI(index, coin);
    this.collidingCoins.add(key);
  }

  handleCoinSounds() {
    this.world.coinCollectSound.volume = soundEnabled ? 0.1 : 0;
    this.world.coinCollectSound.play();
  }

  increaseCoinBar() {
    coinsCollected += 1;
    this.coinsTracker += 10;
    if (this.coinsTracker >= 100) {
      this.coinsTracker = 100;
    }
    this.world.coinsBar.setPercentage(this.coinsTracker, this.world.coinsBar.COINS_STATUS_IMAGES);
  }

  deleteCoinFromUI(index, coin) {
    clearInterval(coin.coinAnimationInterval);
    this.world.level.coins.splice(index, 1);
  }
}
