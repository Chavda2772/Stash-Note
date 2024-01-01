const log4js = require('log4js');

// Setup Logger
log4js.configure({
  appenders: {
    application: {
      type: 'file',
      filename: `Logs/${new Date().toDateString().split(' ').join('_')}.log`,
    },
  },
  categories: {
    default: {
      appenders: ['application'],
      level: 'debug',
    },
  },
});

module.exports = log4js.getLogger('ApplicationLog');
