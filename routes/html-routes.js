const logger = require('winston');

module.exports = app => {


  app.get('/', ({ originalUrl, params }, res) => {
    logger.debug(`GET request on ${originalUrl}`);
    res.status(200).render('lobby');
  });

  app.get('/game/:gameId', ({ originalUrl, params }, res) => {
    logger.debug(`GET request on ${originalUrl}`);
    res.status(200).render('game');
  });

  app.get('*', ({ originalUrl, params }, res) => {
    logger.debug(`GET request on ${originalUrl} returned 404`);
    res.status(404).json({error: {msg: '404 that page does not exist'}});
  });
};
