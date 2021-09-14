const fs = require('fs');

function getPuzzle(level){
    let fileName = './puzzles/level_' + level +'.json';
    let data = fs.readFileSync(fileName, 'utf-8');
    data = JSON.parse(data); 
    let length = data.length; 
    let randomPuzzleId = Math.floor(Math.random() * (length + 1) + 1);
    return {puzzle: data[randomPuzzleId], puzzleId: randomPuzzleId};
}



module.exports = getPuzzle;