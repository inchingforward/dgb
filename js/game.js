var Game = function(game) {
    this.numRows = this.numCols = 12;
    this.imageDim = 30;
    this.worldDim = this.imageDim * this.numCols;
    this.allowInput = false;
    this.player, this.vampire, this.exit = null;
    this.movementTweenDuration = 250;    
};

Game.prototype = {
    create: function() {
        this.level = 
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
            
        this.createLevel(this.level);
    }, 
    
    createLevel: function(level) {
        this.allowInput = false;

        for (var i=0; i < level.length; ++i) {
            var row = i % this.numRows;
            var col = Math.floor(i / this.numCols);
            
            var x = this.imageDim * row;
            var y = this.imageDim * col;
            
            this.decodeAndPlaceSprite(level.charAt(i), x, y);
        }
        
        this.player.bringToTop();
        this.vampire.bringToTop();
        
        this.allowInput = true;
    }, 
    
    decodeAndPlaceSprite: function(str, x, y) {
        if (str == 'P') {  // Player
            this.game.add.sprite(x, y, 'empty');
            this.player = this.game.add.sprite(x, y, 'player');
        } else if (str == 'V') {  // Vampire
            this.game.add.sprite(x, y, 'empty');
            this.vampire = this.game.add.sprite(x, y, 'vampire');
        } else if (str == 'X') {  // Exit
            this.game.add.sprite(x, y, 'empty');
            this.exit = this.game.add.sprite(x, y, 'exit');
        } else if (str == '.') {  // Empty
            this.game.add.sprite(x, y, 'empty');
        } else if (str == '+') {  // Wall
            this.game.add.sprite(x, y, 'wall');
        }
    }, 
    
    update: function() {
        if (!this.allowInput) {
            return;
        }
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {    
            this.movePlayerAndUpdateVampire(this.player.x, this.player.y - this.imageDim);
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.movePlayerAndUpdateVampire(this.player.x + this.imageDim, this.player.y);
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.movePlayerAndUpdateVampire(this.player.x, this.player.y + this.imageDim);
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.movePlayerAndUpdateVampire(this.player.x - this.imageDim, this.player.y);
        }
    }, 
    
    movePlayerAndUpdateVampire: function(x, y) {
        if (this.canMoveTo(x, y)) {
            this.movePlayer(x, y);
        }
    }, 
    
    vampireMoved: function() {
        if (this.vampire.x == this.player.x && this.vampire.y == this.player.y) {
            this.game.state.start("GameOver", true, false, false);
        } else {
            this.allowInput = true;
        }
    }, 
    
    canMoveTo: function(x, y) {
        var topOrLeftEdge = 0;
        var bottomOrRightEdge = (this.worldDim - this.imageDim);
        
        if (x < topOrLeftEdge || y < topOrLeftEdge || x > bottomOrRightEdge || y > bottomOrRightEdge) {
            return false;
        }
        
        return this.getTileAt(x, y) != "+";
    }, 
    
    getTileAt: function(x, y) {
        var col = Math.floor(x / this.imageDim);
        var row = Math.floor(y / this.imageDim);
        var tileIndex = this.numCols * row + col;
        
        return this.level.charAt(tileIndex);
    }, 
    
    movePlayer: function(x, y) {
        this.allowInput = false;
        
        var tween = this.game.add.tween(this.player).to({x: x, y: y}, this.movementTweenDuration, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function() {
            if (this.player.x == this.exit.x && this.player.y == this.exit.y) {
                this.levelCompleted();
                return;
            }

            if (this.player.x == this.vampire.x && this.player.y == this.vampire.y) {
                // The silly player moved onto the vampire's spot.
                this.vampireMoved();
                return;
            }
            
            if (this.player.x < this.vampire.x) {
                if (this.canMoveTo(this.vampire.x - this.imageDim, this.vampire.y)) {
                    this.allowInput = false
                    var tween = this.game.add.tween(this.vampire).to({x: this.vampire.x - this.imageDim, y: this.vampire.y}, this.movementTweenDuration, Phaser.Easing.Linear.None, true);
                    tween.onComplete.add(function() {
                        this.vampireMoved();
                    }, this);
                    return;
                }
            }

            if (this.player.x > this.vampire.x) {
                if (this.canMoveTo(this.vampire.x + this.imageDim, this.vampire.y)) {
                    this.allowInput = false
                    var tween = this.game.add.tween(this.vampire).to({x: this.vampire.x + this.imageDim, y: this.vampire.y}, this.movementTweenDuration, Phaser.Easing.Linear.None, true);
                    tween.onComplete.add(function() {
                        this.vampireMoved();
                    }, this);
                    return;
                }
            }

            if (this.player.y < this.vampire.y) {
                if (this.canMoveTo(this.vampire.x, this.vampire.y - this.imageDim)) {
                    this.allowInput = false
                    var tween = this.game.add.tween(this.vampire).to({x: this.vampire.x, y: this.vampire.y - this.imageDim}, this.movementTweenDuration, Phaser.Easing.Linear.None, true);
                    tween.onComplete.add(function() {
                        this.vampireMoved();
                    }, this);
                    return;
                }
            }

            if (this.player.y > this.vampire.y) {
                if (this.canMoveTo(this.vampire.x, this.vampire.y + this.imageDim)) {
                    this.allowInput = false
                    var tween = this.game.add.tween(this.vampire).to({x: this.vampire.x, y: this.vampire.y + this.imageDim}, this.movementTweenDuration, Phaser.Easing.Linear.None, true);
                    tween.onComplete.add(function() {
                       this.vampireMoved();
                    }, this);
                    return;
                }
            }
        }, this);
    }, 
    
    levelCompleted: function() {
        this.game.state.start("GameOver", true, false, true);
    }, 
};