window.onload = function() {
    var numRows = numCols = 12;
    var imageDim = 30;
    var worldDim = imageDim * numCols;
    var game = new Phaser.Game(worldDim, worldDim, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    var allowInput = false;
    var player, vampire, exit;
    
    var level = 
        '............' + 
        '............' + 
        '............' + 
        '............' + 
        '............' + 
        '.P...+....V.' + 
        '............' + 
        '............' + 
        '............' + 
        '.....X......' + 
        '............' + 
        '............';

    function preload () {
        game.load.image('player', 'assets/player.png');
        game.load.image('vampire', 'assets/vampire.png');
        game.load.image('empty', 'assets/empty_tile.png');
        game.load.image('exit', 'assets/exit_tile.png');
        game.load.image('wall', 'assets/wall_tile.png');
    }
    
    function create () {
        game.stage.backgroundColor = '#dddddd';
        
        createLevel(level);
        
        allowInput = true;
    }
    
    function createLevel(level) {
        for (var i=0; i < level.length; ++i) {
            var row = i % numRows;
            var col = Math.floor(i / numCols);
            
            var x = imageDim * row;
            var y = imageDim * col;
            
            decodeAndPlaceSprite(level.charAt(i), x, y);
        }
        
        player.bringToTop();
        vampire.bringToTop();
    }
    
    function decodeAndPlaceSprite(str, x, y) {
        if (str == 'P') {  // Player
            game.add.sprite(x, y, 'empty');
            player = game.add.sprite(x, y, 'player');
        } else if (str == 'V') {  // Vampire
            game.add.sprite(x, y, 'empty');
            vampire = game.add.sprite(x, y, 'vampire');
        } else if (str == 'X') {  // Exit
            game.add.sprite(x, y, 'empty');
            exit = game.add.sprite(x, y, 'exit');
        } else if (str == '.') {  // Empty
            game.add.sprite(x, y, 'empty');
        } else if (str == '+') {  // Wall
            game.add.sprite(x, y, 'wall');
        }
    }
    
    function update() {
        if (!allowInput) {
            return;
        }
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {    
            movePlayerAndUpdateVampire(player.x, player.y - imageDim);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            movePlayerAndUpdateVampire(player.x + imageDim, player.y);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            movePlayerAndUpdateVampire(player.x, player.y + imageDim);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            movePlayerAndUpdateVampire(player.x - imageDim, player.y);
        }
    }
    
    function movePlayerAndUpdateVampire(x, y) {
        if (canMovePlayerTo(x, y)) {
            movePlayer(x, y);
            updateVampire();    
        }
    }
    
    function canMovePlayerTo(x, y) {
        var topOrLeftEdge = 0;
        var bottomOrRightEdge = (worldDim - imageDim);
        
        if (x < topOrLeftEdge || y < topOrLeftEdge || x > bottomOrRightEdge || y > bottomOrRightEdge) {
            return false;
        }
        
        return getTileAt(x, y) != "+";
    }
    
    function getTileAt(x, y) {
        var col = Math.floor(x / imageDim);
        var row = Math.floor(y / imageDim);
        var tileIndex = numCols * row + col;
        
        return level.charAt(tileIndex);
    }
    
    function movePlayer(x, y) {
        allowInput = false;
        
        var tween = game.add.tween(player).to({x: x, y: y}, 500, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function() {
            allowInput = true;
        });        
    }
    
    function updateVampire() {
        
    }
};