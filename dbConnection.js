const {Client} = require('pg'); 


let DATABASE_URI = process.env.DATABASE_URL || 'postgresql:///sudoku';
if(process.NODE_ENV==='test') DATABASE_URI = 'postgresql:///sudoku';

const dbConnection = new Client({connectionString: DATABASE_URI});
dbConnection.connect(); 

module.exports = dbConnection; 