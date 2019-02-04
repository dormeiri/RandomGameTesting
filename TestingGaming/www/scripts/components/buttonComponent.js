var BUTTON_STATES = {
    rest: 0,
    touchUp: 1,
    touchDown: 2
};

class ButtonComponent {
    constructor(x, y, width, height, color, touchingColor, touchDownAction, touchUpAction) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.touchingColor = touchingColor;
        this.touchDownAction = touchDownAction;
        this.touchUpAction = touchUpAction;
        this.state = BUTTON_STATES.rest;
        this.touchIndex = -1;
    }
    checkTouching(touchX, touchY) {
        return (touchX > this.x &&
            touchX < this.x + this.width &&
            touchY > this.y &&
            touchY < this.y + this.height);
    }

    checkTouches() {
        if (touchEvent == null || touchEvent == undefined) return false;
        for (let i = 0; i < touchEvent.touches.length; i++) {
            {
                if (this.checkTouching(touchEvent.touches[i].clientX, touchEvent.touches[i].clientY)) {
                    this.touchIndex = i;
                    return true;
                }
            }
        }
        this.touchIndex = -1;
        return false;
    }
    update() {
        if (this.checkTouches()) {
            if (this.state == BUTTON_STATES.rest) {
                if (this.touchDownAction != null)
                    this.touchDownAction();
                this.state = BUTTON_STATES.touchDown;
            }
        }
        else if (this.state == BUTTON_STATES.touchDown) {
            if (this.touchUpAction != null)
                this.touchUpAction();
            this.state = BUTTON_STATES.touchUp;
        }
        else if (this.state == BUTTON_STATES.touchUp) {
            this.state = BUTTON_STATES.rest;
        }

        let context = HUD.context;
        context.fillStyle = this.state == BUTTON_STATES.touchDown ? this.touchingColor : this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.restore();
        context.save();
    }
}