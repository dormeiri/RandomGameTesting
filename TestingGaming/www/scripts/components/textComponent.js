class TextComponent {
    constructor(size, x, y, align,color,cameraRelative) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.text = "";
        this.align = align
        this.color = color;
        this.cameraRelative = cameraRelative == undefined ? false : cameraRelative;
    }
    set currentText(str) {
        this.text = str;
    }
    update() {
        let context = HUD.context;
        context.font = this.size + "px Arial";
        context.fillStyle = this.color;
        context.textAlign = this.align;
        context.fillText(this.text, this.x - (this.cameraRelative ? camera.x : 0),
                                this.y - (this.cameraRelative ? camera.y : 0));
        context.restore();
        context.save();
    }
}