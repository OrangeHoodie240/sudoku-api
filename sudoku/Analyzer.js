const {StrategyMap, StrategyArray} = require('./AnalyzerConfiguration');

class Analyzer {
   
    static _getAnalysis(strategy, results) {
        const position = results.solution.slice(0, 2);
        position[0]++;
        position[1]++;
        const value = results.solution[2];
        const solveWith = StrategyMap[strategy]; 
        
        return { success: true, position, value, solveWith };
    }

    static analyze(board) {
        let strategyNumber = StrategyArray.length;
        for(let i = 0; i < strategyNumber; i++){
            const strategyObj = StrategyArray[i]; 
            let results = strategyObj.strategy(board); 
            if(results){
                return Analyzer._getAnalysis(strategyObj.name, results);
            }
        }
        return { success: false };
    }
}


module.exports = Analyzer;