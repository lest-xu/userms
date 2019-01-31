const Joi = require('joi');
const mongoose = require('mongoose');

const holidaySechema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 256
    },
    desc: String,
    date: Date,
    createdBy: {
        type: String,
        maxlength: 256
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedBy: {
        type: String,
        maxlength: 256
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    }
});

const Holiday = new mongoose.model('Holiday', holidaySechema);

function validateHoliday(holiday) {
    const schema = {
        name: Joi.string().max(256).required(),
        desc: Joi.string().optional().allow(null).allow('').max(768),
        date: Joi.date().optional().allow(null).allow('').max(256),
        createdBy: Joi.string().optional().allow(null).allow('').max(256),
        modifiedBy: Joi.string().optional().allow(null).allow('').max(256)
    }

    return Joi.validate(holiday, schema);
}

module.exports.holidaySechema = holidaySechema;
module.exports.Holiday = Holiday;
module.exports.validateHoliday = validateHoliday;
