class Player extends GameComponent {
    constructor() {
        super(30, 30, 10, 10, 3, undefined, 2, 2, 1, 0, true);
        this.faceDirection = "down";
        this.sprites = {
            idle: {
                right: new Sprite(images.sprites.player.idle.right, 6, 16, 2),
                left: new Sprite(images.sprites.player.idle.left, 6, 16, 2),
                up: new Sprite(images.sprites.player.idle.up, 6, 16, 2),
                down: new Sprite(images.sprites.player.idle.down, 6, 16, 2)
            },
            walk: {
                right: new Sprite(images.sprites.player.walk.right, 6, 16, 2),
                left: new Sprite(images.sprites.player.walk.left, 6, 16, 2),
                up: new Sprite(images.sprites.player.walk.up, 6, 16, 2),
                down: new Sprite(images.sprites.player.walk.down, 6, 16, 2)
            }
        }
    }

    setCorrectSprite() {
        if (this.moveTo.x == null) this.render = this.sprites.idle[this.faceDirection];
        else {
            let xDist = this.moveTo.x - this.x;
            let yDist = this.moveTo.y - this.y;
            if (Math.abs(xDist) > Math.abs(yDist))
                this.faceDirection = xDist > 0 ? "right" : "left";
            else
                this.faceDirection = yDist > 0 ? "down" : "up";

            this.render = this.sprites.walk[this.faceDirection];
        }
        switch (this.faceDirection) {
            case "left":
            case "right":
                this.boundsReduce.right = 6;
                this.boundsReduce.left = 6;
                break;
            case "up":
            case "down":
                this.boundsReduce.right = 2;
                this.boundsReduce.left = 2;
                break;
        }
    }

    moveToMouseLineFX() {
        let ctx = gameArea.context
        ctx.beginPath();
        ctx.moveTo(this.center.x - camera.x, this.center.y - camera.y);
        ctx.lineTo(this.moveTo.x + this.width / 2 - camera.x, this.moveTo.y + this.height / 2 - camera.y);
        ctx.globalAlpha = 0.3;
        ctx.stroke();
        ctx.restore();
    }

    update() {
        this.setMoveTo(touchPos.x, touchPos.y);
        /*if (this.moveTo.x != null)
            this.moveToMouseLineFX();*/
        this.setCorrectSprite();
        super.update();
    }
}