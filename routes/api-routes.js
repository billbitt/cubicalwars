const logger = require('winston');
const db = require('./models');

module.exports = app => {
  app.get('/chat', ({ originalUrl, params }, res) => {
    logger.debug(`GET request on ${originalUrl}`);
    db.Chat.getRecent()
    .then((data) => {
      res.status(200).send(data);
    })
  });
};
