const level4 = new Level(
    [
        new SmallChicken(),
        new Chicken(),
        new Chicken(), 
        new SmallChicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(), 
        new SmallChicken(),
        new SmallChicken(),
        new SmallChicken(),
        new Chicken(),
        new Chicken(), 

        new Endboss(2500),
    ],

    [
        new Cloud(`./img/5_background/layers/4_clouds/1.png`, 300),
        new Cloud(`./img/5_background/layers/4_clouds/2.png`, 1000),
        new Cloud(`./img/5_background/layers/4_clouds/1.png`, 1600),
        new Cloud(`./img/5_background/layers/4_clouds/2.png`, 2200),
        new Cloud(`./img/5_background/layers/4_clouds/1.png`, 3000),
        new Cloud(`./img/5_background/layers/4_clouds/2.png`, 3700),
        new Cloud(`./img/5_background/layers/4_clouds/1.png`, 4300),
        new Cloud(`./img/5_background/layers/4_clouds/2.png`, 5000),
        new Cloud(`./img/5_background/layers/4_clouds/1.png`, 5600),
        new Cloud(`./img/5_background/layers/4_clouds/2.png`, 6400),
    ],

    [
        new BackgroundObject("./img/5_background/layers/air.png", -1440),
        new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", -1440),
        new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", -1440),
        new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", -1440),

        new BackgroundObject("./img/5_background/layers/air.png", -720),
        new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", -720),
        new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", -720),
        new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", -720),
    
        new BackgroundObject("./img/5_background/layers/air.png", 0),
        new BackgroundObject("./img/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObject("./img/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObject("./img/5_background/layers/1_first_layer/1.png", 0),
    
        new BackgroundObject("./img/5_background/layers/air.png", 720),
        new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", 720),
        new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", 720),
        new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", 720),
    
        new BackgroundObject("./img/5_background/layers/air.png", 720 * 2),
        new BackgroundObject("./img/5_background/layers/3_third_layer/1.png", 720 * 2),
        new BackgroundObject("./img/5_background/layers/2_second_layer/1.png", 720 * 2),
        new BackgroundObject("./img/5_background/layers/1_first_layer/1.png", 720 * 2),
    
        new BackgroundObject("./img/5_background/layers/air.png", 720 * 3),
        new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", 720 * 3),
        new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", 720 * 3),
        new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", 720 * 3),

        new BackgroundObject("./img/5_background/layers/air.png", 720 * 4),
        new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", 720 * 4),
        new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", 720 * 4),
        new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", 720 * 4),

        new BackgroundObject("./img/5_background/layers/air.png", 720 * 5),
        new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", 720 * 5),
        new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", 720 * 5),
        new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", 720 * 5),

        new BackgroundObject("./img/5_background/layers/air.png", 720 * 6),
        new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", 720 * 6),
        new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", 720 * 6),
        new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", 720 * 6),

        new BackgroundObject("./img/5_background/layers/air.png", 720 * 7),
        new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", 720 * 7),
        new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", 720 * 7),
        new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", 720 * 7),
    ],

    [
        new Coins(400, 300), 
        new Coins(500, 200), 
        new Coins(600, 100), 
        new Coins(700, 200), 
        new Coins(800, 300),

        new Coins(1000, 300), 
        new Coins(1100, 200), 
        new Coins(1200, 100), 
        new Coins(1300, 200), 
        new Coins(1400, 300),
    ],

    [
        new CollectableObject('./img/6_salsa_bottle/1_salsa_bottle_on_ground.png', 300, 345),
        new CollectableObject('./img/6_salsa_bottle/1_salsa_bottle_on_ground.png', 600, 350),
        new CollectableObject('./img/6_salsa_bottle/1_salsa_bottle_on_ground.png', 750, 350),
        new CollectableObject('./img/6_salsa_bottle/2_salsa_bottle_on_ground.png', 1000, 355),
        new CollectableObject('./img/6_salsa_bottle/2_salsa_bottle_on_ground.png', 1200, 345),
        new CollectableObject('./img/6_salsa_bottle/2_salsa_bottle_on_ground.png', 1800, 355),
        new CollectableObject('./img/6_salsa_bottle/2_salsa_bottle_on_ground.png', 2200, 345),
    ]
);
