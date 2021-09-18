const { Board } = require('./Board');


// list of strategies that require possible values to be marked for applyStrategy to reference
const requiresCalculate = new Set(['naked-subset', 'hidden-subset', 'pointing-pairs-and-tripples', 'box-line-reduction']);

const SetMethods = require('./SetMethods');

class Strategy {

    /**
     * takes strategy name and returns appropriate strategy function
     * @param {*} strategy 
     */
    static _getStrategy(strategy) {
        switch (strategy) {
            case 'sole-candidate':
                return Strategy._soleCandidate;
            case 'unique-candidate':
                return Strategy._uniqueCandidate;
            case 'naked-subset':
                return Strategy._nakedSubset;
            case 'hidden-subset':
                return Strategy._hiddenSubset;
        }
    }

    /**   
     * _soleCandidate attempts to solve the specified cell using the sole candidate strategy.
     * If the cell is solved it returns the value, otherwise it returns false.
     * It does NOT modify the board
     */
    static _soleCandidate(board, rowI, colI) {
        const row = Board.getRow(board, rowI + 1);
        const col = Board.getCol(board, colI + 1);
        const box = Board.getBox(board, Board.getBoxNum(rowI + 1, colI + 1));
        const relatedCells = new Set(Board.convertCellsToCharacters([...row, ...col, ...box]).split(','));

        // 9 because 0 makes for an extra value
        if (relatedCells.size !== 9) {
            return false;
        }

        for (let value of '123456789'.split('')) {
            if (!relatedCells.has(value)) {
                return value;
            }
        }

    }


    /**
     *Use only with sole-candidate, unique-candidate and naked-subset (but naked-subset only when solving). 
     * 
    * - Solves using the specified strategy. 
    * 
    * - Strategy argument is lower-skewer case string
    * 
    * - Available strategy argments: 
    *   1. 'sole-candidate'
    *   2. 'unique-candidate'  
    * 
    * - By default finds the first blank cell and moves left to right up to down until it solves a single cell. 
    *      
    * - Board is not modified
    *      
    * - Returns object with new board and solutions
    *      - {board, solutions}
    *      - solutions nested array of all values 
    *      - Nested arrays are of form [rowIndex, colIndex, 'value'] ([3, 5, '2'])
    *
    *  - Options allow us to: 
    *       - specify a cell to start with (rowI and colI)
    *       - choose to attempt to solve all cells in the board (trySolveAll)
    *       - choose to solve only the specific cell (onlySpecifiedCell)
    *       - if both trySolveAll and onlySpecifiedCell are true, an error is thrown
    *       - if a coordinate is NOT given and onlySpecifiedCell is true an error is thrown
    *       - additionalArgs will take an array of arguments that will be spread into the strategy after board, rowI, colI
    *   
    */

