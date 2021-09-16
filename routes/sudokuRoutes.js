const express = require('express');
const { Board } = require('../sudoku/Board');
const Analyzer = require('../sudoku/Analyzer');
const ExpressError = require('../ExpressError');
const config = require('../config');
const getPuzzle = require('../helpers/getPuzzle');
const getSpecificPuzzle = require('../helpers/getSpecificPuzzle');
const router = new express.Router();


router.get('/analysis', async (req, res, next) => {
    let puzzle = req.query.puzzle;
    if (!puzzle) {
        return next(new ExpressError('Bad request', 400));
    }

    try {
        puzzle = Board.getBoardFromFlatString(puzzle);
        const analysis = Analyzer.analyze(puzzle);
        if (analysis.success) {
            return res.json({ data: analysis });
        }
        else {
            return res.json({ error: 'unable to analyze' });
        }
    }
    catch(error) {
        console.error(error);
        return next(new ExpressError('something went wrong', 500));
    }
});


router.get('/', async (req, res, next)=>{
   let level = req.query.level; 
   if(!config.levels.includes('level-' + level)){
       return next(new ExpressError('missing level parameter',400));
   }
   const data = getPuzzle(level);
   return res.json({data});
});

router.get('/:level/:id', async (req, res, next)=>{
    const {level, id} = req.params;
    if(!config.levels.includes('level-' + level)){
        return next(new ExpressError('invalid or missing level parameter',400));
    }

    let idNum = Number(id);
    if(Number.isNaN(idNum) || idNum < 1 || idNum > 1000 || idNum - Math.floor(idNum) > 0){
        return next(new ExpressError('Invalid or missing id parameter'))
    }

    const data = getSpecificPuzzle(level, id);
    return res.json({data});
 });

module.exports = router;