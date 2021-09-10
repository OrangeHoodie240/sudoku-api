const express = require('express'); 
const sudokuRoutes = require('./routes/sudokuRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');
const savedPUzzleRoutes = require('./routes/savedPuzzlesRoutes');
const authenticationMiddleware = require('./middleware/authenticationMiddleware');
const cors = require('cors');
const path = require('path');


const app = express(); 

app.use(cors({
    origin: ['https://steven-sudoku-api.herokuapp.com/','*'], 
    preflightContinue: true,
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({extended: true})); 
app.use(express.static(path.join(__dirname, 'build')));

app.get('/play-demo', (req, res, next)=>{
    return res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/sudoku', sudokuRoutes);


// this will search for a token attach the payload if it exists
app.use(authenticationMiddleware.searchForToken);

app.use('/authenticate', authenticationRoutes);

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return next();
});


app.use('/saved-puzzles', savedPUzzleRoutes);


app.use((error, req, res, next)=>{
    const message = error.message;
    const status = error.status || 500; 
    return res.status(status).json({error: {message, status}});    
});

module.exports = app;