const srcTileSize = 16;
const tileScale = 2;
const OBSTACLE_TYPES = {
    short: "short",
    tall: "tall",
    notObstacle: ""
}

class WorldMapTile {
    constructor(srcX, srcY, destX, destY, image, obstacleType) {
        this._srcXpx = srcX * srcTileSize;
        this._srcYpx = srcY * srcTileSize;
        this._destXpx = destX * srcTileSize * tileScale;
        this._destYpx = destY * srcTileSize * tileScale;
        this.image = image;
        this.obstacleType = obstacleType;
    }

    get bounds() {
        return {
            left: this._destXpx,
            right: this._destXpx + srcTileSize * tileScale,
            top: this._destYpx,
            bottom: this._destYpx + srcTileSize * tileScale
        }
    }
    get center() {
        return {
            x: this._destXpx + (srcTileSize * tileScale) / 2,
            y: this._destYpx + (srcTileSize * tileScale) / 2
        }
    }

    get srcX() { return this._srcXpx / srcTileSize; }
    set srcX(value) { this._srcXpx = value * srcTileSize; }

    get srcY() { return this._srcYpx / srcTileSize; }
    set srcY(value) { this._srcYpx = value * srcTileSize; }

    get destX() { return this._destXpx / (srcTileSize * tileScale) }
    set destX(value) { this._destXpx = value * srcTileSize * tileScale; }

    get destY() { return this._destYpx / (srcTileSize * tileScale); }
    set destY(value) { this._destYpx = value * srcTileSize * tileScale; }

    checkHitComponent(component) {
        var
            right = (component.bounds.right < this.bounds.left),
            left = (component.bounds.left > this.bounds.right),
            top = (component.bounds.top > this.bounds.bottom),
            bottom = (component.bounds.bottom < this.bounds.top);
        return !(right || left || top || bottom);
    }

    update() {
        let context = backgroundLayer.context;
        context.drawImage(this.image,
            this._srcXpx, this._srcYpx, srcTileSize, srcTileSize,
            this._destXpx - camera.x, this._destYpx - camera.y, srcTileSize * tileScale, srcTileSize * tileScale
        );
    }
}