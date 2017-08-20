
const mysql = require('mysql');
const logger = require('winston');

let connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host    : 'localhost',
    port    : 3306,
    user    : 'root',
    password: 'JW55cw04',
    database: 'cubewars_db',
  });
};

connection.connect(function (error) {
  if (error) {
    logger.error('An error occured connecting to MySQL:', error);
    return;
  }
  logger.info('Connected to MySQL as connection:', connection.threadId);
});

module.exports = connection;
