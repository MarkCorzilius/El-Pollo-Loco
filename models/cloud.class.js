class Cloud extends movableObject {
    y = 20;
    x = Math.random() * 500;
    width = 500;
    height = 300;

    constructor(){
        super();
        this.loadImage(`./img/5_background/layers/4_clouds/1.png`);
    }  
}