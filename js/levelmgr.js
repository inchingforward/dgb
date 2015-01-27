LevelManager = function() {
    this.levels = [
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
        '............', 
        
        '............' +  
        '.....+......' + 
        '.....+......' + 
        '.....+......' + 
        '.....+......' + 
        '.P...+....V.' + 
        '.....+......' + 
        '.....+......' + 
        '.....+......' + 
        '.....X......' + 
        '............' + 
        '............',
    ];
    this.currentLevelIdx = 0;
};

LevelManager.prototype = {
    currentLevel: function() {
        return this.levels[this.currentLevelIdx];
    }, 
    
    isAtLastLevel: function() {
        return this.levels.length == this.currentLevelIdx + 1;
    }, 
    
    advanceLevel: function() {
        this.currentLevelIdx++;
    }
};