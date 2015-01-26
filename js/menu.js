var MainMenu = function(game) {};

MainMenu.prototype = {
    create: function() {
        this.play();
    }, 
    
    play: function() {
        this.game.state.start("Game");
    }
};
