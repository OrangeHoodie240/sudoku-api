const express = require('express'); 
const sudokuRoutes = require('./routes/sudokuRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');
const savedPUzzleRoutes = require('./routes/savedPuzzlesRoutes');
const authenticationMiddleware = require('./middleware/authenticationMiddleware');
const cors = require('cors');
const path = require('path');


const app = express(); 

let referer = null; 
app.use((req, res, next)=>{
    referer = req.headers.referer; 
    return next(); 
});
app.use(cors({origin: referer}));


app.use((req,res,next)=>{
    console.log('here2',referer);
    return next();
});


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


app.use('/saved-puzzles', savedPUzzleRoutes);


app.use((error, req, res, next)=>{
    const message = error.message;
    const status = error.status || 500; 
    return res.status(status).json({error: {message, status}});    
});

module.exports = app;