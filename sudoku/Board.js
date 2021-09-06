
class Cell {
    constructor(value = 0, rowI, colI) {
        this._value = value;
        this._possibleValues = new Set();
        this.indices = [rowI, colI];
    }

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
    }

    get possibleValues() {
        return this._possibleValues;
    }

    addPossibleValue(val) {
        this._possibleValues.add(val);
    }

    /**  takes an array of characters where each number is a string value
     * 
     *   returns the cooresponding array of cells 
     */
    static buildCells(stringArray) {
        return stringArray.map(char => {
            return new Cell(char);
        });
    }


}

class Board {

    // takes a string where the rows of the puzzle are line delimeted and the columns comma delimeted
    // 0 stands for an empty cell value
    /*
        example of first two rows
            1,3,4,9,0,5,7,6,0
            0,2,6,9,3,1,8,0,7
    */

    // calcuate is a boolean specifying whether or not the cells should have their possible values calculated
    // default value is false
    constructor(puzzleString, { calculate = false, rowI = null, colI = null, value = null } = {}) {
        this.puzzle = [];
        this.blankCellsIndices = [];
        this.isCalculated = calculate; 

        puzzleString = puzzleString.split(/\r?\n/);
        for (let i = 0; i < 9; i++) {
            let row = puzzleString[i];
            row = row.trim();
            row = row.split(',');

            for (let j = 0; j < 9; j++) {
                if (row[j] === '0') {
                    if (i === rowI && j === colI) {
                        row[j] = value;
                        
                    }
                    else {
                        this.blankCellsIndices.push([i, j]);
                    }
                }
                else if(i === rowI && j === colI){
                    row[j] = value; 
                    this.blankCellsIndices.push([i, j]);
                }
            }

            // convert array of characters to array of cells
            row = row.map((char, colI) => new Cell(char, i, colI));
            this.puzzle.push(row);


        }
        // adds property missingCells to board
        Board.countMissingCells(this);
        
        if(this.isCalculated){
            Board.calculateMissingValues(this);
        }
    }

    /**
     * row number will start at 1
     * returns a copy of the row as an array of Cell objects
     * @param {Board} board 
     * @param {Number} row 
     */
    static getRow(board, row) {
        return [...board.puzzle[row - 1]];
    }

    // col number will start at 1
    // returns a copy of the col
    static getCol(board, col) {
        const results = [];
        for (let row of board.puzzle) {
            results.push(row[col - 1]);
        }

        return results;
    }

    // box number will start at 1 and counts move left to right and then up to down
    // returns a copy of the box

    static getBox(board, box) {
        const results = [];

        // startRow will be the row index the box begins in. 
        // endRow will be the row index the box goes up to (exclusively).
        let startRow = null;
        let endRow = null;
        if ([1, 2, 3].includes(box)) {
            startRow = 0;
            endRow = 3;
        }
        else if ([4, 5, 6].includes(box)) {
            startRow = 3;
            endRow = 6;
        }
        else {
            startRow = 6;
            endRow = 9;
        }

        // startCol will be the column index the box starts at.
        // endCol will be the column index the box goes up to (exclusively).
        let startCol = null;
        let endCol = null;
        if ([1, 4, 7].includes(box)) {
            startCol = 0;
            endCol = 3;
        }
        else if ([2, 5, 8].includes(box)) {
            startCol = 3;
            endCol = 6;
        }
        else {
            startCol = 6;
            endCol = 9;
        }

        for (let i = startRow; i < endRow; i++) {
            let row = board.puzzle[i];
            results.push(...row.slice(startCol, endCol));
        }
        return results;
    }

    /** 
     *  takes an array of cells and returns a string representing them comma delmited
     */
    static convertCellsToCharacters(cells) {
        return cells.map(cell => cell.value).join(',');
    }

    static toString(board, fancy=false) {
        let boardString = (fancy) ? ('\t1 2 3 4 5 6 7 8 9\n') : '';
        for (let i = 1; i < 10; i++) {
            if (boardString) {
                boardString += '\n';
            }
            let row = board.puzzle[i - 1]; 
            row = Board.convertCellsToCharacters(row);
            if(fancy){
                row = row.split(',');
                row = row.join(' ');
                boardString += `${i}\t`;
            }
            boardString += row;
            if(fancy){
                boardString += `\t${i}`;
            }
        }
        if(fancy){
            boardString += '\n\n\t1 2 3 4 5 6 7 8 9';
        }
        return boardString;
    }


