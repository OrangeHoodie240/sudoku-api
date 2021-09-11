const express = require('express');
const ExpressError = require('../ExpressError');
const router = new express.Router();
const Database = require('../Database');
const { authenticate, requireExactUser } = require('../middleware/authenticationMiddleware');
const convert2DArrayToFlatString = require('../helpers/convert2DArrayToFlatString');



router.patch('/', authenticate, requireExactUser, async (req, res, next) => {
    const id = req.query.token.id;
    const {puzzleId, level, puzzle } = req.body;
    if (!id || !puzzleId || !level || !puzzle) {
        return next(new ExpressError('Missing parameters', 400));
    }
    puzzle = convert2DArrayToFlatString(puzzle);

    try {
        let success = await Database.updatePuzzle(id, level, puzzleId, puzzle);
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


router.get('/:id',authenticate, requireExactUser, async (req, res, next)=>{
    const id = req.params.id; 
    if(!id){
        return next(new ExpressError('Missing Parameter id', 400)); 
    }
    try{
        const puzzleRows = await Database.getSavedPuzzles(id);
        return res.json({puzzles: puzzleRows}); 
    }
    catch(erorr){
        return next(error);
    }
});

router.post('/', authenticate, requireExactUser, async (req, res, next) => {
    const id = req.query.token.id;
    let { puzzle, puzzleId, level } = req.body;
    if (!id || !puzzle || !puzzleId) {
        return next(new ExpressError('Missing parameters', 400));
    }

    puzzle = convert2DArrayToFlatString(puzzle);
    try {
        let success = await Database.savePuzzle(id, puzzle, level, puzzleId);
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
        let success = await Database.deletePuzzle(id, puzzleId, level);
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





module.exports = router;