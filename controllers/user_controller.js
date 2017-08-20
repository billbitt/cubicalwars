// import and set up express
const express = require('express');
const router = express.Router();
const logger = require('winston');
const user = require('../models/user.js'); // import the model

// create routes on the router
router.get('/:id', ({ params }, response) => {
  user.getAllUserInfo(params.id)
    .then((data) => {
      response.send(data);
    })
    .catch(error => {
      logger.error(error);
    });
});

router.post('/', ({ body }, response) => {
  user.createUser(body.userInfo)
    .then((data) => {
      response.send(`user created: ${data}`);
    })
    .catch(error => {
      logger.error(error);
    });
});

router.put('/:id', ({ params, body }, response) => {
  user.updateUser(params.id, body.updatedUserInfo)
    .then((data) => {
      response.send(`user updated: ${data}`);
    })
    .catch(error => {
      logger.error(error);
    });
});

router.delete('/:id', function ({ params }, response) {
  user.deleteUser(params.id)
    .then((data) => {
      response.send(`user deleted: ${data}`);
    })
    .catch(error => {
      logger.error(error);
    });
});

// export the router
module.exports = router;