    static applyStrategy(board, strategy, { rowI = null, colI = null, trySolveAll = false, onlySpecifiedCell = false, additionalArgs = [] }) {
        const og = Board.copy(board);

        //delete 
        let strat = strategy;

        if (requiresCalculate.has(strategy) && !board.isCalcuated) {
            Board.calculateMissingValues(board);
        }


        strategy = Strategy._getStrategy(strategy);
        // if additionalArgs, curry stategy into a function that adds it onto the end.
        if (additionalArgs.length) {
            let original = strategy;
            strategy = function (board, rowI, colI) {
                return original(board, rowI, colI, ...additionalArgs);
            };
        }

        if (trySolveAll && onlySpecifiedCell) {
            throw new Error('Error! Both trySolveAll and onlySpecifiedCell were both set true!');
        }

        if ((rowI === null || colI === null) && onlySpecifiedCell) {
            throw new Error("Error! onlySpecifiedCell=true requires both rowI and colI to be passed ")
        }

        const solutions = [];

        if (rowI === null) {
            [rowI, colI] = board.blankCellsIndices[0];
        }

        if (onlySpecifiedCell) {
            const solution = strategy(board, rowI, colI);
            if (!solution) {
                return false;
            }

            board = Board.addValue(board, rowI + 1, colI + 1, solution, board.isCalcuated);
            solutions.push([rowI, colI, solution]);
            return { board, solutions };
        }

        // index for current cell within the blankCellsIndices property belonging to the Board object
        // presumes the cell coordinates passed are for a blank cell
        let initialBlankCellsIndicesIndex = Board.getNextBlankCellIndicesIndex(board, rowI, colI);
        initialBlankCellsIndicesIndex = (initialBlankCellsIndicesIndex === 0) ? 0 : initialBlankCellsIndicesIndex - 1;

        // save initial board's blankCellsIndices because we will be changing the board variable
        const blankCellsIndices = board.blankCellsIndices;



        for (let i = initialBlankCellsIndicesIndex; i < blankCellsIndices.length; i++) {
            let indices = blankCellsIndices[i];
            let solution = strategy(board, indices[0], indices[1]);
            if (solution) {
                solutions.push([indices[0], indices[1], solution]);
                board = Board.addValue(board, indices[0] + 1, indices[1] + 1, solution, board.isCalcuated);
            }
        }

        if (trySolveAll && initialBlankCellsIndicesIndex > 0) {
            for (let i = initialBlankCellsIndicesIndex - 1; i < initialBlankCellsIndicesIndex; i++) {
                let indices = blankCellsIndices[i];
                let solution = strategy(board, indices[0], indices[1]);
                if (solution) {
                    solutions.push([indices[0], indices[1], solution]);
                    board = Board.addValue(board, indices[0] + 1, indices[1] + 1, solution);
                }
            }
        }

        if (solutions.length === 0) return false;
        if (!board) {
            throw new Error(strat);
        }
        return { board, solutions };
    }

    /**
     * Attempts to solve cell using the unique candidate strategy
     * 
     * If successful returns solution value, otherwise false
     * 
     * The possibilities parameter is optional and will simply limit solving to that value. Otherwise all possible 
     * solutions are attempted.
     * 
     * @param {Board} board 
     * @param {Number} rowI 
     * @param {Number} colI 
     * @param {String} particularNumber
     */
    static _uniqueCandidate(board, rowI, colI, ...possibilities) {
        const row = Board.convertCellsToCharacters(Board.getRow(board, rowI + 1)).split(',');
        const col = Board.convertCellsToCharacters(Board.getCol(board, colI + 1)).split(',');
        const boxNum = Board.getBoxNum(rowI + 1, colI + 1);

        const box = Board.convertCellsToCharacters(Board.getBox(board, boxNum)).split(',');

        if (possibilities.length === 0) {
            let cells = new Set([...row, ...col, ...box]);
            let digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
            for (let digit of digits) {
                if (!cells.has(digit)) {
                    possibilities.push(digit);
                }
            }
        }

        const [rows, cols] = Board.getRowAndColNums(boxNum);
        for (let i = 0; i < 3; i++) {
            if (rows[i] === rowI + 1) {
                rows.splice(i, 1, row);
            }
            else {
                rows[i] = Board.convertCellsToCharacters(Board.getRow(board, rows[i])).split(',');
            }

            if (cols[i] === colI + 1) {
                cols.splice(i, 1, col);
            }
            else {
                cols[i] = Board.convertCellsToCharacters(Board.getCol(board, cols[i])).split(',');
            }
        }

        // for each possible value make a small box to model the sudoku box, modelBox
        // set all the elements of each row and col that has the value to 'X'
        // if we have only one blank cell at the end of an iteration, we know we have the right value
        for (let value of possibilities) {
            let modelBox = [box.slice(0, 3), box.slice(3, 6), box.slice(6, 9)];
            for (let i = 0; i < 3; i++) {
                if (rows[i].includes(value)) {
                    modelBox[i] = ['X', 'X', 'X'];
                }

                if (cols[i].includes(value)) {
                    modelBox[0][i] = 'X';
                    modelBox[1][i] = 'X';
                    modelBox[2][i] = 'X';
                }
            }

            let blankCellCount = 0;
            for (let row of modelBox) {
                for (let rowValue of row) {
                    if (rowValue === '0') {
                        blankCellCount++;
                    }
                }
            }
            if (blankCellCount === 1) {
                return value;
            }
        }

        return false;
    }







