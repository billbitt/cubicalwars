const db = require('../models');
const logger = require('winston');

// routes to export
module.exports = function (app) {
  let http = require('http').Server(app);
  let io = require('socket.io')(http);

  io.on('connection', function (socket) {
    // manage presence
    socket.on('userconnected', function (username) {
      // mark logged in user as present, get list of all users present
      logger.info('a new user joined the lobby:', username);
      socket.on('disconnect', function () {
        logger.info(username, 'has left the lobby');
      });
    });
    // store and relay incoming chat messsages
    socket.on('chatmessage', function (msg) {
      // send user's chat out to all connected users
      io.emit('chatmessage', msg);
      // add chat to the database for preserving chat history
      db.Chat.create({
        userId: msg.userId,
        text  : msg.text,
      })
      .catch((err) => {
        logger.error('** there was an error adding a chat to the database: ', err);
      });
    });
  });

  return http;
};
