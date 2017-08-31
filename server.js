// load dependencies
const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const config = require('config');
const winston = require('winston');
const logLevel = config.get('Logging.LogLevel');
const PORT = process.env.PORT || 3000;
const userController = require('./controllers/user_controller.js');
const chatController = require('./controllers/chat_controller.js');

// configure logging
require('./helpers/logging/loggerSetup.js')(winston, logLevel);

// initialize express app
const app = express();
// set middleware

app.use(express.static(`${__dirname}/public`)); // make express look in the public directory for assets (css/js/img)
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// configure handlebars & register it with Express app
const hbs = expressHandlebars.create({
  defaultLayout: 'main', // sets the default layout
  handlebars   : Handlebars, // includes basic handlebars for access to that library
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// require express routes
app.use('/user', userController);
app.use('/chat', chatController);
require('./routes/html-routes.js')(app);

var http = require('./routes/sockets-routes.js')(app);

// start server
http.listen(PORT, () => {
  winston.info(`Server is listening on PORT ${PORT}`);
});
