const Joi = require('joi');
const mongoose = require('mongoose');

const appSechema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 256
    },
    desc: {
        type: String,
        maxlength: 768
    },
    iconId: {
        type: String,
        maxlength: 20
    },
    url: {
        type: String,
        maxlength: 256
    },
    logoUrl: {
        type: String,
        maxlength: 256
    },
    enabled: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String,
        maxlength: 256
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const App = new mongoose.model('App', appSechema);

function validateApp(app) {
    const schema = {
        name: Joi.string().max(256).required(),
        desc: Joi.string().optional().allow(null).allow('').max(768),
        iconId: Joi.string().optional().allow(null).allow('').max(20),
        url: Joi.string().optional().allow(null).allow('').max(256),
        logoUrl: Joi.string().optional().allow(null).allow('').max(256),
        enabled: Joi.boolean(),
        createdBy: Joi.string().optional().allow(null).allow('').max(256)
    }

    return Joi.validate(app, schema);
}

module.exports.appSechema = appSechema;
module.exports.App = App;
module.exports.validateApp = validateApp;