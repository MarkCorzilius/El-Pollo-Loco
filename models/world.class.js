class World {
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ];
    
    clouds = [
        new Cloud()
    ]
    backgroundObjects = [
        new BackgroundObject('./img/5_background/layers/1_first_layer/1.png', 0)
    ]

    canvas;
    ctx;

    constructor(canvas){
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.draw();
    }

    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addToMap(this.character);

        this.addObjectsToMap(this.enemies);

        this.addObjectsToMap(this.clouds);

        this.addObjectsToMap(this.backgroundObjects);

        let self = this;
        requestAnimationFrame(function draw(){
            self.draw();
        })

    }

    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    addToMap(object){
        this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height)
    }
}