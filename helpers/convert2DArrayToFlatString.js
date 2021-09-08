

/**
 * Takes puzzle in form of a 2D Array of string elements and returns the puzzle as a flat comma delmited string
 * 
 * @param {Array<<Array<String>>} arrayBoard 
 * @returns {String}
 */
function convert2DArrayToFlatString(arrayBoard){
    let flatPuzzle = '';
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            flatPuzzle += arrayBoard[i][j];
            if(!(i=== 9 && j === 9)) flatPuzzle += ',';
        }
    }
    return flatPuzzle; 
}


module.exports = convert2DArrayToFlatString; 