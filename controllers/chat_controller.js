// import and set up express
const express = require('express');
const router = express.Router();
const logger = require('winston');
const Chat = require('../models/chat.js'); // import the model

// create routes on the router
router.get('/', (request, response) => {
  // Chat.selectTenRecent()
  //   .then((data) => {
  //     response.send(data);
  //   })
  //   .catch(error => {
  //     logger.error(error);
  //   });
  Chat.selectTenRecent()
  .then((data) => {
    response.send(data);
  })
  .catch(error => {
    logger.error(error);
  });
});

// export the router
module.exports = router;
