class StatusBar extends DrawableObject {
  HEALTH_STATUS_IMAGES = [
    "./img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  WEAPON_STATUS_IMAGES = [
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
  ];

  COINS_STATUS_IMAGES = [
    "./img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
    "./img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
    "./img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
    "./img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
    "./img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "./img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
  ];

  constructor(world, y, type) {
    super();
    this.world = world;
    this.loadMovementSprites(this.HEALTH_STATUS_IMAGES);
    this.loadMovementSprites(this.WEAPON_STATUS_IMAGES);
    this.loadMovementSprites(this.COINS_STATUS_IMAGES);
    this.y = y;
    this.x = 20;
    this.type = type;
    this.width = 250;
    this.height = 70;
    this.decideCurrentBar(type);
  }

  decideCurrentBar(type) {
    if (type === "health") {
      this.statusImages = this.HEALTH_STATUS_IMAGES;
      this.setPercentage(100, this.HEALTH_STATUS_IMAGES);
    } else if (type === "weapon") {
      this.statusImages = this.WEAPON_STATUS_IMAGES;
      this.setPercentage(100, this.WEAPON_STATUS_IMAGES);
    } else if (type === "coins") {
      this.statusImages = this.COINS_STATUS_IMAGES;
      this.setPercentage(0, this.COINS_STATUS_IMAGES);
    } else {
      this.statusImages = this.HEALTH_STATUS_IMAGES;
      this.setPercentage(100, this.HEALTH_STATUS_IMAGES);
    }
  }

  setPercentage(percentange, barImages) {
    let path = barImages[this.resolveImageIndex(percentange)];
    this.img = this.imageCache[path];
  }

  resolveImageIndex(resource) {
    if (resource >= 100) {
      return 5;
    } else if (resource >= 80) {
      return 4;
    } else if (resource >= 60) {
      return 3;
    } else if (resource >= 40) {
      return 2;
    } else if (resource >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
