const {Client} = require('pg'); 


let DATABASE_URI = process.env.HEROKU_POSTGRESQL_BLUE_URL || 'postgresql:///sudoku';
if(process.env.NODE_ENV==='test') DATABASE_URI = 'postgresql:///sudoku';
const ssl = (process.env.NODE_ENV !== 'test') ? {rejectUnauthorized: false} : false;
const dbConnection = new Client({
                                    connectionString: DATABASE_URI, 
                                    ssl
});

dbConnection.connect(); 

module.exports = dbConnection; 