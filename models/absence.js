const Joi = require('joi');
const mongoose = require('mongoose');

const absenceSechema = new mongoose.Schema({
    contactId: String,
    userEmail: {
        type: String,
        maxlength: 256
    },
    leaveTypeId: String,
    leaveTypeName: {
        type: String,
        maxlength: 256
    },
    startedOn: Date,
    endedOn: Date,
    status: {
        type: String,
        maxlength: 256
    },
    approvedBy: {
        type: String,
        maxlength: 256
    },
    approvedDate: Date,
    dateDeducted: {
        type: Number,
        default: 0
    },
    details: {
        type: String,
        maxlength: 768
    }
});

const Absence = new mongoose.model('Absence', absenceSechema);

function validateAbsence(absence) {
    const schema = {
        contactId: Joi.string().max(256).required(),
        userEmail: Joi.string().max(256).required(),
        leaveTypeId: Joi.string().max(256).required(),
        leaveTypeName: Joi.string().max(256).required(),
        startedOn: Joi.date().required(),
        endedOn: Joi.date().required(),
        status: Joi.string().optional().allow(null).allow('').max(256),
        approvedBy: Joi.string().optional().allow(null).allow('').max(256),
        approvedDate: Joi.date().optional().allow(null).allow('').max(256),
        dateDeducted: Joi.number(),
        details: Joi.string().optional().allow(null).allow('').max(768)
    }

    return Joi.validate(absence, schema);
}

module.exports.absenceSechema = absenceSechema;
module.exports.Absence = Absence;
module.exports.validateAbsence = validateAbsence;
