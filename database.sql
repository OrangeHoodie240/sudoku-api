DROP DATABASE IF EXISTS sudoku; 
CREATE DATABASE sudoku;


\c sudoku;


CREATE TABLE sudoku_users(
    id SERIAL PRIMARY KEY, 
    email VARCHAR(64) NOT NULL UNIQUE,  
    password VARCHAR(32) NOT NULL
    ); 

CREATE TABLE sudoku_incomplete_puzzles(
    user_id INTEGER REFERENCES sudoku_users(id) ON DELETE CASCADE, 
    level INT NOT NULL UNIQUE, 
    puzzle_id INT UNIQUE NOT NULL, 
    puzzle CHAR(161) NOT NULL UNIQUE
    ); 
