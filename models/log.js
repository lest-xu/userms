const Joi = require('joi');
const mongoose = require('mongoose');

const logsSechema = new mongoose.Schema({
    timestamp:  {
        type: Date,
        default: Date.now
    },
    level: String,
    message: String,
    meta: String
});

const Logs = new mongoose.model('Logs', logsSechema);

function validateLogs(logs) {
    const schema = {
        level: Joi.string().max(256).required(),
        message: Joi.string().optional().allow(null).allow(''),
        meta:   Joi.string().optional().allow(null).allow('')
    }

    return Joi.validate(logs, schema);
}

module.exports.LogsSechema = logsSechema;
module.exports.Logs = Logs;
module.exports.validateLogs = validateLogs;