    /**
     * Attempts to solve for the value of a cell or to decrease the number of possibile values for that cell with the naked subset
     * rule.
     * 
     * additionalArgs:
     *  -   setSize: the size of the set we are attempt to find as a naked set    
     *  -   structuretype: default sovles by the row struture, but can pass 'col' or 'box' to override.
     *  -   solveForPossibilities: default is false. When false we attempt to solve only to a single solution. We return 
     *      the solution string it self if successful or false. When solveForPossibilities is true, this will return 
     *      Set<string> with the updated possibleValues if we are able to succesfully decrease the number of possibilities. 
     *      Other wise returns false.
     * 
     * @param {Board} board 
     * @param {Number} rowI starts at 0
     * @param {Number} colI starts at 0 
     * @param  {Array<Number, String, Boolean>} param3 
     */
    static _nakedSubset(board, rowI, colI, ...[setSize = 2, structureType = 'row', solveForPossibilities = false]) {
        const targetCell = board.puzzle[rowI][colI];
        if (!solveForPossibilities && targetCell.possibleValues.size !== setSize + 1) {
            return false;
        }
        else if (solveForPossibilities && targetCell.possibleValues.size <= setSize) {
            return false;
        }


        let getStructures = null;
        let structureNums = null;
        if (structureType === 'row') {
            getStructures = [Board.getRow];
            structureNums = [rowI + 1];
        }
        else if (structureType === 'col') {
            getStructures = [Board.getCol];
            structureNums = [colI + 1];
        }
        else if (structureType === 'box') {
            getStructures = [Board.getBox];
            structureNums = [Board.getBoxNum(rowI + 1, colI + 1)];
        }
        else if (structureType === 'all') {
            getStructures = [
                Board.getRow,
                Board.getCol,
                Board.getBox
            ];
            structureNums = [rowI + 1, colI + 1, Board.getBoxNum(rowI + 1, colI + 1)];
        }

        // this will only be returned if solveForPossibilities was set 
        let possibleSolutions = [];

        for (let i = 0; i < getStructures.length; i++) {

            // find all sets of possibleValues for each cell in the structure that is of the correct set size
            let possibleMatchingSets = {};
            const structure = getStructures[i](board, structureNums[i]);
            for (let cell of structure) {
                if (cell.possibleValues.size === setSize) {
                    const set = cell.possibleValues;
                    const setString = Array.from(set).sort() + '';
                    const occurences = (possibleMatchingSets[setString]) ? possibleMatchingSets[setString].occurences + 1 : 1;
                    possibleMatchingSets[setString] = { set, occurences };
                }
            }
            // remove any set from the possible matches that does not share its number of occurences with the 
            // set size. 
            possibleMatchingSets = Object.values(possibleMatchingSets).filter(match => match.occurences === setSize);
            for (let match of possibleMatchingSets) {
                let targetSet = new Set(targetCell.possibleValues);
                for (let element of match.set) {
                    targetSet.delete(element);
                }
                if (!solveForPossibilities && targetSet.size === 1) {
                    targetSet = Array.from(targetSet.values());
                    return targetSet[0];
                }
                else if (solveForPossibilities && targetSet.size < targetCell.possibleValues.size) {
                    possibleSolutions.push(targetSet);
                }
            }

        }
        if (possibleSolutions.length > 0) {
            let returnedSet = possibleSolutions[0];
            for (let i = 1; i < getStructures.length; i++) {
                returnedSet = SetMethods.intersection(returnedSet, possibleSolutions[i]);
            }
            return returnedSet;
        }

        return false;
    }






