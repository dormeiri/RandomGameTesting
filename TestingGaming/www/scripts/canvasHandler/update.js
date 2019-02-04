function updateGameArea() {
    if (gameArea.enemyRespawnTimer++ == gameArea.enemyRespawnTimerReset) {
        gameArea.enemyRespawnTimer = 0;
        respawnEnemy();
    }
    if (gameArea.coinRespawnTimer++ == gameArea.coinRespawnTimerReset) {
        gameArea.coinRespawnTimer = 0;
        respawnCoin();
    }
    if (touchEvent != null && player.shooting)
        if (touchLayer.touchAnimationTimer++ == touchLayer.touchAnimationTimerReset) {
            touchLayer.touchAnimationTimer = 0;
            setTouchAnimation();
        }
    camera.updateCordinates();
    gameArea.clear();
    HUD.clear();
    backgroundLayer.clear();
    backgroundLayer.updateBackground();
    standStillButton.update();
    touchPos = getTouchPosition(gameArea.canvas);
    player.update();

    for (i = 0; i < enemies.length; i++) {
        if (enemies[i].state == COMPONENT_STATE_GONE)
            enemies.splice(i--, 1);
        else
            enemies[i].update();
    }

    for (i = 0; i < coins.length; i++) {
        if (coins[i].state == COMPONENT_STATE_GONE)
            coins.splice(i--, 1);
        else
            coins[i].update();
    }

    for (i = 0; i < touchAnimations.length; i++) {
        if (touchAnimations[i].state == COMPONENT_STATE_GONE)
            touchAnimations.splice(i--, 1);
        else
            touchAnimations[i].update();
    }

    for (i = 0; i < touchFXAnimations.length; i++) {
        if (touchFXAnimations[i].state == COMPONENT_STATE_GONE)
            touchFXAnimations.splice(i--, 1);
        else
            touchFXAnimations[i].update();
    }

    for (i = 0; i < touchTextsAnimations.length; i++) {
        if (touchTextsAnimations[i].state == COMPONENT_STATE_GONE)
            touchTextsAnimations.splice(i--, 1);
        else
            touchTextsAnimations[i].update();
    }

    pointsText.currentText = points;
    pointsText.update();
}

//Functions
function setTouchAnimation() {
    for (let i = 0; i < Math.random() * 2; i++)
        touchAnimations.push(new TouchAnimation(touchPos.x, touchPos.y));
}
function getTouchPosition(canvas) {
    if (touchEvent == null || touchEvent == undefined) return { x: null, y: null };
    let rect = canvas.getBoundingClientRect();
    let touchIndex =
        standStillButton.touchIndex == -1 ?
            0 :
            standStillButton.touchIndex == 0 ?
                touchEvent.touches.length > 1 ?
                    1 :
                    0 :
                0;
    return {
        x: touchEvent.touches[touchIndex].clientX - rect.left + camera.x,
        y: touchEvent.touches[touchIndex].clientY - rect.top + camera.y
    };
}

function respawnEnemy() {
    let random = Math.random();
    enemies.push(random > 0.75 ? new Bat() : new Frog());
}

function respawnCoin() {
    coins.push(new Coin());
}

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}