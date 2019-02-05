const Joi = require('joi');
const mongoose = require('mongoose');

const inventorySechema = new mongoose.Schema({
    contactId: String,
    name: {
        type: String,
        maxlength: 256
    },
    desc: String,
    category: {
        type: String,
        maxlength: 256
    },
    brand: {
        type: String,
        maxlength: 256
    },
    model: {
        type: String,
        maxlength: 256
    },
    itemNumber: {
        type: String,
        maxlength: 256
    },
    location: {
        type: String,
        maxlength: 256
    },
    condition: {
        type: String,
        maxlength: 256
    },
    isActive: {
        type: Boolean,
        default: false
    },
    purchasedDate: Date,
    price: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 1
    },
    userEmail: {
        type: String,
        maxlength: 256
    },
    startedOn: Date,
    endedOn: Date,
    createdBy: {
        type: String,
        maxlength: 256
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const Inventory = new mongoose.model('Inventory', inventorySechema);

function validateInventory(inventory) {
    const schema = {
        contactId: Joi.string().max(256).required(),
        name: Joi.string().max(256).required(),
        desc: Joi.string().optional().allow(null).allow('').max(768),
        category: Joi.string().max(256).required(),
        brand: Joi.string().optional().allow(null).allow('').max(256),
        model: Joi.string().optional().allow(null).allow('').max(256),
        itemNumber: Joi.string().optional().allow(null).allow('').max(256),
        location: Joi.string().optional().allow(null).allow('').max(256),
        condition: Joi.string().optional().allow(null).allow('').max(256),
        isActive: Joi.boolean(),
        purchasedDate: Joi.date().optional().allow(null).allow('').max(256),
        price: Joi.number(),
        quantity: Joi.number(),
        userEmail: Joi.string().optional().allow(null).allow('').max(256),
        startedOn: Joi.date().optional().allow(null).allow('').max(256),
        endedOn: Joi.date().optional().allow(null).allow('').max(256),
        status: Joi.string().optional().allow(null).allow('').max(256),
        createdBy: Joi.string().optional().allow(null).allow('').max(256)
    }

    return Joi.validate(inventory, schema);
}

module.exports.InventorySechema = inventorySechema;
module.exports.Inventory = Inventory;
module.exports.validateInventory = validateInventory;
