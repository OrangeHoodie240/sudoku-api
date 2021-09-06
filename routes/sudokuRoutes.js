const express = require('express');
const { Board } = require('../sudoku/Board');
const Analyzer = require('../sudoku/Analyzer');
const ExpressError = require('../ExpressError');
const router = new express.Router();


router.get('/analysis', (req, res, next) => {
    console.log('here at least');
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

module.exports = router;