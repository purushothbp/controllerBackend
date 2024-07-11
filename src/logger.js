const winston = require('winston');


exports.logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
    ],
  });
  
  