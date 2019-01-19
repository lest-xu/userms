const winston = require('winston');
require('winston-mongodb');
const config = require("../config/default.json");

module.exports = function (err, req, res, next) {

    // winston.error(err.message, err);

    const logger = winston.createLogger({
        level: 'error',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'logfile.log' }),
            new winston.transports.MongoDB({ db: config.db }) //log to mongoDB
        ]
    });

    logger.error(err.message, err);

    //error levels
    //error, warn, info, verbose, debug, silly

    res.status(500).send('Something failed.');
}

function LogMessage(err, level = 'error') {
    const logger = winston.createLogger({
        level: level,
        format: winston.format.json(),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'logfile.log' }),
            new winston.transports.MongoDB({ db: config.db }) //log to mongoDB
        ]
    });

    logger.error(err);

}

module.exports.LogMessage = LogMessage;