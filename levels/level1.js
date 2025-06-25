const level1 = new Level(
    [
        new Chicken(),
        new Chicken(), 
        new Chicken(),
        new Endboss(),
    ],

    [
        new Cloud(`./img/5_background/layers/4_clouds/1.png`, 300),
        new Cloud(`./img/5_background/layers/4_clouds/2.png`, 1000),
        new Cloud(`./img/5_background/layers/4_clouds/1.png`, 1600),
        new Cloud(`./img/5_background/layers/4_clouds/2.png`, 2200),
        new Cloud(`./img/5_background/layers/4_clouds/1.png`, 3000),
        new Cloud(`./img/5_background/layers/4_clouds/2.png`, 3700),




    ],

    [
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
    ],

    [
        new Coins(200, 100), 
        new Coins(600, 300), 
        new Coins(1000, 200), 
        new Coins(1200, 90), 
        new Coins(1500, 300),
    ]
);
