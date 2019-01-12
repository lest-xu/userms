const Joi = require('joi');
const mongoose = require('mongoose');

const departmentSechema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 256
    },
    desc: String,
    manager: String,
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

const Department = new mongoose.model('Department', departmentSechema);

function validateDepartment(department) {
    const schema = {
        name: Joi.string().max(256).required(),
        desc: Joi.string().optional().allow(null).allow('').max(768),
        manager: Joi.string().optional().allow(null).allow('').max(256),
        createdBy: Joi.string().optional().allow(null).allow('').max(256),
        modifiedBy: JJoi.string().optional().allow(null).allow('').max(256)
    }

    return Joi.validate(department, schema);
}

module.exports.departmentSechema = departmentSechema;
module.exports.Department = Department;
module.exports.validateDepartment = validateDepartment;