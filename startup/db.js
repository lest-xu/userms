const mongoose = require('mongoose');
const config = require("../config/default.json");
const { LogMessage } = require('../middleware/error');

const mongoDbUrl = config.db;

module.exports = function () {
    ///username:password@host:port
    mongoose.connect(mongoDbUrl)
        .then(() => {
            var msg = 'Connected to MongoDB...' + mongoDbUrl;
            LogMessage(msg, 'info', 'mongoDB.log');
            // console.log(msg);
        });
        
}