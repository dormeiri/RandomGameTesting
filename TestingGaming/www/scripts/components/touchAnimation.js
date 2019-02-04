class TouchAnimation {
    constructor(x, y) {
        let r = Math.random() * 30 + (Math.random() > 0.75 ? 20 : 0);
        let a = Math.random() * 2 * Math.PI
        this.x = x + r * Math.cos(a);
        this.y = y + r * Math.sin(a);

        this.radius = Math.random() * 2 + 2;
        this.color = "#FD6A02";
        this.alpha = 0.0;
        this.alphaAccelerate = 0.0075;
        this.alphaVelocity = 0.0;
        this.state = COMPONENT_STATE_ALIVE;
        this.lastTouchAnimation = null;
        if (touchAnimations.length > 1)
            this.lastTouchAnimation = touchAnimations[touchAnimations.length - 1];
    }
    update() {
        let ctx = gameArea.context;
        ctx.beginPath();
        ctx.arc(this.x - camera.x, this.y - camera.y, this.radius, 0, 2 * Math.PI, false);
        if (this.alphaVelocity >= 0.1 && this.alphaAccelerate > 0)
            this.alphaAccelerate *= -1;
        if (this.alpha + this.alphaVelocity <= 0 && this.alphaAccelerate < 0)
            this.state = COMPONENT_STATE_GONE;
        else {
            this.alphaVelocity += this.alphaAccelerate;
            this.alpha += this.alphaVelocity;
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;

            ctx.fill();
        }
        ctx.beginPath();
        if (this.lastTouchAnimation != null) {
            ctx.globalAlpha = this.alpha / 1.5;
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.x - camera.x, this.y - camera.y);
            ctx.lineTo(this.lastTouchAnimation.x - camera.x, this.lastTouchAnimation.y - camera.y);
            ctx.stroke();
        }
        ctx.restore();
        ctx.save();
    }
}