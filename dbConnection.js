const {Client} = require('pg'); 


let DATABASE_URI = process.env.HEROKU_POSTGRESQL_BLUE_URL || 'postgresql:///sudoku';
if(process.NODE_ENV==='test') DATABASE_URI = 'postgresql:///sudoku';

const dbConnection = new Client({
                                    connectionString: DATABASE_URI, 
                                    ssl: {
                                        rejectUnauthorized: false
                                    }
});

dbConnection.connect(); 

module.exports = dbConnection; 