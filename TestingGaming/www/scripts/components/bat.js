class Bat extends Enemy {
    constructor() {
        let sprites = {
            right: new Sprite(images.sprites.enemy.bat, 3, 16, 2),
            left: new Sprite(images.sprites.enemy.bat, 3, 16, 2, true)
        };
        super(30, 30, 10, Math.random() + 0.5, sprites, true, 6, 6, 6, 6);
    }
}