window.onload = function() {
    var imageDim = 30;
    var worldDim = imageDim * 12;
    var game = new Phaser.Game(worldDim, worldDim, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    var allowInput = false;
    var player, vampire, exit;

    function preload () {
        game.load.image('player', 'assets/player.png');
        game.load.image('vampire', 'assets/vampire.png');
        game.load.image('empty', 'assets/empty_tile.png');
        game.load.image('exit', 'assets/exit_tile.png');
        game.load.image('wall', 'assets/wall_tile.png');
    }

    function create () {
        game.stage.backgroundColor = '#ccc';
        
        // Adjust center to image offset.
        var centerX = game.world.centerX - (imageDim / 2);
        var centerY = game.world.centerY - (imageDim / 2);
        
        player = game.add.sprite(centerX, centerY, 'player');
        vampire = game.add.sprite(centerX + (imageDim * 2), centerY, 'vampire');        
        exit = game.add.sprite(centerX, 0, 'exit');
        
        allowInput = true;
    }
    
    function update() {
        if (!allowInput) {
            return;
        }
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            console.log("up");
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            console.log("right");
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            console.log("down");
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            console.log("left");
        }
    }
};