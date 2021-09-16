const fs = require('fs');

function getSpecificPuzzle(level, puzzleId){
    let fileName = './puzzles/level_' + level +'.json';
    let data = fs.readFileSync(fileName, 'utf-8');
    data = JSON.parse(data); 
    const puzzle = data[puzzleId];

    return {puzzle, puzzleId};
}



module.exports = getSpecificPuzzle;