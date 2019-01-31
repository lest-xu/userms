const auth = require('../middleware/auth');
const validateObjectId = require("../middleware/validateObjectId");
const { Holiday, validateHoliday } = require('../models/holiday');
const express = require('express');
const router = express.Router();
const errorMsg404 = 'The holiday info with the given ID was not found.';

// GET holiday/
router.get('/', auth, async (req, res) => {
    const holiday = await Holiday.find().sort({ 'date': 1 });
    res.send(holiday);
});

// POST holiday/
router.post('/', auth, async (req, res) => {
    const { error } = validateHoliday(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    let holiday = await Holiday.findOne({ name: req.body.name });
    if (holiday) return res.status(400).send('holiday info already existed.');

    holiday = new Holiday({
        name: req.body.name,
        desc: req.body.desc,
        date: req.body.date,
        createdBy: req.body.createdBy
    });

    await holiday.save().then(result => {
        res.send(result);
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });
});

// PUT holiday/id update an holiday info
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validateHoliday(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const now = new Date();
    const holiday = await Holiday.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        desc: req.body.desc,
        date: req.body.date,
        modifiedBy: req.body.modifiedBy,
        modifiedDate: now
    },
        {
            new: true
        });

    if (!holiday) return res.status(404).send(errorMsg404);

    res.send(holiday);
});


// DELETE holiday/id 
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const holiday = await Holiday.findByIdAndRemove(req.params.id);

    if (!holiday) return res.status(404).send(errorMsg404);

    res.send(holiday);
});

// GET holiday/:id
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const holiday = await Holiday.findById(req.params.id);

    if (!holiday) return res.status(404).send(errorMsg404);

    res.send(holiday);
});


module.exports = router;