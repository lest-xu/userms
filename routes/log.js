const auth = require('../middleware/auth');
const validateObjectId = require("../middleware/validateObjectId");
const { Logs, validateLogs } = require('../models/log');
const express = require('express');
const router = express.Router();
const errorMsg404 = 'The item with the given ID was not found.';

// GET logs/
router.get('/', auth, async (req, res) => {
    const logs = await Logs.find().sort({ 'createdDate': -1 });
    res.send(logs);
});

// POST logs/
router.post('/', auth, async (req, res) => {
    const { error } = validateLogs(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    let logs = await Logs.findOne({ name: req.body.name });
    if (logs) return res.status(400).send('data already existed.');

    logs = new Logs({
        name: req.body.name,
        value: req.body.value,
        desc: req.body.desc,
        enabled: req.body.enabled,
        createdBy: req.body.createdBy
    });

    await logs.save().then(result => {
        res.send(result);
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });
});

// PUT logs/id update an logs info
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validateLogs(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const logs = await Logs.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        value: req.body.value,
        desc: req.body.desc,
        enabled: req.body.enabled,
        modifiedBy: req.body.modifiedBy
    },
        {
            new: true
        });

    if (!logs) return res.status(404).send(errorMsg404);

    res.send(logs);
});


// DELETE logs/id 
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const logs = await Logs.findByIdAndRemove(req.params.id);

    if (!logs) return res.status(404).send(errorMsg404);

    res.send(logs);
});

// GET logs/:id
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const logs = await Logs.findById(req.params.id);

    if (!logs) return res.status(404).send(errorMsg404);

    res.send(logs);
});


module.exports = router;