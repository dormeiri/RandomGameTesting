class TouchTextAnimation extends TextComponent {
    constructor(x, y, content, color) {
        super(15, x, y, 'center', undefined, true);
        this.color = color;
        this.alpha = 0.0;
        this.xSpeed = Math.random() * 2 - 1
        this.alphaAccelerate = Math.random() * 0.003 + 0.003;
        this.alphaVelocity = 0.0;
        this.state = COMPONENT_STATE_ALIVE;
        this.currentText = content;
    }
    update() {
        let ctx = HUD.context;
        this.y--;
        if (this.alphaVelocity >= 0.1 && this.alphaAccelerate > 0)
            this.alphaAccelerate *= -1;
        if (this.alpha + this.alphaVelocity <= 0 && this.alphaAccelerate < 0)
            this.state = COMPONENT_STATE_GONE;
        else {
            this.alphaVelocity += this.alphaAccelerate;
            this.alpha += this.alphaVelocity;
            if (this.alphaAccelerate > 1)
                this.y -= this.alphaVelocity * 4;
            this.x += this.xSpeed;
            ctx.globalAlpha = this.alpha;
            super.update();
        }
    }
}