   static toFancyString(board){
       let boardString = Board.toString(board); 
   }

    /**
     * returns A CLONED board with the value added to specified cell
     * 
     * row and col start at 1
     * 
     * returns undefined if new board is not valid
     * 
     * throw error cell is not blank
     * @param {Board} board 
     * @param {Number} row starts at 1 
     * @param {Number} col Starts at 1
     * @param {String} value 
     * @param {Boolean} calculate 
     * @returns {Board}
     */
    static addValue(board, row, col, value, calculate = false) {
        const cell = board.puzzle[row - 1][col - 1];
        if (cell.value !== '0') {
            throw new Error(`Error! Cell row:${row} col:${col} = ${cell.value}! Can't fill cell because it is not blank`);
        }

        if (!Board.isValidFor(board, row, col, value)) {
            return undefined;
        }
        const clonedBoard = new Board(Board.toString(board), { calculate, rowI: row - 1, colI: col - 1, value });

        return clonedBoard;
    }


    /**
     * 
     * returns new board where the specified cell is now blank
     * 
     * throws error if given a cell that is already blank
     * 
     * @param {Board} board 
     * @param {Number} row starts at 1
     * @param {Number} col starts at 1
     * @param {Boolean} calculate default is false
     * @returns 
     */
    static removeValue(board, row, col, calculate = false) {
        const cell = board.puzzle[row - 1][col - 1];
        if (cell.value === '0') {
            throw new Error(`Error! Cell row:${row} col:${col} = ${cell.value}! Can't remove cell because it is blank`);
        }

        const clonedBoard = new Board(Board.toString(board), { calculate, rowI: row - 1, colI: col - 1, value: '0'});
        return clonedBoard;
    }

    // check if a value would be valid on a board
    // returns boolean
    static isValidFor(board, rowNum, colNum, value) {
        // get all related cells into the same array
        const cells = Board.getRow(board, rowNum);
        cells.push(...Board.getCol(board, colNum));
        cells.push(...Board.getBox(board, Board.getBoxNum(rowNum, colNum)));

        // return false if the value is already taken 
        if (cells.find(cell => cell.value === value)) {
            return false;
        }

        return true;
    }

    /**
     * Takes row and col numbers (starting at 1) and returns the cooresponding box number
     * 
     * @param {Number} row 
     * @param {Number} col 
     * @returns {Number}
     */
    static getBoxNum(row, col) {

        const boxes = [];
        if (row < 4) {
            boxes.push(1, 2, 3);
        }
        else if (row < 7) {
            boxes.push(4, 5, 6);
        }
        else {
            boxes.push(7, 8, 9);
        }

        if (col < 4) {
            return boxes[0];
        }
        else if (col < 7) {
            return boxes[1];
        }
        else {
            return boxes[2];
        }
    }

    /**
     * Returns nested array of row numbers and col numbers (starting at 1)
     * 
     * Nested Array: [rowNumbers, colNumbers] 
     * 
     * @param {Number} boxNum 
     */
    static getRowAndColNums(boxNum) {
        const rows = [];
        if (boxNum < 4) {
            rows.push(1, 2, 3);
        }
        else if (boxNum < 7) {
            rows.push(4, 5, 6);
        }
        else {
            rows.push(7, 8, 9);
        }

        const cols = [];
        if ([1, 4, 7].includes(boxNum)) {
            cols.push(1, 2, 3);
        }
        else if ([2, 5, 8].includes(boxNum)) {
            cols.push(4, 5, 6);
        }
        else {
            cols.push(7, 8, 9);
        }

        return [rows, cols];
    }


    static countMissingCells(board) {
        board.cellsMissing = 0;
        for (let row of board.puzzle) {
            board.cellsMissing += row.reduce((sum, cell) => {
                if (cell.value === '0') {
                    sum++;
                }
                return sum;
            }, 0);
        }
    }

    /**
     * Takes board and row number (start at 1) and returns Set<string> of missing values for that row
     * @param {Board} board 
     * @param {Number} rowNum starts at 1
     * @returns {Set<String>}
     */
    static getMissingRowValues(board, rowNum) {

        const row = Board.getRow(board, rowNum);
        return Board._findMissingValues(row);

    }

