const express = require('express'); 
const sudokuRoutes = require('./routes/sudokuRoutes');
const cors = require('cors');

const app = express(); 

app.use(cors({origin: '*'}));

app.use(express.json())
app.use(express.urlencoded({extended: true})); 


app.use('/sudoku', sudokuRoutes);

app.use((error, req, res, next)=>{
    const message = error.message;
    const status = error.status || 500; 
    return res.status(status).json({error: {message, status}});    
});

module.exports = app;