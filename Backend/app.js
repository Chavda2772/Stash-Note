// Modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger.js');
const cors = require('cors');

logger.info('Environment Mode: ' + process.env.NODE_ENV);

// Routes
const apiRouter = require('./routes/apiRoute');

// Application Configurations
const app = express();

if (process.env.NODE_ENV != 'production') {
  app.use(require('morgan')('dev'));
  require('dotenv').config();
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: process.env.allow_cors?.split(','),
  })
);
logger.info('Allowed origins-' + process.env.allow_cors);

app.use('/api', apiRouter);
logger.info('Routes are configured.');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  logger.error('original URL :', req.originalUrl);
  logger.error(err.message, err);

  // render the error page
  res.status(err.status || 500);
  res.send({
    success: false,
    message: err.message,
  });
});
logger.info('Application error handler attached');

logger.info('Application configuration applied successfully');
module.exports = app;