    /**
     * Takes board and col number (start at 1) and returns Set<string> of missing values for that col
     * 
     * @param {Board} board 
     * @param {Number} colNum starts at 1
     * @returns {Set<String>} 
     */
    static getMissingColValues(board, colNum) {
        const col = Board.getCol(board, colNum);
        return Board._findMissingValues(col);
    }

    /**
     * Takes board and box number (start at 1) and returns Set<string> of missing values for that box
     * 
     * @param {Board} board 
     * @param {Number} boxNum starts at 1
     * @returns {Set<String>}
     */
    static getMissingBoxValues(board, boxNum) {
        const box = Board.getBox(board, boxNum);
        return Board._findMissingValues(box);
    }

    /**
    * Takes board and cell coordinates (starting at 0) and calculates the possible values for the cell.
    *  
    * NOTE this does not calculate naked or hidden subsets, it simply determines the possible values from 
    * the missing values of the related row, column and box. 
    * 
    * Returns the set of missing values values
    * 
    * Does NOT modify Board or Cell objects in place
    * 
    * @param {Board} board 
    * @param {Number} rowNum starts at 1
    * @param {Number} colNum starts at 1
    * @returns {Set<String>}
    */
    static findPossibleCellValues(board, rowNum, colNum) {
        const missingRowValues = Board.getMissingRowValues(board, rowNum);
        const missingColValues = Board.getMissingColValues(board, colNum);
        const boxNum = Board.getBoxNum(rowNum, colNum);
        const missingBoxValues = Board.getMissingBoxValues(board, boxNum);
    
        
        // find and return union of all three sets
        const missingValues = new Set(); 
    
        for(let element of missingBoxValues){
            if(missingColValues.has(element) && missingRowValues.has(element)){
                missingValues.add(element);
            }
        }

        return missingValues; 
    }

