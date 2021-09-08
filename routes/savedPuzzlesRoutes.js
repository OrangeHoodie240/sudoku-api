const express = require('express');
const ExpressError = require('../ExpressError');
const router = new express.Router();
const Database = require('../Database');
const { Board } = require('../sudoku/Board');
const { authenticate, requireExactUser } = require('../middleware/authenticationMiddleware');
const convert2DArrayToFlatString = require('../helpers/convert2DArrayToFlatString');


router.post('/', authenticate, requireExactUser, async (req, rex, next) => {
    const id = req.query.token.id;
    let { puzzle, puzzleId, level } = req.body;
    if (!email || !puzzle || !puzzleId) {
        return next(new ExpressError('Missing parameters', 400));
    }

    // convert board from 2D matrix to flat string
    puzzle = convert2DArrayToFlatString(puzzle);

    try {
        let success = Database.savePuzzle(id, puzzle, puzzleId, level);
        if (success) {
            return res.json({ success: true });
        }
        else {
            return res.json({ success: false });
        }
    }
    catch (error) {
        return next(error);
    }
});



router.delete('/', authenticate, requireExactUser, async (req, res, next) => {
    const id = req.query.token.id;
    const {puzzleId, level } = req.body;
    if (!id|| !puzzleId) {
        return next(new ExpressError('Missing parameters', 400));
    }
    try {
        let success = Database.deletePuzzle(id, puzzleId, level);
        if (success) {
            return res.json({ success: true });
        }
        else {
            return res.json({ succes: false });
        }
    }
    catch (error) {
        return next(error);
    }
});


router.patch('/', authenticate, requireExactUser, async (req, res, next) => {
    const id = req.query.token.id;
    const {puzzle, puzzleId, level } = req.body;
    if (!id || !puzzle || !puzzleId) {
        return next(new ExpressError('Missing parameters', 400));
    }
    try {
        let success = Database.updatePuzzle(id, level, puzzleId, puzzle);
        if (success) {
            return res.json({ success: true });
        }
        else {
            return res.json({ succes: false });
        }
    }
    catch (error) {
        return next(error);
    }
});



module.exports = router;