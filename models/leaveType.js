const Joi = require('joi');
const mongoose = require('mongoose');

const leaveTypeSechema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 256
    },
    desc: String,
    isUseAllowance: {
        type: Boolean,
        default: false
    },
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

const LeaveType = new mongoose.model('LeaveType', leaveTypeSechema);

function validateLeaveType(leaveType) {
    const schema = {
        name: Joi.string().max(256).required(),
        desc: Joi.string().optional().allow(null).allow('').max(768),
        isUseAllowance: Joi.boolean(),
        createdBy: Joi.string().optional().allow(null).allow('').max(256),
        modifiedBy: Joi.string().optional().allow(null).allow('').max(256)
    }

    return Joi.validate(leaveType, schema);
}

module.exports.leaveTypeSechema = leaveTypeSechema;
module.exports.LeaveType = LeaveType;
module.exports.validateLeaveType = validateLeaveType;
