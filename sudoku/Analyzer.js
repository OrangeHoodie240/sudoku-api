const Strategy = require('./Strategy');


class Analyzer {
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
    static _runHiddenSubset(board, setSize = 2) {
        let results = Strategy._pointingPairsAndTripples(board);
        const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
        const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
        results = Strategy._hiddenSubset(results.board, rowI, colI, setSize, 'all', false);
        return results;
    }

    static _runHiddenSubsetWithoutPPT(board, setSize=2){
        const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
        const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
        let results = Strategy._hiddenSubset(board, rowI, colI, setSize, 'all', true);
        return results;
    }

    static _runBoxLineReductionWithoutPPT(board){
        let results =  Strategy._BoxLineReduction(board, true, true);
        if (results) {
            return results;
        }
        return false;
    }

    static _runNakedSubset(board, setSize = 2) {
        const rowI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][0] : 0;
        const colI = (board.blankCellsIndices[0]) ? board.blankCellsIndices[0][1] : 0;
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


    static _runBoxLineReduction(board) {
        let results = Strategy._pointingPairsAndTripples(board);
        results =  Strategy._BoxLineReduction(results.board, true);
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

    static _getAnalysis(strategy, results) {
        const position = results.solution.slice(0,2);
        position[0]++; 
        position[1]++;
        const value = results.solution[2];
        let solveWith = null;
        switch (strategy) {
            case 'last-remaining-cell':
                solveWith = ['last-remaining-cell'];
                break;
            case 'sole-candidate':
                solveWith = ['sole-candidate'];
                break;
            case 'unique-candidate':
                solveWith = ['unique-candidate'];
                break;
            case 'pointing-pairs-and-tripples':
                solveWith = ['pointing-pairs-and-tripples'];
                break;
            case 'naked-subset{setSize-2}':
                solveWith = ['naked-subset{setSize-2}'];
                break;
            case 'box-line-reduction':
                solveWith = ['pointing-pairs-and-tripples', 'box-line-reduction'];
                break;
            case 'hidden-subset{setSize-2}':
                solveWith = ['pointing-pairs-and-tripples', 'hidden-subset{setSize-2}'];
                break;
            case 'box-line-reduction-without-ppt':
                solveWith = ['box-line-reduction']; 
                break;
            case 'hidden-subset{setSize-2}-without-ppt':
                solveWith = ['hidden-subset{setSize-2}']; 
                break; 
            case 'hidden-subset{setSize-3}-without-ppt':
                solveWith = ['hidden-subset{setSize-3}'];
                break;
        }
        return {success: true, position, value, solveWith};
    }

    static analyze(board) {
        let results = Analyzer._runLastRemainingCell(board);
        if (results) {
            return Analyzer._getAnalysis('last-remaining-cell', results);
        }

        results = Analyzer._runSoleCandidate(board);
        if (results) {
            return Analyzer._getAnalysis('sole-candidate', results);
        }

        results = Analyzer._runUniqueCandidate(board);
        if (results) {
            return Analyzer._getAnalysis('unique-candidate', results);
        }

        results = Analyzer._runPointingPairsAndTripples(board); 
        if(results){
            return Analyzer._getAnalysis('pointing-pairs-and-tripples', results);
        }

        results = Analyzer._runBoxLineReductionWithoutPPT(board); 
        if(results){
            return Analyzer._getAnalysis('box-line-reduction-without-ppt', results); 
        }

        results = Analyzer._runNakedSubset(board);
        if (results) {
            return Analyzer._getAnalysis('naked-subset{setSize-2}', results);
        }

        results = Analyzer._runHiddenSubsetWithoutPPT(board, 2);
        if(results){
            return Analyzer._getAnalysis('hidden-subset{setSize-2}-without-ppt', results);
        }

        results = Analyzer._runHiddenSubsetWithoutPPT(board, 3);
        if(results){
            return Analyzer._getAnalysis('hidden-subset{setSize-3}-without-ppt', results);
        }

        results = Analyzer._runBoxLineReduction(board);
        if (results) {
            return Analyzer._getAnalysis('box-line-reduction', results);
        }

        results = Analyzer._runHiddenSubset(board);
        if (results) {
            return Analyzer._getAnalysis('hidden-subset{setSize-2}', results);
        }
        return { success: false };
    }
}


module.exports = Analyzer;