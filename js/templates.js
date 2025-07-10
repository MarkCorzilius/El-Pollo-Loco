function achievementsTemplate() {
    return `
             <div class="achievement">
            <span>Current Level: ${currentLevel}</span>
            <img src="./img/level.png" alt="level img">
          </div>
          <div class="achievement">
            <span>Coins: ${coinsCollected}/10</span>
            <img src="./img/coin.png" alt="coin img">
          </div>`;
}