require('express-async-errors');
const { LogMessage } = require('../middleware/error');

module.exports = function () {
    //uncaught exceptions
    process.on('uncaughtException', (ex) => {
        LogMessage(ex.message, 'info', 'uncaughtException.log');
        process.exit(1);
    })

    // unhandled Rejection
    process.on('unhandledRejection', (ex) => {
        LogMessage(ex.message, 'info', 'unhandledRejection.log');
        process.exit(1);
    })
}