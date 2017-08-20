var db = require('./connection.js');

// helper function to print question marks
function printQuestionMarks (number) {
  var array = [];
    // push everything to an array
  for (var i = 0; i < number; i++) {
    array.push('?');
  };
    // return the array as a string
  return array.join(',');
};

// helper function turn an object into sql
function objectToSql (object) {
  var array = [];
    // push everything to an array
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      array.push(key + " = '" + object[key] + "'");
    };
  };
    // return the array as a string
  return array.join(',');
};

var orm = {
    // method to select all froma table
  selectAll: function (tableName, columns, modelCallback) {
        // build the query
    var sqlQuery = 'SELECT ' + columns + ' FROM ' + tableName; // why can't i do this using the ?s in the db.query?
        // make the query
    return db.query(sqlQuery);
  },
    // method to add one row to a table based on one colum
  insertOne: function (tableName, columnsArray, valuesArray, modelCallback) {
        // parse the input
    var columns = ' (' + columnsArray.join(',') + ') ';
        // build the query
    var sqlQuery = 'INSERT INTO ' + tableName + columns;
    sqlQuery += 'VALUES (' + printQuestionMarks(valuesArray.length) + ');';
    console.log(sqlQuery);
        // make the query
    return db.query(sqlQuery, valuesArray); // might need to turn this into a promise
  },
  // method to update one entry
  updateOne: function (tableName, values, condition, modelCallback) {
    // build the query
    var sqlQuery = 'UPDATE ' + tableName + ' ';
    sqlQuery += 'SET ' + values + ' ';
    sqlQuery += 'WHERE ' + condition + ';';
    console.log(sqlQuery);
    // make the query
    return db.query(sqlQuery);
  },
     // method to update one entry
  updateAll: function (tableName, values, condition, modelCallback) {
        // build the query
    var sqlQuery = 'UPDATE ' + tableName + ' ';
    sqlQuery += 'SET ' + objectToSql(values) + ' ';
    sqlQuery += 'WHERE ' + condition + ';';
    console.log(sqlQuery);
        // make the query
    return db.query(sqlQuery);
  },
    // method to delete one entry
  deleteOne: function (tableName, condition, modelCallback) {
        // build the query
    var sqlQuery = 'DELETE FROM ' + tableName + ' ';
    sqlQuery += 'WHERE ' + condition + ';';
    console.log(sqlQuery);
        // make the query
    return db.query(sqlQuery);
  },
};

module.exports = orm;
