const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const Joi = require('joi');
const mongoose = require('mongoose');
// const { addressSechema } = require('./address');
// const { hrSechema } = require('./hr');
// const { departmentSechema } = require('./department');
// const { roleSechema } = require('./role');

const contactSechema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    middleName: String,
    nickName: String,
    gender: {
        type: String,
        required: true,
        enum: ['M', 'F', 'X']
    },
    birthDate: Date,
    profileImgUrl: String,
    isEnabled: {
        type: Boolean,
        default: true
    },
    phone: String,
    phoneExtension: String,
    mobile: String,
    fax: String,
    userName: {
        type: String,
        maxlength: 256,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        minlength: 4,
        maxlength: 256,
        lowercase: true
    },
    emailConfirmed: {
        type: Boolean,
        default: false
    },
    twoFactor: {
        type: Boolean,
        default: false
    },
    loginCount: Number,
    failedCount: Number,
    isAdvanced: {
        type: Boolean,
        default: false
    },
    createdBy: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedBy: String,
    modifiedDate: {
        type: Date,
        default: Date.now
    },
    homeAddress: String,
    mailingAddress: String,
    hr: String,
    department: String,
    role: String,
});

contactSechema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, role: this.role}, config.jwtPrivateKey);
    return token;
}

const Contact = mongoose.model('Contact', contactSechema);

function validateContact(contact) {
    const schema = {
        firstName: Joi.string().min(2).max(256).required(),
        lastName: Joi.string().min(2).max(256).required(),
        middleName: Joi.string().optional().allow(null).allow('').max(256),
        nickName: Joi.string().optional().allow(null).allow('').max(256),
        gender: Joi.string().valid('M', 'F', 'X').required(),
        birthDate: Joi.date(),
        profileImgUrl: Joi.string().optional().allow(null).allow('').uri(),
        isEnabled: Joi.boolean(),
        phone: Joi.string().optional().allow(null).allow('').min(6).max(20),
        phoneExtension: Joi.string().optional().allow(null).allow('').min(6).max(20),
        mobile: Joi.string().optional().allow(null).allow('').min(6).max(20),
        fax: Joi.string().optional().allow(null).allow('').min(6).max(20),
        userName: Joi.string().alphanum().min(3).max(50).required(),
        password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])[a-zA-Z0-9]{6,20}$/).required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).max(256).required(),
        emailConfirmed: Joi.boolean(),
        twoFactor: Joi.boolean(),
        loginCount: Joi.number(),
        failedCount: Joi.number(),
        isAdvanced: Joi.boolean(),
        createdBy: Joi.string().optional().allow(null).allow('').max(256),
        modifiedBy: Joi.string().optional().allow(null).allow('').max(256),
        homeAddress: Joi.string().optional().allow(null).allow(''),
        mailingAddress: Joi.string().optional().allow(null).allow(''),
        hr: Joi.string().optional().allow(null).allow(''),
        department: Joi.string().optional().allow(null).allow(''),
        role: Joi.string().optional().allow(null).allow('')
    }

    return Joi.validate(contact, schema);
}

module.exports.Contact = Contact;
module.exports.validateContact = validateContact;

// password regular expression
// /^
//   (?=.*\d)          // should contain at least one digit
//   (?=.*[a-z])       // should contain at least one lower case
//   (?=.*[A-Z])       // should contain at least one upper case
//   [a-zA-Z0-9]{6,20}   // should contain at least 6 and max 20 from the mentioned characters
// $/