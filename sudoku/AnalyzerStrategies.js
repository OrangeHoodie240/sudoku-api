const Strategy = require('./Strategy');
const { Board } = require('./Board');
const getFirstEmptyCellIndicesOrOrigin = Board.getFirstEmptyCellIndicesOrOrigin; 

class AnalyzerStrategies {
    static _runLastRemainingCell(board) {
        let results = Strategy._lastRemainingCell(board);
        if (results) {
            return results;
        }
        return false;
    }

    static _runSoleCandidate(board) {
        let results = Strategy.applyStrategy(board, 'sole-candidate', { rowI: 0, col: 0 });
        if (results) {
            results.solution = results.solutions[0];
            return results;
        }
        return false; ``
    }

    static _runUniqueCandidate(board) {
        let results = Strategy.applyStrategy(board, 'unique-candidate', { rowI: 0, col: 0 });
        if (results) {
            results.solution = results.solutions[0];
            return results;
        }
        return false;
    }

    static _runUniqueCandidateRowCol(board){
        let results = Strategy._uniqueCandidateRowCol(board);
        if(results.solution){
            return results;
        }
        return false;
    }

    static _runPptHs(board, setSize = 2) {
        let results = Strategy._pointingPairsAndTripples(board);
        const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
        results = Strategy._hiddenSubset(results.board, rowI, colI, setSize, 'all', false);
        return results;
    }

    static _runHiddenSubset(board, setSize = 2) {
        const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
        let results = Strategy._hiddenSubset(board, rowI, colI, setSize, 'all', true);
        return results;
    }

    static _runBoxLineReduction(board) {
        let results = Strategy._BoxLineReduction(board, true, true);
        if (results) {
            return results;
        }
        return false;
    }

    static _runNakedSubset(board, setSize = 2) {
        const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
        let results = Strategy.applyStrategy(board, 'naked-subset', {
            rowI,
            colI,
            additionalArgs: [setSize, 'all']
        });
        if (results) {
            results.solution = results.solutions[0];
            return results;
        }
        return false;
    }


    static _runPptBlr(board) {
        let results = Strategy._pointingPairsAndTripples(board);
        results = Strategy._BoxLineReduction(results.board, true);
        if (results) {
            return results;
        }
        return false;
    }

    static _runPointingPairsAndTripples(board) {
        let results = Strategy._pointingPairsAndTripples(board, true);
        if (results) {
            return results;
        }
        return false;
    }

    static _runPptBlrNs(board, setSize = 2) {
        const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
        let results = Strategy._pointingPairsAndTripples(board, false);
        results = Strategy._BoxLineReduction(results.board, false, false);
        results = Strategy.applyStrategy(results.board, 'naked-subset', {
            rowI,
            colI,
            additionalArgs: [setSize, 'all']
        });
        if (results) {
            results.solution = results.solutions[0];
            return results;
        }
        return false;
    }

    static _runPptBlrHsNs(board, hsSetSize = 2, nsSetSize = 2) {
        const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
        let results = Strategy._pointingPairsAndTripples(board, false);
        results = Strategy._BoxLineReduction(results.board, false, false);
        results = Strategy._hiddenSubset(results.board, rowI, colI, hsSetSize, 'all', false, true);
        results = Strategy.applyStrategy(results.board, 'naked-subset', {
            rowI,
            colI,
            additionalArgs: [nsSetSize, 'all']
        });
        if (results) {
            results.solution = results.solutions[0];
            return results;
        }
        return false;
    }


    static _runPptBlrHs(board, setSize = 2) {
        const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
        let results = Strategy._pointingPairsAndTripples(board, false);
        results = Strategy._BoxLineReduction(results.board, false, false);
        results = Strategy._hiddenSubset(results.board, rowI, colI, setSize, 'all', false);
        return results;
    }

    static _runPptBlrNsHs(board, nsSetSize = 2, hsSetSize = 2) {
        const {rowI, colI} = getFirstEmptyCellIndicesOrOrigin(board);
        board = new Board(Board.toString(board), { calculate: true });
        let results = Strategy._pointingPairsAndTripples(board, false);
        results = Strategy._BoxLineReduction(results.board, false, false);
        board = Strategy.solveForPossibilitiesNakedSubset(results.board, nsSetSize);
        results = Strategy._hiddenSubset(board, rowI, colI, hsSetSize, 'all', false);
        return results;
    }

}



module.exports = AnalyzerStrategies; 