    /**
     * Solves using hidden subset
     * setSize will stand for hidden subset within the larger set.
     * What it returns depends on 
     *                  1. the solveForPossibilities parameter
     *                  2. its success. 
     * 
     * If solvedForPossibilities is false (which it is by default), it will 
     * attempt to solve and if succesfful {board, solution} will be returned 
     * where board is the new board with the value added and solution an array 
     * letting us know what it solved for [rowI, colI, 'value']. If we are unable
     * to solve it will return false
     *
     * if solvedForPossibilities is true it will attempt to widdle down the sets 
     * of possible values for every cell a single time and return the resulting board.
     * 
     * @param {Board} board 
     * @param {Number} rowI 
     * @param {Number} colI 
     * @param  {Array<Number, String, Boolean>} param3 
     * @returns {{board: Board, solution: Array<Number, Number, String>}}
     */
    static _hiddenSubset(board, rowI, colI, ...[setSize = 2, structureType = 'row', calculate = false, solveForPossibilities = false]) {
        const originalCellCount = board.cellsMissing;
        if (calculate) {
            board = new Board(Board.toString(board), { calculate: true });
        }
        else {
            board = Board.copy(board);
        }



        // depending on the structureType, row, col, box or all prepare the correct function calls
        let getStructures = null;
        let structureNums = null;
        let getMissingValues = null;
        if (structureType === 'row') {
            getStructures = [Board.getRow];
            structureNums = [rowI + 1];
            getMissingValues = [Board.getMissingRowValues];

        }
        else if (structureType === 'col') {
            getStructures = [Board.getCol];
            structureNums = [colI + 1];
            getMissingValues = [Board.getMissingColValues];

        }
        else if (structureType === 'box') {
            getStructures = [Board.getBox];
            structureNums = [Board.getBoxNum(rowI + 1, colI + 1)];
            getMissingValues = [Board.getMissingBoxValues];
        }
        else if (structureType === 'all') {
            getStructures = [
                Board.getRow,
                Board.getCol,
                Board.getBox
            ];
            structureNums = [rowI + 1, colI + 1, Board.getBoxNum(rowI + 1, colI + 1)];
            getMissingValues = [
                Board.getMissingRowValues,
                Board.getMissingColValues,
                Board.getMissingBoxValues
            ];
        }


        const getSubset = (setSize === 2) ? SetMethods.subSetsUpTwo : SetMethods.subSetsUpThree;

        for (let i = 0; i < getStructures.length; i++) {
            // get all possible matching sets

            const structure = getStructures[i](board, structureNums[i]);
            let missingValues = new Set(getMissingValues[i](board, structureNums[i]));

            let potentialValues = {};

            for (let missingValue of missingValues) {
                for (let cell of structure) {
                    if (cell.possibleValues.has(missingValue)) {
                        let entry = potentialValues[missingValue];
                        if (entry) {
                            entry[1]++;
                        }
                        else {
                            potentialValues[missingValue] = [missingValue, 1];

                        }
                    }
                }
            }
            potentialValues = Object.values(potentialValues);
            potentialValues = potentialValues.reduce((newList, entry) => {
                if (entry[1] === setSize) {
                    newList.push(entry[0]);
                }
                return newList;
            }, []);

            potentialValues = new Set(potentialValues);

            let possibleMatchingSets = {};
            for (let subSet of getSubset(potentialValues)) {
                if (subSet.size < setSize) continue;
                for (let cell of structure) {
                    if (SetMethods.isSubset(subSet, cell.possibleValues)) {
                        let setKey = [...subSet].sort() + '';
                        if (!possibleMatchingSets[setKey]) {
                            const entry = {};
                            entry.cells = [cell];
                            entry.set = subSet;
                            possibleMatchingSets[setKey] = entry;
                        }
                        else {
                            possibleMatchingSets[setKey].cells.push(cell);
                        }
                    }
                }
            }

            possibleMatchingSets = Object.values(possibleMatchingSets).filter(match => match.cells.length === match.set.size);

            for (let match of possibleMatchingSets) {
                for (let cell of match.cells) {
                    cell._possibleValues = new Set(Array.from(match.set))
                }
                for (let cell of structure) {
                    if (match.cells.includes(cell)) continue;
                    if (cell.value !== '0') continue;

                    for (let el of match.set) {
                        cell.possibleValues.delete(el);
                    }
                }

                if (!solveForPossibilities) {
                    let updateResults = Strategy._updatePossibleValueRemoval(board);
                    if (updateResults.board.cellsMissing < board.cellsMissing) {
                        return { board: updateResults.board, solution: updateResults.solution };
                    }
                }
            }

        }

        if (!solveForPossibilities && board.cellsMissing === originalCellCount) {
            return false;
        }
        return { board };
    }

