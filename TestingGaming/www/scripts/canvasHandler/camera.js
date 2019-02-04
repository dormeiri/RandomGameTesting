class Camera {
    constructor(canvas, followComponent, zoom) {
        this.zoom = zoom;
        this.canvas = canvas;
        this.followComponent = followComponent;
        this.x = 0;
        this.y = 0;
    }

    get bounds() {
        return {
            left: this.x,
            right: this.x + this.canvas.width,
            top: this.y,
            bottom: this.y + this.canvas.height
        }
    }

    updateCordinates() {
        this.x = this.followComponent.center.x - screen.width / 2;
        this.y = this.followComponent.center.y - screen.height / 2;

        if (this.x < 0) this.x = 0;
        else if (this.x + screen.width > this.canvas.width) this.x = this.canvas.width - screen.width

        if (this.y < 0) this.y = 0;
        else if (this.y + screen.height > this.canvas.height) this.y = this.canvas.height - screen.height
    }
}