class Coin extends AIComponent {
    constructor() {
        super(30, 30, 0, "yellow");

        super.hitPlayerAction = function () {
            gameArea.addPoint();
            this.state = COMPONENT_STATE_GONE;
            touchTextsAnimations.push(new TouchTextAnimation(this.center.x, this.center.y, 1, "black"));

        }
        this.alphaReduceDirection = 0.02;
        this.alphaReduce = this.alphaReduceDirection;
    }
    update() {
        if (this.isInCamera()) {
            let ctx = gameArea.context;

            if (this.alphaReduce >= 0.5 || this.alphaReduce <= 0)
                this.alphaReduceDirection *= -1;

            this.alphaReduce += this.alphaReduceDirection;
            ctx.globalAlpha = 1 - this.alphaReduce;
        }
        super.update();
    }
}