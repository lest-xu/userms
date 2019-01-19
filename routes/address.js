const auth = require('../middleware/auth');
const validateObjectId = require("../middleware/validateObjectId");
const { Address, validateAddress } = require('../models/address');
const express = require('express');
var _ = require('lodash');
const router = express.Router();
const errorMsg404 = 'The address with the given ID was not found.';

// GET addresses/
router.get('/', auth, async (req, res) => {
    const addresses = await Address.find().sort({ 'createdDate': -1 });
    res.send(addresses);
});

// POST addresses/
router.post('/', auth, async (req, res) => {
    const { error } = validateAddress(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    let address = await Address.findOne({ line1: req.body.line1 });
    if (address) return res.status(400).send('address already existed.');

    address = new Address({
        contactId: req.body.contactId,
        unit: req.body.unit,
        line1: req.body.line1,
        lien2: req.body.line2,
        city: req.body.city,
        province: req.body.province,
        country: req.body.country,
        zipcode: req.body.zipcode,
        pobox: req.body.pobox,
        isPrimary: req.body.isPrimary,
        createdBy: req.body.createdBy
    });

    await address.save().then(result => {
        res.send(_.pick(result, ['contactId', 'line1', 'city', 'province', 'province', 'country', 'zipcode']));
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });
});

// PUT addresses/id update an address
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validateAddress(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const now = new Date();
    const address = await Address.findByIdAndUpdate(req.params.id, {
        unit: req.body.unit,
        line1: req.body.line1,
        lien2: req.body.line2,
        city: req.body.city,
        province: req.body.province,
        country: req.body.country,
        zipcode: req.body.zipcode,
        pobox: req.body.pobox,
        isPrimary: req.body.isPrimary,
        modifiedBy: req.body.modifiedBy,
        modifiedDate: now
    },
        {
            new: true
        });

    if (!address) return res.status(404).send(errorMsg404);

    res.send(address);
});


// DELETE address/id 
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const address = await Address.findByIdAndRemove(req.params.id);

    if (!address) return res.status(404).send(errorMsg404);

    res.send(address);
});

// GET addresses/:id
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const address = await Address.findById(req.params.id);

    if (!address) return res.status(404).send(errorMsg404);

    res.send(address);
});


module.exports = router;