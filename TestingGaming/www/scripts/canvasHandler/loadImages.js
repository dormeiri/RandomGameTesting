var images;
var assetsLoaded = 0;
var assetsLoading = 0;


function loadAssets(callback) {
    function loadImage(imageSrc) {
        assetsLoading++;
        let image = document.createElement('img');
        image.addEventListener('load', function (event) {
            if (++assetsLoaded == assetsLoading)
                callback();
        });
        image.src = imageSrc;
        return image;
    };
    images = {
        backgrounds: {
            bg1: loadImage('images/backgrounds/bg1.png')
        },
        sprites: {
            player: {
                idle: {
                    right: loadImage('images/sprites/player/idle/right.png'),
                    left: loadImage('images/sprites/player/idle/left.png'),
                    up: loadImage('images/sprites/player/idle/up.png'),
                    down: loadImage('images/sprites/player/idle/down.png')
                },
                walk: {
                    right: loadImage('images/sprites/player/walk/right.png'),
                    left: loadImage('images/sprites/player/walk/left.png'),
                    up: loadImage('images/sprites/player/walk/up.png'),
                    down: loadImage('images/sprites/player/walk/down.png')
                }
            },
            enemy: {
                bat: loadImage('images/sprites/enemy/bat.png'),
                frog: loadImage('images/sprites/enemy/frog.png'),
                skeleton: loadImage('images/sprites/enemy/skeleton.png'),
                ghost: loadImage('images/sprites/enemy/ghost.png')
            }
        }
    };
}