const orm = require('../config/orm.js');

const userModel = {
    // method for selecting all from users table
  getAll: () => {
    const columns = 'id, user_name, user_email';
    return orm.selectAll('User', columns);
  },
    // method for inserting one user into users table
  createOne: (userName, userEmail) => {
    const columns = ['user_name', 'user_email'];
    const values = [userName, userEmail];
    return orm.insertOne('User', columns, values);
  },
    // method for updating one user in the users table
  updateOne: (userId, controllerCallback) => {
    const update = 'eaten = true';
    const condition = 'id = ' + userId;
    return orm.updateOne('User', update, condition);
  },
    // method for deleting one user in the users table
  deleteOne: (burgerId, controllerCallback) => {
    const condition = 'id = ' + burgerId;
    return orm.deleteOne('User', condition);
  },
};

module.exports = userModel;
