const {Client} = require('pg'); 


let DATABASE_URI = process.env.HEROKU_POSTGRESQL_BLUE_URL || 'postgresql:///sudoku';
if(process.NODE_ENV==='test') DATABASE_URI = 'postgresql:///sudoku';
console.log(DATABASE_URI);
const dbConnection = new Client({connectionString: DATABASE_URI});
dbConnection.connect(); 

module.exports = dbConnection; 