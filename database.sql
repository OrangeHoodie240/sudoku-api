DROP DATABASE IF EXISTS sudoku; 
CREATE DATABASE sudoku;


\c sudoku;


CREATE TABLE sudoku_users(
    id SERIAL PRIMARY KEY, 
    email VARCHAR(64) NOT NULL UNIQUE,  
    password VARCHAR(255) NOT NULL
    ); 

CREATE TABLE sudoku_incomplete_puzzles(
    user_id INTEGER REFERENCES sudoku_users(id) ON DELETE CASCADE, 
    level VARCHAR(10) NOT NULL, 
    puzzle_id INT UNIQUE NOT NULL, 
    puzzle CHAR(162) NOT NULL UNIQUE
    ); 
