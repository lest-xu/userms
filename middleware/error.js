const winston = require('winston');

module.exports = function (err, req, res, next) {

    // winston.error(err.message, err);

    const logger = winston.createLogger({
        level: 'error',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'logfile.log' })
        ]
    });

    logger.error(err.message, err);

    //error levels
    //error, warn, info, verbose, debug, silly

    res.status(500).send('Something failed.');
}