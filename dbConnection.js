const {Client} = require('pg'); 


const DATABASE_URI = process.env.DATABASE_URI || 'postgresql:///sudoku';

const dbConnection = new Client({connectionString: DATABASE_URI});
dbConnection.connect(); 

module.exports = dbConnection; 