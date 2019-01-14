const Joi = require('joi');
const mongoose = require('mongoose');

const hrSechema = new mongoose.Schema({
    contactId: String,
    name: {
        type: String,
        maxlength: 256
    },
    desc: String,
    sin: String,
    salary: Number,
    jobTitle: {
        type: String,
        maxlength: 256
    },
    jobType: {
        type: String,
        maxlength: 256
    },
    jobDesc: String,
    vacationDays: Number,
    sickDays: Number,
    joinDate: Date,
    startDate: Date,
    endDate: Date,
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

const HumanResource = new mongoose.model('HumanResource', hrSechema);

function validateHumanResource(humanResource) {
    const schema = {
        contactId: Joi.string().max(256).required(),
        name: Joi.string().max(256).required(),
        desc: Joi.string().optional().allow(null).allow('').max(768),
        sin: Joi.number(),
        salary: Joi.number(),
        jobTitle: Joi.string().optional().allow(null).allow('').max(256),
        jobType:Joi.string().optional().allow(null).allow('').max(256),
        jobDesc: Joi.string().optional().allow(null).allow('').max(768),
        vacationDays: Joi.number(),
        sickDays: Joi.number(),
        joinDate: Joi.date().optional().allow(null).allow('').max(256),
        startDate: Joi.date().optional().allow(null).allow('').max(256),
        endDate: Joi.date().optional().allow(null).allow('').max(256),
        createdBy: Joi.string().optional().allow(null).allow('').max(256),
        modifiedBy: Joi.string().optional().allow(null).allow('').max(256)
    }

    return Joi.validate(humanResource, schema);
}

module.exports.hrSechema = hrSechema;
module.exports.HumanResource = HumanResource;
module.exports.validateHumanResource = validateHumanResource;
