const worldWidth = 30;
const worldHeight = 30;

var player;
var coins;
var enemies;
var camera;
var touchPos;
var pointsText;
var gameStatusText;
var standStillButton;
var points;
var gameStateType = {
    gameOver: "Game Over",
    playing: "Playing",
    pause: "Pause"
}
var gameState;
var touchTextsAnimations;
var touchAnimations;
var touchFXAnimations;
var touchEvent;
var backgroundTiles;
var obstacles;
var obstaclesInCamera;

function startGame() {
    backgroundTiles = new Array(worldHeight);
    obstacles = [];
    obstaclesInCamera = [];
    points = 0;
    coins = [];
    enemies = [];
    touchTextsAnimations = [];
    touchAnimations = [];
    touchFXAnimations = [];

    backgroundLayer.start();
    gameArea.start();
    HUD.start();
    touchLayer.start();

    player = new Player();
    camera = new Camera(gameArea.canvas, player, 1)

    pointsText = new TextComponent(30, 10, 40, 'left');
    gameStatusText = new TextComponent(60, screen.width / 2, screen.height / 2, 'center', "black");
    standStillButton = new ButtonComponent(30, screen.height - 30 - 50, 50, 50, "grey", "darkgrey",
        function () { player.shooting = true; },
        function () { player.shooting = false; });

}

//Setting up canvas layers
var backgroundLayer = {
    canvas: document.getElementById("canvas-background"),
    start: function () {
        this.canvas.width = screen.width;
        this.canvas.height = screen.height;
        this.context = this.canvas.getContext("2d");
        this.context.globalAlpha = 1;
        for (let i = 0; i < worldHeight; i++) {
            backgroundTiles[i] = new Array(worldWidth);
            for (let j = 0; j < worldWidth; j++) {
                let sy = 1, sx = 1, obstacleType = OBSTACLE_TYPES.notObstacle;
                let randomTile = Math.random();
                if (randomTile < 0.025) {
                    sx = 0;
                    sy = 1;
                    obstacleType = OBSTACLE_TYPES.notObstacle;
                }
                else if (randomTile < 0.05) {
                    sx = 0;
                    sy = 2;
                    obstacleType = OBSTACLE_TYPES.short;
                }
                else if (randomTile < 0.075) {
                    sx = 1;
                    sy = 2;
                    obstacleType = OBSTACLE_TYPES.short;
                }
                else if (randomTile < 0.1) {
                    sx = 2;
                    sy = 2;
                    obstacleType = OBSTACLE_TYPES.tall;
                }
                backgroundTiles[i][j] = new WorldMapTile(sx, sy, j, i, images.backgrounds.bg1, obstacleType);
                if (obstacleType != OBSTACLE_TYPES.notObstacle)
                    obstacles.push(backgroundTiles[i][j]);
            }
        }
        this.cameraLeftTile;
        this.cameraRightTile;
        this.cameraTopTile;
        this.cameraBottomTile;
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    updateBackground: function () {
        this.cameraLeftTile = Math.floor(camera.bounds.left / (srcTileSize * tileScale));
        this.cameraRightTile = Math.ceil(camera.bounds.right / (srcTileSize * tileScale));
        this.cameraTopTile = Math.floor(camera.bounds.top / (srcTileSize * tileScale));
        this.cameraBottomTile = Math.ceil(camera.bounds.bottom / (srcTileSize * tileScale));

        if (this.cameraLeftTile < 0) this.cameraLeftTile = 0;
        if (this.cameraRightTile >= worldWidth) this.cameraRightTile = worldWidth;
        if (this.cameraTopTile < 0) this.cameraTopTile = 0;
        if (this.cameraBottomTile >= worldHeight) this.cameraBottomTile = worldHeight;

        obstaclesInCamera = [];
        for (let i = this.cameraTopTile; i < this.cameraBottomTile; i++) {
            for (let j = this.cameraLeftTile; j < this.cameraRightTile; j++) {
                backgroundTiles[i][j].update();
                if (backgroundTiles[i][j].obstacleType)
                    obstaclesInCamera.push(backgroundTiles[i][j]);
            }
        }
    }
}

var gameArea = {
    canvas: document.getElementById("canvas-game"),
    start: function () {
        this.canvas.width = worldWidth * srcTileSize * tileScale;
        this.canvas.height = worldHeight * srcTileSize * tileScale;
        this.context = this.canvas.getContext("2d");
        this.context.globalAlpha = 1;
        this.context.save();
        this.enemyRespawnTimerReset = 500;
        this.coinRespawnTimerReset = 500;
        this.enemyRespawnTimer = 0;
        this.coinRespawnTimer = 0;
        this.resume();
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    gameOver: function () {
        this.stop();
        HUD.gameOver();
        gameState = gameStateType.gameOver;
    },
    addPoint: function () {
        points++;
    },
    stop: function () {
        clearInterval(this.interval);
        touchLayer.gameOver();
    },
    pause: function () {
        this.stop();
        gameStatusText.currentText = gameStateType.pause
        gameState = gameStateType.pause;
    },
    resume: function () {
        this.interval = setInterval(updateGameArea, 20);
        gameState = gameStateType.playing;
    }
}

var HUD = {
    canvas: document.getElementById("canvas-hud"),
    start: function () {
        this.canvas.width = screen.width;
        this.canvas.height = screen.height;
        this.context = this.canvas.getContext("2d");
        this.context.save();
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    gameOver: function () {
        gameStatusText.currentText = "Game Over";
        gameStatusText.update();
    }
}


var touchEvents = {
    touchMove: function (event) {
        touchEvent = event;
    },
    touchStart: function (event) {
        touchEvent = event;
    },
    touchEnd: function (event) {
        touchLayer.touchAnimationTimer = 0;
        touchEvent = null;
    },
    click: function () {
        if (gameState == gameStateType.gameOver) startGame();
    }
}

var touchLayer = {
    canvas: document.getElementById("canvas-mouse-event"),
    start: function () {
        this.canvas.width = gameArea.canvas.width;
        this.canvas.height = gameArea.canvas.height;
        this.canvas.style.zIndex = "1";
        this.canvas.addEventListener('touchmove', touchEvents.touchMove);
        this.canvas.addEventListener('touchstart', touchEvents.touchStart);
        this.canvas.addEventListener('touchend', touchEvents.touchEnd);
        this.canvas.removeEventListener('click', touchEvents.click);
        this.touchAnimationTimerReset = 10;
        this.touchAnimationTimer = 0;
    },
    gameOver: function () {
        this.canvas.removeEventListener("touchmove", touchEvents.touchMove);
        this.canvas.removeEventListener("touchstart", touchEvents.touchStart);
        this.canvas.removeEventListener("touchend", touchEvents.touchEnd);
        this.canvas.addEventListener('click', touchEvents.click);
    }
}