const orm = require('../config/orm.js');

const chatModel = {
    // method for inserting one user into users table
  create: (object) => {
    const columns = [];
    const values = [];
    for (let key in object) {
      if (object.hasOwnProperty(key)){
        columns.push(key);
        values.push(object[key]);
      }
    }
    return orm.insertOne('Chat', columns, values);
  },
  selectTenRecent: () => {
    return orm.selectTenRecent('Chat');
  },
};

module.exports = chatModel;
