const mongoose = require('mongoose');
const config = require("../config/default.json");
const winston = require('winston');
require('winston-mongodb');

const mongoDbUrl = config.db;

module.exports = function () {

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'mongoDB.log' }),
            new winston.transports.MongoDB({ db: config.db }) //log to mongoDB
        ]
    });

    ///username:password@host:port
    mongoose.connect(mongoDbUrl)
        .then(() => {
            var msg = 'Connected to MongoDB...' + mongoDbUrl;
            console.log(msg);
        })
        .catch(error => {
            console.error('Could not connect to MongoDB', error);
            logger.info(error.message, error);
        });

}