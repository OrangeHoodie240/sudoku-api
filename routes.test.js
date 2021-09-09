process.env.NODE_ENV = 'test';
const dbConnection = require('./dbConnection');
const app = require('./app');
const request = require('supertest');
const Database = require('./Database');
const getPuzzle = require('./helpers/getPuzzle');
const convert2DArrayToFlatString = require('./helpers/convert2DArrayToFlatString');
const jsonwebtoken = require('jsonwebtoken');

afterAll(async () => {
    await dbConnection.end();
})

beforeEach(async () => {
    testUserAuthentication = { email: 'core999@core.com', password: 'holsenLord' };
    await Database.createUser(testUserAuthentication.email, testUserAuthentication.password);

    let token = await request(app).post('/authenticate/login').send(testUserAuthentication);
    token = token.body.token;
    testUserAuthentication.token = token;

    const payload = jsonwebtoken.decode(token);
    testUserAuthentication.id = payload.id;
});


afterEach(async () => {
    await dbConnection.query('DELETE FROM sudoku_users');
    await dbConnection.query('DELETE FROM sudoku_incomplete_puzzles');
});


describe('test authenticationRoutes', () => {
    test('route for creating users', async () => {
        const userInfo = { email: 'don@don.com', password: 'hero111' };
        let resp = await request(app).post('/authenticate/create-user').send(userInfo);
        expect(resp.body.success)
            .toBe(true);

        let user = await Database.getUserByEmail(userInfo.email);
        expect(user.email)
            .toEqual(userInfo.email);
    });

    test('route for logging in', async () => {
        let resp = await request(app).post('/authenticate/login').send(testUserAuthentication);
        expect(resp.body.token).not.toEqual(undefined);
        expect(resp.body.success).toBe(true);
    });
});


describe('test savedPuzzleRoutes', () => {
    test('test save puzzle, update puzzle, delete puzzle', async () => {

        // test save puzzle route

        const level = 'three';
        let resp = await request(app).get('/sudoku?level=' + level);
        let { puzzle, puzzleId } = resp.body.data;
        puzzle = convert2DArrayToFlatString(puzzle);

        resp = await request(app).post('/saved-puzzles')
            .send({
                token: testUserAuthentication.token,
                puzzle,
                puzzleId,
                level,
                id: testUserAuthentication.id
            });

        let puzzleRow = await dbConnection.query(`SELECT puzzle FROM sudoku_incomplete_puzzles 
                                                        WHERE user_id=$1 AND puzzle_id=$2 AND level=$3`,
            [testUserAuthentication.id, puzzleId, level]);
        puzzleRow = puzzleRow.rows[0];

        expect(puzzleRow.puzzle)
            .toEqual(puzzle);


        // test update puzzle route

        puzzle = puzzle.split(',');
        let firstBlankIndex = puzzle.findIndex(b => b === '0');
        puzzle[firstBlankIndex] = '3';
        puzzle = puzzle.join(',');

        resp = await request(app).patch('/saved-puzzles').send({
            token: testUserAuthentication.token,
            puzzle,
            puzzleId,
            level,
            id: testUserAuthentication.id
        });

        expect(resp.body.success)
            .toBe(true);

        puzzleRow = await dbConnection.query(`SELECT puzzle FROM sudoku_incomplete_puzzles
                                                WHERE user_id=$1 AND puzzle_id=$2 AND level=$3`,
            [testUserAuthentication.id, puzzleId, level]);
        puzzleRow = puzzleRow.rows[0];

        expect(puzzleRow.puzzle)
            .toEqual(puzzle);

        // test puzzle delete

        resp = await request(app).delete('/saved-puzzles').send({
            token: testUserAuthentication.token,
            id: testUserAuthentication.id,
            puzzleId,
            level
        });

        expect(resp.body.success)
            .toEqual(true);

        puzzleRow = await dbConnection.query(`SELECT puzzle FROM sudoku_incomplete_puzzles
            WHERE user_id=$1 AND puzzle_id=$2 AND level=$3`,
            [testUserAuthentication.id, puzzleId, level]);

        expect(puzzleRow.rows.length === 0)
            .toEqual(true);

    });

    test('test getSavedPuzzles', async () => {
        const id = testUserAuthentication.id;

        // get two random puzzles of different levels
        let resp = await request(app).get('/sudoku?level=one');
        let puzzle1 = { ...resp.body.data, level: 'one' };
        puzzle1.puzzle = convert2DArrayToFlatString(puzzle1.puzzle);

        resp = await request(app).get('/sudoku?level=two');
        let puzzle2 = { ...resp.body.data, level: 'two' };
        puzzle2.puzzle = convert2DArrayToFlatString(puzzle2.puzzle);

        // add to users saved puzzles
        await Database.savePuzzle(id, puzzle1.puzzle, puzzle1.level, puzzle1.puzzleId);
        await Database.savePuzzle(id, puzzle2.puzzle, puzzle2.level, puzzle2.puzzleId);

        // attempt to retreive all saved puzzles for user
        const url = '/saved-puzzles/' + id + '?token=' + testUserAuthentication.token;
        resp = await request(app).get(url);
        let puzzles = resp.body.puzzles;

        puzzles = [puzzles[0].puzzle, puzzles[1].puzzle];
        expect(puzzles)
            .toEqual([puzzle1.puzzle, puzzle2.puzzle]);
    });

});