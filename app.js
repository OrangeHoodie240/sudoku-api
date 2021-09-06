const express = require('express'); 
const sudokuRoutes = require('./routes/sudokuRoutes');


const app = express(); 


app.use(express.json())
app.use(express.urlencoded({extended: true})); 


app.use('/sudoku', sudokuRoutes);
console.log('here at least');

app.use((error, req, res, next)=>{
    const message = error.message;
    const status = error.status || 500; 
    return res.status(status).json({error: {message, status}});    
});

module.exports = app;