const Joi = require('joi');
const mongoose = require('mongoose');
const { appSechema } = require('./app');

const roleSechema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 256
    },
    desc: String,
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
    },
    apps: [appSechema]
});

const Role = new mongoose.model('Role', roleSechema);

function validateRole(role) {
    const schema = {
        name: Joi.string().max(256).required(),
        desc: Joi.string().optional().allow(null).allow('').max(768),
        createdBy: Joi.string().optional().allow(null).allow('').max(256),
        modifiedBy: Joi.string().optional().allow(null).allow('').max(256),
        apps: Joi.array().optional().allow(null).allow('').items(Joi.string())
    }

    return Joi.validate(role, schema);
}

module.exports.roleSechema = roleSechema;
module.exports.Role = Role;
module.exports.validateRole = validateRole;