    /**
     * hepler function that takes Array<Cell> and returns Set<String> of missing values
     * @param {Array<Cell>} cells 
     * @returns {Set<String>}
     */
    static _findMissingValues(cells) {
        return cells.reduce((values, cell) => {
            values.delete(cell.value);
            return values;
        }, new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']));
    }

    /**
     * Returns next index of next blank cell indice in property Board.blankCellsIndices
     * 
     * If we do not specify a cell, it will return the first blank cells indices index
     * 
     * If we do specify a cell, it will return the next blank cell's indices index AFTER that cell
     * 
     * 
     * Returns undefined if there is no such blank cell in that section of the board
     * 
     * @param {Board} board 
     * @param {Number} rowI optional
     * @param {Number} col optional
     * 
     */
    static getNextBlankCellIndicesIndex(board, rowI = null, colI = null) {
        if (board.blankCellsIndices.length === 0) {
            return undefined;
        }
        if (!rowI) {
            return (board.blankCellsIndices.length > 0) ? 0 : undefined;
        }

        for (let i = 0; i < board.blankCellsIndices.length; i++) {
            const indices = board.blankCellsIndices[i];

            if ((indices[0] === rowI && indices[1] > colI) || (indices[0] > rowI)) {
                return i;
            }
        }
        return undefined;
    }

    /**
     * Calculates missing values for each blank cell updating their set of _possibleValues 
     * 
     * Note this does not take into consideration naked or hidden subsets but only finds the union of all the missing values
     * belonging to the related row collumn and box.
     * 
     * Modifies board in place
     * 
     * 
     * @param {Board} board 
     * @return void
     */
    static calculateMissingValues(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if(board.puzzle[i][j].value !== '0') continue;
                const possibleValues = Board.findPossibleCellValues(board, i + 1, j + 1);
                board.puzzle[i][j]._possibleValues = possibleValues;
            }
        }
    }

    /**
     * Returns an array of two nested arrays representing the board as a matrix. 
     * The first nested array is an array of the rows of the box
     * The second is an array of the columns
     * returns [rows, cols] where: rows = [row1, row2, row3] and cols = [col1, col2, co3]
     * Each inner most array is of Cell type
     * 
     * @param {Board} board 
     * @param {Number} boxNum 
     * @returns {Array<Array<Array<Cell>>,Array<Array<Cell>>>}
     */
    static getBoxRowsAndCols(board, boxNum){
        const box = Board.getBox(board, boxNum); 
        const rows = [];
        for(let i = 0; i < 9; i+=3){
            let row = [];
            for(let j = 0; j < 3; j++){
                row.push(box[i + j]);
            }
            rows.push(row);
        }

        const cols = []; 
        for(let i = 0; i < 3; i++){
            let col = [];
            for(let j = 0; j < 3; j++){
                col.push(rows[j][i])
            }
            cols.push(col);
        }
        return [rows, cols];
    }


    /**
     * Clones the board
     * 
     * Each cell of clone has clonned possibleValue sets
     * 
     * calculation is not performed but the possibleValues are copied directly
     * 
     * isCalculated set true
     * @param {Board} board 
     * @returns {Board}
     */
    static copy(board){
        let newBoard = new Board(Board.toString(board));
        if(board.isCalculated){
            for(let i = 0; i < 9; i++){
                for(let j = 0; j< 9; j++){
                    newBoard.puzzle[i][j]._possibleValues = new Set(Array.from(board.puzzle[i][j].possibleValues));
                }
            }
            newBoard.isCalculated = true;
        }
        return newBoard; 
    }

    /**
     * Returns an array of the boxes overlapping the row specified by the number. 
     * 
     * Each box array will have its box number as a boxNum proeprty
     * @param {Board} board 
     * @param {Number} rowNum starts at one
     * @returns {Array<Array<Cell>>}
     */
    static getBoxRow(board, rowNum){
        let boxes;
        if(rowNum < 4){
            boxes = [Board.getBox(board, 1), Board.getBox(board, 2), Board.getBox(board, 3)]; 
        }
        else if(rowNum < 7){
            boxes = [Board.getBox(board, 4), Board.getBox(board, 5), Board.getBox(board, 6)]; 

        }
        else{
            boxes = [Board.getBox(board, 7), Board.getBox(board, 8), Board.getBox(board, 9)]; 
        }
        for(let box of boxes){
            let indices = box[0].indices; 
            box.boxNum = Board.getBoxNum(indices[0] + 1,indices[1] + 1);
        }
        return boxes;
    }

    /**
     * Returns an array of the boxes overlapping the col specified by the number. 
     * 
     * Each box array will have its box number on the boxNum property
     * @param {Board} board 
     * @param {Number} colNum starts at one
     * @returns {Array<Array<Cell>>}
     */
     static getBoxCol(board, colNum){
        let boxes;
        if(colNum < 4){
            boxes = [Board.getBox(board, 1), Board.getBox(board, 4), Board.getBox(board, 7)]; 
        }
        else if(colNum < 7){
            boxes = [Board.getBox(board, 2), Board.getBox(board, 5), Board.getBox(board, 8)]; 

        }
        else{
            boxes = [Board.getBox(board, 3), Board.getBox(board, 6), Board.getBox(board, 9)]; 
        }

        for(let box of boxes){
            let indices = box[0].indices; 
            box.boxNum = Board.getBoxNum(indices[0] + 1, indices[1] + 1);
        }

        return boxes;
    }

    static areCompatible(board1, board2){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                let cellVal1 = board1.puzzle[i][j].value; 
                let cellVal2 = board2.puzzle[i][j].value; 
                if(cellVal1 === '0' || cellVal2 === '0') continue; 
                if(cellVal1 !== cellVal2) return false;
            }
        }
        return true; 
    }

    /**
     * Returns board as a 2d Array with each element a string
     * @param {Board} board 
     */
    static serialize(board){
        const serialized = [];
        for(let i = 0; i < 9; i++){
            let row = board.puzzle[i]; 
            row = row.map(cell => cell.value); 
            serialized.push(row);
        }
        return serialized; 
    }

    /**
     * Takes a puzzle in a single string with each character comma delmited and returns a board object from it.
     * @param {String} board 
     * @returns {Board} 
     */
    static getBoardFromFlatString(board){
        board = board.split(',');
        let boardWithNewLines = '';
        for(let i = 0; i < 9; i++){
            let row = board.splice(0, 9);
            row = row.join(',');
            boardWithNewLines += row + ((i < 8) ? '\n' : '');
        }
        return new Board(boardWithNewLines);
    }
}

module.exports = { Board, Cell };