class Enemy extends AIComponent {
    constructor(width, height, maxHp, speed, sprites, fly, leftBoundReduce, rightBoundReduce, topBoundReduce, bottomBoundReduce) {
        super(width, height, speed, undefined, leftBoundReduce, rightBoundReduce, topBoundReduce, bottomBoundReduce);
        super.hitPlayerAction = function () { gameArea.gameOver(); };
        this.maxHp = maxHp;
        this.hp = this.maxHp;
        this.hittedBy = [];
        this.ghost = true;
        this.sprites = sprites;
        this.changeSideTimerReset = 0;
        this.changeSideTimer = 0;
        this.ghostTimerReset = 200;
        this.ghostTimer = 0;
        this.changeSide();
        this.healthBar = new HealthBar(this);
        this.fly = fly;
    }

    moveRight() {
        super.moveRight();
        this.render = this.sprites.right;
    }
    moveLeft() {
        super.moveLeft();
        this.render = this.sprites.left;
    }

    changeSide() {
        let randomSide = Math.floor(Math.random() * 8);
        switch (randomSide) {
            case 0: this.moveLeft(); break;
            case 1: this.moveRight(); break;
            case 2: this.moveDown(); break;
            case 3: this.moveUp(); break;
            case 4: this.moveLeft(); this.moveDown(); break;
            case 5: this.moveLeft(); this.moveUp(); break;
            case 6: this.moveRight(); this.moveDown(); break;
            case 7: this.moveRight(); this.moveUp(); break;
        }
        this.changeSideTimer = 0;
        this.changeSideTimerReset = Math.floor(Math.random() * 150) + 100;
    }
    checkHittedByTouch(touchFire) {
        return touchFire.x > this.bounds.left && touchFire.x < this.bounds.right && touchFire.y > this.bounds.top && touchFire.y < this.bounds.bottom;
    }
    moveByLetters() {
        if (this.bounds.right > gameArea.canvas.width) {
            this.moveLeft();
        }
        if (this.bounds.left < 0) {
            this.moveRight();
        }
        if (this.bounds.top < 0) {
            this.moveDown();
        }
        if (this.bounds.bottom > gameArea.canvas.height) {
            this.moveUp();
        }
        super.moveByLetters();
    }
    update() {
        if (this.changeSideTimer++ >= this.changeSideTimerReset) {
            this.changeSide();
        }
        if (this.ghost) {
            if (this.isInCamera) {
                let ctx = gameArea.context;
                ctx.globalAlpha = 0.5;
            }
            if (this.ghostTimer++ == this.ghostTimerReset)
                this.ghost = false;
        }
        super.update();
        if (!this.ghost)
            if (this.state == COMPONENT_STATE_ALIVE)
                for (let i = 0; i < touchAnimations.length; i++) {
                    let touchAnimation = touchAnimations[i];
                    if (this.hittedBy.indexOf(touchAnimation) == -1)
                        if (this.checkHittedByTouch(touchAnimation)) {
                            let damage = Math.round(Math.random() * 2 + 1);
                            this.hp -= damage;
                            this.hittedBy.push(touchAnimation);
                            if (this.hp <= 0) this.dead();
                            else touchTextsAnimations.push(new TouchTextAnimation(touchAnimation.x, touchAnimation.y, damage, "red"));
                            /*for (var j = 0; j < damage * 2; j++)
                                touchFXAnimations.push(new TouchFXAnimation(this.x, this.y));*/
                            this.healthBar.hpUpdated();
                        }
                }
        this.healthBar.update();
    }
    dead() {
        this.state = COMPONENT_STATE_GONE;
        clearTimeout(this.healthBar.showTimeout);
        this.healthBar.show = false;
        touchTextsAnimations.push(new TouchTextAnimation(this.x, this.y, "DEAD", "red"));
    }
}