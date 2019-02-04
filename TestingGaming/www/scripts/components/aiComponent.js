class AIComponent extends GameComponent {

    constructor(width, height, speed, color, leftBoundReduce, rightBoundReduce, topBoundReduce, bottomBoundReduce) {
        let p = AIComponent.randomPlacer(width, height);
        super(width, height, p.x, p.y, speed, color);

        while (this.checkHitPlayer()) {
            p = AIComponent.randomPlacer(width, height);
            this.x = p.x;
            this.y = p.y;
        }

        this.ghost = false;
        this.hitPlayerAction = function () { };
    }

    static randomPlacer(componentWidth, componentHeight) {
        let p = {
            x: Math.random() * (gameArea.canvas.width - componentWidth),
            y: Math.random() * (gameArea.canvas.height - componentHeight)
        };
        return p;
    }

    checkHitComponent(component, offset) {
        if (offset == undefined) offset = 0;
        var
            right = (component.bounds.right + offset < this.bounds.left),
            left = (component.bounds.left - offset > this.bounds.right),
            top = (component.bounds.top - offset > this.bounds.bottom),
            bottom = (component.bounds.bottom + offset < this.bounds.top);
        return !(right || left || top || bottom);
    }

    checkHitPlayer() {
        return this.checkHitComponent(player);
    }

    moveAwayFromAiComponent(component) {
        if (this.checkHitComponent(component, this.calculateMovingSpeedByLetters())) {
            if (Math.abs(component.center.x - this.center.x) > Math.abs(component.center.y - this.center.y)) {
                if (component.center.x > this.center.x) this.moveLeft();
                else this.moveRight();
            }
            else {
                if (component.center.y > this.center.y) this.moveUp();
                else this.moveDown();
            }
        }
    }

    update() {
        if (this.state == COMPONENT_STATE_ALIVE) {
            super.update();
            if (!this.ghost)
                if (this.checkHitPlayer())
                    this.hitPlayerAction();
            for (let i = 0; i < enemies.length - 1; i++) {
                let component = enemies[i];
                if (component != this)
                    this.moveAwayFromAiComponent(component);
            }
            for (let i = 0; i < coins.length - 1; i++) {
                let component = coins[i];
                if (component != this)
                    this.moveAwayFromAiComponent(component);
            }
            for (let i = 0; i < obstacles.length - 1; i++) {
                let obstacle = obstacles[i];
                if (!this.fly)
                    this.moveAwayFromAiComponent(obstacle);
            }
        }
    }
}