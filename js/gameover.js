GameOver = function(game) {};

GameOver.prototype = {
    init: function(won) {
        this.won = won;
    }, 
    
    create: function() {
        var style = { font: "24px Arial", fill: "#ccc", align: "center" };
        
        if (this.won) {
            this.game.add.text(100, 50, "You escaped!", style);
        } else {
            this.game.add.text(60, 50, "You have been bitten!", style);
        }
    }
};