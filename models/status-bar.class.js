class StatusBar extends DrawableObject {
  HEALTH_IMAGES = [
      "./img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
      "./img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
      "./img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
      "./img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
      "./img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  constructor(world) {
    super();
    this.world = world;
    this.loadMovementSprites(this.HEALTH_IMAGES);
    this.y = 0;
    this.x = 20;
    this.width = 200;
    this.height = 70;
    this.setPercentage(100);
  }

  setPercentage(percentange) {
    let path = this.HEALTH_IMAGES[this.resolveImageIndex(percentange)];
    this.img = this.imageCache[path];
  }

  resolveImageIndex(energy) {

    if (energy >= 100) {
      return 5;
    } else if (energy >= 80) {
      return 4;
    } else if (energy >= 60) {
      return 3;
    } else if (energy >= 40) {
      return 2;
    } else if (energy >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
