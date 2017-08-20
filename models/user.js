const orm = require('../config/orm.js');

const userModel = {
    // method for selecting all from users table
  getAllUserInfo: () => {
    const columns = 'id, user_name, user_email';
    return orm.selectAll('users', columns);
  },
    // method for inserting one user into users table
  createUser: (userName, userEmail) => {
    const columns = ['user_name', 'user_email'];
    const values = [userName, userEmail];
    return orm.insertOne('users', columns, values);
  },
    // method for updating one user in the users table
  updateUser: (userId, controllerCallback) => {
    const update = 'eaten = true';
    const condition = 'id = ' + userId;
    return orm.updateOne('users', update, condition);
  },
    // method for deleting one user in the users table
  deleteUser: (burgerId, controllerCallback) => {
    const condition = 'id = ' + burgerId;
    return orm.deleteOne('users', condition);
  },
};

module.exports = userModel;
