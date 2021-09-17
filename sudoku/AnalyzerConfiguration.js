const AnalyzerStrategies = require('./AnalyzerStrategies');


// string constants that will reoccur
const lastRemainingCell = 'last-remaining-cell';
const soleCandidate = 'sole-candidate'; 
const uniqueCandidate = 'unique-candidate'; 
const uniqueCandidateRowOrCol = 'unique-candidate-row-or-col'; 
const pointingPairsAndTriples = 'pointing-pairs-and-tripples'; 
const boxLineReduction = 'box-line-reduction'; 
const nakedSubsetSetSize2 = 'naked-subset{setSize-2}'; 
const nakedSubsetSetSize3 = 'naked-subset{setSize-3}';
const nakedSubsetSetSize4 = 'naked-subset{setSize-4}';
const hiddenSubsetSetSize2 = 'hidden-subset{setSize-2}'; 
const hiddenSubsetSetSize3 = 'hidden-subset{setSize-3}'; 
const hiddenSubsetSetSize4 = 'hidden-subset{setSize-4}'; 


const StrategyMap = {
    [lastRemainingCell]: [lastRemainingCell], 
    [soleCandidate]: [soleCandidate], 
    [uniqueCandidate]: [uniqueCandidate], 
    [uniqueCandidateRowOrCol]: [uniqueCandidateRowOrCol], 
    [pointingPairsAndTriples]: [pointingPairsAndTriples], 
    [boxLineReduction]: [boxLineReduction], 
    [nakedSubsetSetSize2]: [nakedSubsetSetSize2], 
    [nakedSubsetSetSize3]: [nakedSubsetSetSize3], 
    [nakedSubsetSetSize4]: [nakedSubsetSetSize4], 
    [hiddenSubsetSetSize2]: [hiddenSubsetSetSize2], 
    [hiddenSubsetSetSize3]: [hiddenSubsetSetSize3], 
    [hiddenSubsetSetSize4]: [hiddenSubsetSetSize4],
    'ppt-blr': [pointingPairsAndTriples,boxLineReduction],  
    'ppt-hs{setSize-2}': [pointingPairsAndTriples, hiddenSubsetSetSize2], 
    'ppt-blr-ns{setSize-2}': [pointingPairsAndTriples, boxLineReduction, nakedSubsetSetSize2], 
    'ppt-blr-ns{setSize-3}': [pointingPairsAndTriples, boxLineReduction, nakedSubsetSetSize3], 
    'ppt-blr-hs{setSize-2}': [pointingPairsAndTriples, boxLineReduction, hiddenSubsetSetSize2], 
    'ppt-blr-hs{setSize-3}': [pointingPairsAndTriples, boxLineReduction, hiddenSubsetSetSize3], 
    'ppt-blr-ns{setSize-2}-hs{setSize-2}': [pointingPairsAndTriples, boxLineReduction, nakedSubsetSetSize2, hiddenSubsetSetSize2], 
    'ppt-blr-ns{setSize-2}-hs{setSize-3}': [pointingPairsAndTriples, boxLineReduction, nakedSubsetSetSize2, hiddenSubsetSetSize3], 
    'ppt-blr-ns{setSize-3}-hs{setSize-2}': [pointingPairsAndTriples, boxLineReduction, nakedSubsetSetSize3, hiddenSubsetSetSize2],
    'ppt-blr-ns{setSize-3}-hs{setSize-3}': [pointingPairsAndTriples, boxLineReduction, nakedSubsetSetSize3, hiddenSubsetSetSize3], 
    'ppt-blr-hs{setSize-2}-ns{setSize-2}': [pointingPairsAndTriples, boxLineReduction, hiddenSubsetSetSize2, nakedSubsetSetSize2], 
    'ppt-blr-hs{setSize-2}-ns{setSize-3}': [pointingPairsAndTriples, boxLineReduction, hiddenSubsetSetSize2, nakedSubsetSetSize3], 
    'ppt-blr-hs{setSize-3}-ns{setSize-2}': [pointingPairsAndTriples, boxLineReduction, hiddenSubsetSetSize3, nakedSubsetSetSize2], 
    'ppt-blr-hs{setSize-3}-ns{setSize-3}': [pointingPairsAndTriples, boxLineReduction, hiddenSubsetSetSize3, nakedSubsetSetSize3]
};

