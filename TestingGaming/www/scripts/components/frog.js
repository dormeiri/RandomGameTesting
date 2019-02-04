class Frog extends Enemy {
    constructor() {
        let sprites = {
            right: new Sprite(images.sprites.enemy.frog, 3, 16, 3/2),
            left: new Sprite(images.sprites.enemy.frog, 3, 16, 3/2, true)
        };
        super(20, 20, 6, Math.random() + 0.25, sprites, false, 2, 2, 6, 0);
    }
}