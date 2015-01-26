var Preload = function(game) {};

Preload.prototype = {
    preload: function() {
        this.game.load.image('player', 'assets/player.png');
        this.game.load.image('vampire', 'assets/vampire.png');
        this.game.load.image('empty', 'assets/empty_tile.png');
        this.game.load.image('exit', 'assets/exit_tile.png');
        this.game.load.image('wall', 'assets/wall_tile.png');
    }, 
    
    create: function() {
        this.game.state.start("MainMenu");
    }
};
