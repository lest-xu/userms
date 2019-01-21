const auth = require('../middleware/auth');
const validateObjectId = require("../middleware/validateObjectId");
const { Settings, validateSettings } = require('../models/settings');
const express = require('express');
const router = express.Router();
const errorMsg404 = 'The item with the given ID was not found.';

// GET settings/
router.get('/', auth, async (req, res) => {
    const settings = await Settings.find().sort({ 'createdDate': -1 });
    res.send(settings);
});

// POST settings/
router.post('/', auth, async (req, res) => {
    const { error } = validateSettings(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    let settings = await Settings.findOne({ name: req.body.name });
    if (settings) return res.status(400).send('data already existed.');

    settings = new Settings({
        name: req.body.name,
        value: req.body.value,
        desc: req.body.desc,
        enabled: req.body.enabled,
        createdBy: req.body.createdBy
    });

    await settings.save().then(result => {
        res.send(result);
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });
});

// PUT settings/id update an settings info
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validateSettings(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const settings = await Settings.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        value: req.body.value,
        desc: req.body.desc,
        enabled: req.body.enabled,
        modifiedBy: req.body.modifiedBy
    },
        {
            new: true
        });

    if (!settings) return res.status(404).send(errorMsg404);

    res.send(settings);
});


// DELETE settings/id 
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const settings = await Settings.findByIdAndRemove(req.params.id);

    if (!settings) return res.status(404).send(errorMsg404);

    res.send(settings);
});

// GET settings/:id
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const settings = await Settings.findById(req.params.id);

    if (!settings) return res.status(404).send(errorMsg404);

    res.send(settings);
});


module.exports = router;