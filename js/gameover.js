GameOver = function(game) {};

GameOver.prototype = {
    create: function() {
        var style = { font: "24px Arial", fill: "#ccc", align: "center" };
        this.game.add.text(60, 50, "You have been bitten!", style);
    }, 
};