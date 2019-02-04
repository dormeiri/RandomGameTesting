class HealthBar {
    constructor(enemy) {
        this.enemy = enemy;
        this.show = false;
        this.showTimeout = null;
    }
    get x() {
        return this.enemy.x;
    }
    get y() {
        return this.enemy.y - 15;
    }
    get hp() {
        return this.enemy.hp;
    }
    get maxHp() {
        return this.enemy.maxHp;
    }
    hpUpdated() {
        this.show = true;
        if (this.showTimeout != null) clearTimeout(this.showTimeout);
        this.showTimeout = setTimeout(function (healthBar) {
            healthBar.show = false;
        }, 2000, this)
    }
    update() {
        if (this.show) {
            let context = HUD.context;
            context.fillStyle = "black";
            context.fillRect(this.x - camera.x, this.y - camera.y, this.enemy.width, 10);
            context.restore();
            context.save();

            let percent = this.hp / this.maxHp;
            context.fillStyle = percent < 0.5 ? "yellow" : "green";
            context.fillRect(this.x - camera.x + 1, this.y - camera.y + 1, percent * (this.enemy.width - 2), 8);
            context.restore();
            context.save();
        }
    }
}