    /**
     * 
     * @param {Board} board 
     * @param {Boolean} solve 
     * @returns {board: Board, solution: Array<Number, Number, 'String'>}
     */
    static _pointingPairsAndTripples(board, solve = false) {
        const originalCellCount = board.cellsMissing;
        board = new Board(Board.toString(board), { calculate: true });

        // create array of objects for the row and columns we will iterate over 
        const structures = [{ 'get': Board.getRow }, { 'get': Board.getCol }];

        // iterate over each box
        for (let i = 1; i < 10; i++) {

            // retrieve 2D arrays of the rows and cols of each box and save to the cooresponding  object of the 
            // structures array
            const [boxRows, boxCols] = Board.getBoxRowsAndCols(board, i);
            structures[0].rowsOrCols = boxRows;
            structures[1].rowsOrCols = boxCols;

            // get box and its missing values
            const box = Board.getBox(board, i);
            const missingBoxValues = Board.getMissingBoxValues(board, i);
            for (let missingValue of missingBoxValues) {

                // possible cells is the number of cells in the entire box that have the missingValue in their set of 
                // possible values
                let possibleCells = 0;
                for (let cell of box) {
                    if (cell.possibleValues.has(missingValue)) possibleCells++;
                }

                // iterate structure objects
                for (let i = 0; i < 2; i++) {
                    for (let rowOrCol of structures[i].rowsOrCols) {
                        let cellsMissingTheValue = 0;

                        for (let cell of rowOrCol) {
                            if (cell.possibleValues.has(missingValue)) {
                                cellsMissingTheValue++;
                            }
                        }

                        // check to see if any cells in the related structures have the value in their possibleValue set
                        // for us to elminate
                        if (cellsMissingTheValue === possibleCells) {
                            const relatedRowOrCol = structures[i].get(board, rowOrCol[0].indices[i] + 1);
                            for (let relatedCell of relatedRowOrCol) {
                                if (rowOrCol.includes(relatedCell)) continue;
                                if (relatedCell.value === '0') {
                                    let possibleValues = Array.from(relatedCell.possibleValues);
                                    relatedCell.possibleValues.delete(missingValue);
                                    // if we are solving we check to see if removing the possible value has left 
                                    // the cell with only one possible value, and if so assing the value and return 
                                    // the board. 
                                    if (solve) {
                                        if (relatedCell.possibleValues.size === 1) {
                                            let [rowI, colI] = relatedCell.indices;
                                            let solution = relatedCell.possibleValues.values().next();
                                            solution = solution.value;
                                            board = Board.addValue(board, rowI + 1, colI + 1, solution, true)
                                            solution = [rowI, colI, solution];
                                            return { board, solution };
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }

        }

        if (solve && board.cellsMissing === originalCellCount) {
            return false;
        }
        return { board };
    }


    /**
     * Peforms Box Line Reduction on a clone of the board
     * 
     * solve parameter is defaulted to true
     * @param {Board} board 
     * @param {Boolean} solve 
     * @returns {{board: Board, solution: [Number, Number, String]}}
     */
    static _BoxLineReduction(board, solve = true, calculate = false) {
        const originalCellCount = board.cellsMissing;
        if (calculate) {
            board = new Board(Board.toString(board), { calculate: true });
        }
        else {
            board = Board.copy(board);
        }
        const structures = [{ 'get': Board.getRow, 'getBoxes': Board.getBoxRow }, {
            'get': Board.getCol,
            'getBoxes': Board.getBoxCol
        }];

        for (let i = 0; i < 2; i++) {
            for (let j = 1; j < 10; j++) {
                const structure = structures[i].get(board, j);
                // get boxes the structure goes through
                let boxArray = structures[i].getBoxes(board, j);
                for (let k = 0; k < 3; k++) {
                    let overLappingCells;
                    let nonOverlappingCells;
                    let box = boxArray[k];
                    if (k === 0) {
                        overLappingCells = structure.slice(0, 3);
                        nonOverlappingCells = structure.slice(3, 9);
                    }
                    else if (k === 1) {
                        overLappingCells = structure.slice(3, 6);
                        nonOverlappingCells = structure.slice(0, 3);
                        nonOverlappingCells.push(...structure.slice(6, 9));
                    }
                    else {
                        overLappingCells = structure.slice(6, 9);
                        nonOverlappingCells = structure.slice(0, 6);
                    }

                    /* build up a set of numbers that: 
                                                        1. Are missing from the box
                                                        2. Are not filled in values for the row/col structure
                                                        3. Are not possible values for the row/col structure
                    */
                    let targetValues = Board.getMissingBoxValues(board, box.boxNum);
                    let canSolve = false;


                    loopOverMissingValues:
                    for (let missingValue of targetValues) {
                        for (let cell of nonOverlappingCells) {
                            if (cell.value === missingValue) {
                                targetValues.delete(missingValue);
                                continue loopOverMissingValues;
                            }
                            else if (cell.possibleValues.has(missingValue)) {
                                targetValues.delete(missingValue);
                                continue loopOverMissingValues;
                            }
                        }
                    }

                    // if any target valeus were found remove them from the possibleValue sets
                    // of all box cells that don't overlap the row/col
                    if (targetValues.size) {
                        for (let cell of box) {
                            if (cell.value !== '0') continue;

                            for (let el of targetValues) {
                                if (!overLappingCells.includes(cell)) {
                                    cell.possibleValues.delete(el);
                                }
                            }
                            if (cell.possibleValues.size === 1) {
                                canSolve = true;
                            };
                        }
                    }

                    if (canSolve && solve) {
                        let results = Strategy._updatePossibleValueRemoval(board);
                        return results;
                    }

                }
            }
        }
        if (solve && originalCellCount === board.cellsMissing) {
            return false;
        }
        return { board };
    
    }


    /**
     * Updates board such that cells with a single possible value are set to it instead of left blank. 
     * By default (and currently always) it returns the board after the first cell has had its value updated.
     * Clones board and returns clone
     * @param {Board} board 
     * @param {Boolean} updateAll 
     * @returns {{board: Board}}
     */
    static _updatePossibleValueRemoval(board, updateAll = false) {

        // copy board and calculate if not already calculated
        if (!board.isCalculated) {
            board = new Board(Board.toString(board), { calculate: true });
        } else {
            board = Board.copy(board);
        }


        // check if any cells have only one possible value
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(board.puzzle[i][j].possibleValues.size === 1){
                    const cell = board.puzzle[i][j]; 
                    const [rowI, colI] = cell.indices; 
                    const value = Array.from(cell.possibleValues)[0]; 
                    const solution = [rowI, colI, value]; 
                    const newBoard = Board.addValue(board, rowI + 1, colI + 1, value, true);    
                    if(!updateAll){
                        return {board: newBoard, solution};
                    }
                }
            }
        }

        // will iterate the board up to three times, once to analyze it by each possible structure
        // using these two arrays allows us to reuse the loop body for each.
        let getStructures = [
            Board.getRow,
            Board.getCol,
            Board.getBox
        ];

        let getMissingValues = [
            Board.getMissingRowValues,
            Board.getMissingColValues,
            Board.getMissingBoxValues
        ];

        // outer loop iterates over analyzing by each structure (row, col, box)
        for (let i = 0; i < 3; i++) {
            // inner loop iterates over each instance of the structure (9 rows, 9 columns, 9 boxes)
            for (let j = 1; j < 10; j++) {

                // get structure (box row or col) and get the values missing from that structure
                const structure = getStructures[i](board, j);
                const missingValues = getMissingValues[i](board, j);

                // outer loop iterates each missing value from the structure
                // inner loop iterates each cell in the structure for each missing value
                // We are building an object that associates a missing value to a list of cells
                // in the structure that have that missing value within their possibleValue sets
                let possibleValueDirectory = {};
                for (let missingValue of missingValues) {
                    for (let cell of structure) {
                        if (!cell.possibleValues.has(missingValue)) continue;

                        let entry = possibleValueDirectory[missingValue];
                        if (!entry) {
                            entry = {};
                            entry.missingValue = missingValue;
                            entry.cells = [cell];
                            possibleValueDirectory[missingValue] = entry;
                        }
                        else {
                            entry.cells.push(cell);
                        }
                    }
                }

                // we filter the results of the above to only include those missing value entries that 
                // had only one cell capable of holding them
                possibleValueDirectory = Object.values(possibleValueDirectory)
                    .filter(entry => entry.cells.length === 1);

                // iterate each cell to the value of the missing value
                for (let entry of possibleValueDirectory) {
                    let cell = entry.cells[0];
                    let [rowI, colI] = cell.indices;
                    let value = entry.missingValue;

                    // if we are not updating them all, return on the first solved cell
                    if (!updateAll) {
                        let solution = [rowI, colI, value];
                        return { board: Board.addValue(board, rowI + 1, colI + 1, value, true), solution };
                    }
                }
            }
        }

        // if updateAll is true
        return { board };
    }

    static _lastRemainingCell(board) {
        board = Board.copy(board);

        const structures = [
            {
                'getStructure': Board.getRow,
                'getMissingValues': Board.getMissingRowValues
            },

            {
                'getStructure': Board.getCol,
                'getMissingValues': Board.getMissingColValues
            },
            {
                'getStructure': Board.getBox,
                'getMissingValues': Board.getMissingBoxValues
            }
        ];

        for (let i = 0; i < 3; i++) {
            for (let j = 1; j < 10; j++) {
                const missingValues = structures[i].getMissingValues(board, j);

                if (missingValues.size === 1) {
                    const structure = structures[i].getStructure(board, j);
                    for (let cell of structure) {
                        if (cell.value === '0') {
                            const value = Array.from(missingValues)[0];
                            let indices = cell.indices;
                            board = Board.addValue(board, indices[0] + 1, indices[1] + 1, value);
                            return { board, solution: [indices[0], indices[1], value] };
                        }
                    }
                }
            }
        }
        return false;
    }

    /**
     * Run a strategy until it can't solve any pieces on the current board.
     * 
     * Returns object with board property or false if no change
     * 
     * Takes a callback which calls performs the strategy. 
     * 
     * Callback should: 
     * 
     *          -  Perform strategy on board
     *          -  If succesfull return object WITH board property 
     *          - If unsuccesful return false
     * @param {Board} board 
     * @param {Function} callBack 
     * @returns {{board}}
     */
    static runStrategyUntilNoChange(board, callBack) {
        let originalCellCount = board.cellsMissing;
        let cellsMissing = 82;
        let solution = null;
        while (cellsMissing > board.cellsMissing) {
            cellsMissing = board.cellsMissing;
            let results = callBack(board);
            if (results) {
                board = results.board;
                solution = results.solution;
            }
        }
        if (originalCellCount === board.cellsMissing) {
            return false;
        }
        else {
            return { board, solution };
        }
    }


    /**
     * Perform unique candidate by row and column, if it has already been performed by box. 
     * Wrapping _updatePossibleValueRemoval 
     * 
     * @param {Board} board 
     * @returns {{board: Board, solution: Array<Number, Number, String>}}
     */
    static _uniqueCandidateRowCol(board) {
        return Strategy._updatePossibleValueRemoval(board);
    }

    /**
     * 
     * This is a temporary wrapper that will return the board solved for possibilities.
     * The problem is that applyStrategy is outdated as the design for strategy use has changed 
     * 
     * 
     * @param {Board} board 
     * @param {Number} setSize 
     */
    static solveForPossibilitiesNakedSubset(board, setSize) {
        if (!board.isCalculated) {
            board = new Board(Board.toString(board), { calculate: true });
        }
        else {
            board = Board.copy(board);
        }
        let cellsLength = board.blankCellsIndices.length;
        for (let i = 0; i < cellsLength; i++) {
            let [rowI, colI] = board.blankCellsIndices[i];
            let sets = [];

            let results = Strategy._nakedSubset(board, rowI, colI, setSize, 'row', true);
            if (results) sets.push(results)

            results = Strategy._nakedSubset(board, rowI, colI, setSize, 'col', true);
            if (results) sets.push(results)

            results = Strategy._nakedSubset(board, rowI, colI, setSize, 'box', true);
            if (results) sets.push(results)

            if (sets.length === 1) {
                results = sets[0];
            }
            else if (sets.length === 2) {
                results = SetMethods.intersection(sets[0], sets[1]);
            }
            else if (sets.length === 3) {
                results = SetMethods.intersection(sets[0], sets[1]);
                results = SetMethods.intersection(results, sets[2]);
            }

            if (results) {
                board.puzzle[rowI][colI]._possibleValues = results;
            }
        }
        return board;
    }
}

module.exports = Strategy;