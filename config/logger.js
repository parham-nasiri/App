const winston = require('winston');

/*const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ],
});
*/

//logger.info('User logged in successfully.', { userId: 123 });
//logger.error('Failed to process order.', { orderId: 456, error: 'Payment declined' });
const logger = {
  info: (...args) => console.log('INFO:', ...args),
  error: (...args) => console.error('ERROR:', ...args),
};

module.exports = logger;
