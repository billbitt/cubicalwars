// import and set up express
const express = require('express');
const router = express.Router();
const logger = require('winston');
const User = require('../models/user.js'); // import the model

// create routes on the router
router.get('/:id', ({ params }, response) => {
  User.getAllUserInfo(params.id)
    .then((data) => {
      response.send(data);
    })
    .catch(error => {
      logger.error(error);
    });
});

router.post('/', ({ body }, response) => {
  User.createUser(body.userInfo)
    .then((data) => {
      response.send(`user created: ${data}`);
    })
    .catch(error => {
      logger.error(error);
    });
});

router.put('/:id', ({ params, body }, response) => {
  User.updateUser(params.id, body.updatedUserInfo)
    .then((data) => {
      response.send(`user updated: ${data}`);
    })
    .catch(error => {
      logger.error(error);
    });
});

router.delete('/:id', function ({ params }, response) {
  User.deleteUser(params.id)
    .then((data) => {
      response.send(`user deleted: ${data}`);
    })
    .catch(error => {
      logger.error(error);
    });
});

// export the router
module.exports = router;
