class TouchFXAnimation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 1 + 0.5;
        this.color = "#FD6A02";
        this.alpha = 0.0;
        this.xSpeed = Math.random() * 1 - 0.5
        this.alphaAccelerate = Math.random() * 0.008 + 0.004;
        this.alphaVelocity = 0;
        this.state = COMPONENT_STATE_ALIVE;
    }
    update() {

        let ctx = backgroundLayer.context;
        ctx.beginPath();
        ctx.arc(this.x - camera.x, this.y - camera.y, this.radius, 0, 2 * Math.PI, false);
        this.y--;
        if (this.alphaVelocity >= 0.1 && this.alphaAccelerate > 0)
            this.alphaAccelerate *= -1;
        if (this.alpha + this.alphaVelocity <= 0 && this.alphaAccelerate < 0)
            this.state = COMPONENT_STATE_GONE;
        else {
            this.alphaVelocity += this.alphaAccelerate;
            this.alpha += this.alphaVelocity;
            if (this.alphaAccelerate > 1)
                this.y -= this.alphaVelocity;
            this.x += this.xSpeed;
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        ctx.restore();
        ctx.save();
    }
}