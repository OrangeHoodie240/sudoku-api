const dbConnection = require('./dbConnection');
const bcrypt = require('bcrypt');
const ExpressError = require('./ExpressError');


class Database {

    /**
     * @param {String} email 
     * @returns {{id, email}}
     */
    static async getUserByEmail(email) {
        try {
            let user = await dbConnection.query('SELECT id, email FROM sudoku_users WHERE email=$1', [email]);
            user = user.rows[0];
            return user;
        }
        catch (err) {
            throw new ExpressError('Error searching for existing user by email', 500);
        }
    }

    /**
     * 
     * @param {String} email 
     * @param {String} password 
     * @returns 
     */
    static async createUser(email, password) {
        if (!await Database.getUserByEmail(email)) {
            password = await bcrypt.hash(password, 14);
            let query = 'INSERT INTO sudoku_users(email, password) VALUES($1, $2) RETURNING email';
            try {
                let results = await dbConnection.query(query, [email, password]);
                if (results.rows.length > 0) {
                    return true;
                }
            }
            catch (err) {
                console.error(err);
                throw new ExpressError('Error attempting to create user', 500);
            }
        }
        else {
            return false;
        }
    }

    /**
     * Takes email and password. If they match a user, it returns the email and id. 
     * Otherwise returns false.
     * @param {String} email 
     * @param {String} password 
     * @returns {{email, id}}
     */
    static async authenticate(email, password) {
        if (await Database.getUserByEmail(email)) {
            let query = 'SELECT id, password FROM sudoku_users WHERE email=$1';
            try {
                let results = await dbConnection.query(query, [email]);
                const { password: passwordHash, id } = results.rows[0];

                let authenticated = await bcrypt.compare(password, passwordHash);
                if (authenticated) {
                    return { id, email };
                }
                else {
                    return false;
                }
            }
            catch (error) {
                throw new ExpressError('Server error', 500);
            }
        }
        else {
            throw new ExpressError('User does not exist', 400);
        }
    }


    /**
     * 
     * @param {String} id 
     * @param {String} puzzleId 
     * @param {String} level 
     * @returns 
     */
    static async userHasPuzzleSaved(id, puzzleId, level) {
        try {
            let query = 'SELECT puzzle_id FROM sudoku_incomplete_puzzles WHERE user_id=$1 AND puzzle_id=$2 AND level=$3';
            let results = await dbConnection.query(query, [id, puzzleId, level]);
            if (results.rows.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.error(error);
            throw new ExpressError("Server Error", 500);
        }
    }



    /**
     * Receives user id,puzzle, puzzle id and level in form a flat comma delimeted string.
     * @param {String} id 
     * @param {String} puzzle
     * @param {String} level
     * @param {String} puzzleId
     * @returns {Boolean} 
     */
    static async savePuzzle(id, puzzle, level, puzzleId) {
        try {
            const query = `INSERT INTO sudoku_incomplete_puzzles(user_id, level, puzzle, puzzle_id)
                            VALUES($1, $2, $3, $4)
                            RETURNING user_id`;
            let results = await dbConnection.query(query, [id, level, puzzle, puzzleId]);
            results = results.rows[0];
            if (results) {
                return true;
            }
            else {
                return false;
            }

        }
        catch (error) {
            console.error(error);
            throw new Error("Server error", 500);
        }

    }

    /**
     * puzzle must be flat comma delimeted string
     * @param {String} user_id 
     * @param {String} level
     * @param {String} puzzle_id 
     * @param {String} puzzle 
     * @returns 
     */
    static async updatePuzzle(user_id, level, puzzleId, puzzle) {
        let query = `UPDATE sudoku_incomplete_puzzles SET puzzle=$1 WHERE user_id=$2 AND puzzle_id=$3 AND level=$4 RETURNING user_id`;
        try {
            let results = await dbConnection.query(query, [puzzle, user_id, puzzleId, level]);
            if (results.rows.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.error(error);
            throw new ExpressError('Server error', 500);
        }
    }

    /**
     * 
     * @param {String} user_id 
     * @param {String} puzzle_id 
     * @param {String} level 
     * @returns {Boolean}
     */
    static async deletePuzzle(user_id, puzzle_id, level) {
        let query = `DELETE FROM sudoku_incomplete_puzzles WHERE user_id=$1 AND puzzle_id=$2 AND level=$3 RETURNING user_id`;
        try {
            let results = await dbConnection.query(query, [user_id, puzzle_id, level]);
            if (results.rows.length > 0) {
                return true;
            }
        }
        catch (error) {
            console.error(error);
            throw new ExpressError('Server error', 500);
        }
    }

    static async getSavedPuzzles(id){
        let query = 'SELECT puzzle, puzzle_id, level FROM sudoku_incomplete_puzzles WHERE user_id=$1'; 
        try{
            let puzzles = await dbConnection.query(query, [id]); 
            return puzzles.rows; 
        }
        catch(error){
            console.error(error); 
            throw new ExpressError('Server error', 500);
        }
    }

}

module.exports = Database;