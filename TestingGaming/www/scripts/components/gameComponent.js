const COMPONENT_STATE_ALIVE = 1;
const COMPONENT_STATE_GONE = 0;

class GameComponent {

    constructor(width, height, x, y, speed, render, leftBoundReduce, rightBoundReduce, topBoundReduce, bottomBoundReduce, followCamera) {
        this.movingDirection = "";
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.boundsReduce = {
            left: leftBoundReduce == undefined ? 0 : leftBoundReduce,
            right: rightBoundReduce == undefined ? 0 : rightBoundReduce,
            top: topBoundReduce == undefined ? 0 : topBoundReduce,
            bottom: bottomBoundReduce == undefined ? 0 : bottomBoundReduce
        };
        this.speed = speed;
        this.moveTo = { x: null, y: null };
        this.state = COMPONENT_STATE_ALIVE;
        this.render = render;
        this.stuck = {
            right: -1,
            left: -1,
            top: -1,
            bottom: -1
        };
        this.shooting = false;
    }

    setMoveTo(x, y) {
        this.moveTo.x = x == null ? null : (x - this.width / 2);
        this.moveTo.y = y == null ? null : (y - this.height / 2);
    }

    get center() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
    }

    get bounds() {
        return {
            right: this.x + this.width - this.boundsReduce.right,
            left: this.x + this.boundsReduce.left,
            top: this.y + this.boundsReduce.top,
            bottom: this.y + this.height - this.boundsReduce.bottom
        }
    }

    calculateMovingSpeedByLetters() {
        if (this.movingDirection.length > 1)
            return this.speed / Math.sqrt(2);
        else
            return this.speed;
    }

    removeMovingDirection(letter) { this.movingDirection = this.movingDirection.split(letter).join(''); }
    addMovingDirection(letter) {
        this.removeMovingDirection(letter);
        this.movingDirection += letter;
    }

    moveUp() {
        this.removeMovingDirection('d');
        this.addMovingDirection('u');
    }
    moveDown() {
        this.removeMovingDirection('u');
        this.addMovingDirection('d');
    }
    moveLeft() {
        this.removeMovingDirection('r');
        this.addMovingDirection('l');
    }
    moveRight() {
        this.removeMovingDirection('l');
        this.addMovingDirection('r');
    }

    moveByLetters() {
        if (this.movingDirection.indexOf('u') != -1) {
            this.y -= this.calculateMovingSpeedByLetters();
        }
        else if (this.movingDirection.indexOf('d') != -1) {
            this.y += this.calculateMovingSpeedByLetters();
        }
        if (this.movingDirection.indexOf('l') != -1) {
            this.x -= this.calculateMovingSpeedByLetters();
        }
        else if (this.movingDirection.indexOf('r') != -1) {
            this.x += this.calculateMovingSpeedByLetters();
        }
    }
    calculateMoveByCordinatesSpeed() {
        let xDist = this.moveTo.x - this.x;
        let yDist = this.moveTo.y - this.y;
        let length = Math.sqrt(xDist * xDist + yDist * yDist);
        let xSpeed = xDist / length * this.speed;
        let ySpeed = yDist / length * this.speed;
        return {
            xSpeed: xSpeed,
            ySpeed: ySpeed
        };
    }
    moveByCordinates() {
        if (this.shooting) this.speed /= 2;
        let speed = this.calculateMoveByCordinatesSpeed();
        if (this.shooting) this.speed *= 2;

        let xHitIndex = -1;
        this.x += speed.xSpeed;
        for (let i = 0; i < obstaclesInCamera.length; i++) {
            if (obstaclesInCamera[i].checkHitComponent(this)) {
                this.x -= speed.xSpeed;
                xHitIndex = i;
                break;
            }
        }
        this.y += speed.ySpeed;
        for (let i = 0; i < obstaclesInCamera.length; i++) {
            if (xHitIndex == i) continue;
            if (obstaclesInCamera[i].checkHitComponent(this)) {
                this.y -= speed.ySpeed;
                break;
            }
        }
    }

    isInCamera() {
        let left = this.bounds.right < camera.bounds.left,
            right = this.bounds.left > camera.bounds.right,
            bottom = this.bounds.top > camera.bounds.bottom,
            top = this.bounds.bottom < camera.bounds.top;
        return !(left || right || bottom || top)
    }

    update() {
        if (this.moveTo.x != null)
            this.moveByCordinates()
        else
            this.moveByLetters();

        let context = gameArea.context;
        if (this.isInCamera()) {
            if (typeof this.render == "string") {
                context.fillStyle = this.render;
                context.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
            }
            else if (this.render instanceof Sprite) {
                this.render.drawAnimation(context, this.x - camera.x, this.y - camera.y);
            }
        }
        context.restore();
        context.save();
    }
}