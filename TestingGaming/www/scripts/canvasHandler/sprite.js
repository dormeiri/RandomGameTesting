const SPRITE_ANIMATION_DELAY = 4;

class Sprite {
    constructor(image, frames, frameSize, scale, flip) {
        this.image = image;
        this.frameSize = frameSize;

        this.frame = 0;
        this.framesCount = frames;
        this.framesDelayed = 0;
        this.flip = flip;
        this.scale = scale;
    }
    get frameX() {
        return this.frameSize * this.frame;
    }
    drawAnimation(context, x, y) {
        if (this.flip) {
            context.translate(x * 2 + this.frameSize * this.scale, 0);
            context.scale(-1, 1);
        }
        context.drawImage(
            this.image, this.frameX, 0,
            this.frameSize, this.frameSize,
            x, y,
            this.frameSize * this.scale, this.frameSize * this.scale
        );
        context.restore();

        if (this.framesDelayed == SPRITE_ANIMATION_DELAY) {
            if (this.frame == this.framesCount - 1) this.frame = 0;
            else this.frame++;

            this.framesDelayed = 0;
        }
        else this.framesDelayed++;
    }
}