const StrategyArray = [
    {strategy: AnalyzerStrategies._runLastRemainingCell, name: lastRemainingCell}, 
    {strategy: AnalyzerStrategies._runSoleCandidate, name: soleCandidate}, 
    {strategy: AnalyzerStrategies._runUniqueCandidate, name: uniqueCandidate}, 
    {strategy: AnalyzerStrategies._runUniqueCandidateRowCol, name: uniqueCandidateRowOrCol},
    {strategy: AnalyzerStrategies._runPointingPairsAndTripples, name: pointingPairsAndTriples},
    {strategy: AnalyzerStrategies._runBoxLineReduction, name: boxLineReduction}, 
    {strategy: AnalyzerStrategies._runNakedSubset, name: nakedSubsetSetSize2}, 
    {strategy: AnalyzerStrategies._runHiddenSubset, name: hiddenSubsetSetSize2}, 
    {strategy: (board)=>AnalyzerStrategies._runNakedSubset(board, 3), name: nakedSubsetSetSize3}, 
    {strategy: (board)=>AnalyzerStrategies._runHiddenSubset(board, 3), name: hiddenSubsetSetSize3}, 
    {strategy: (board)=>AnalyzerStrategies._runNakedSubset(board, 4), name: nakedSubsetSetSize4}, 
    {strategy: (board)=>AnalyzerStrategies._runHiddenSubset(board, 4), name: hiddenSubsetSetSize4}, 
    {strategy: AnalyzerStrategies._runPptBlr, name: 'ppt-blr'}, 
    {strategy: AnalyzerStrategies._runPptHs, name: 'ppt-hs{setSize-2}'}, 
    {strategy: (board)=>AnalyzerStrategies._runPptBlrNs(board,2), name: 'ppt-blr-ns{setSize-2}'}, 
    {strategy: (board)=>AnalyzerStrategies._runPptBlrNs(board,3), name: 'ppt-blr-ns{setSize-3}'}, 
    {strategy: (board)=>AnalyzerStrategies._runPptBlrHs(board, 2), name: 'ppt-blr-hs{setSize-2}'}, 
    {strategy: (board)=>AnalyzerStrategies._runPptBlrHs(board, 3), name: 'ppt-blr-hs{setSize-3}'}, 
    {strategy: (board)=>AnalyzerStrategies._runPptBlrHsNs(board, 2, 2), name: 'ppt-blr-hs{setSize-2}-ns{setSize-2}'}, 
    {strategy: (board)=>AnalyzerStrategies._runPptBlrNsHs(board, 2, 2), name: 'ppt-blr-ns{setSize-2}-hs{setSize-2}'}, 
    {strategy: (board)=>AnalyzerStrategies._runPptBlrHsNs(board, 2, 3), name: 'ppt-blr-hs{setSize-2}-ns{setSize-3}'}, 
    {strategy: (board)=>AnalyzerStrategies._runPptBlrNsHs(board, 2, 3), name: 'ppt-blr-ns{setSize-2}-hs{setSize-3}'}, 
    {strategy: (board)=>AnalyzerStrategies._runPptBlrHsNs(board, 3, 2), name: 'ppt-blr-hs{setSize-3}-ns{setSize-2}'}, 
    {strategy: (board)=>AnalyzerStrategies._runPptBlrNsHs(board, 3, 2), name: 'ppt-blr-ns{setSize-3}-hs{setSize-2}'}, 
    {strategy: (board)=>AnalyzerStrategies._runPptBlrHsNs(board, 3, 3), name: 'ppt-blr-hs{setSize-3}-ns{setSize-3}'}, 
    {strategy: (board)=>AnalyzerStrategies._runPptBlrNsHs(board, 3, 2), name: 'ppt-blr-ns{setSize-3}-hs{setSize-3}'}, 

];



module.exports = {StrategyMap, StrategyArray}; 