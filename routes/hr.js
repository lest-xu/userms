const auth = require('../middleware/auth');
const { HumanResource, validateHumanResource } = require('../models/hr');
const express = require('express');
const router = express.Router();
const errorMsg404 = 'The hr info with the given ID was not found.';

// GET hr/
router.get('/', auth, async (req, res) => {
    const hr = await HumanResource.find().sort({ 'createdDate': -1 });
    res.send(hr);
});

// GET hr/:id
router.get('/:id', auth, async (req, res) => {
    const hr = await HumanResource.findById(req.params.id);

    if (!hr) return res.status(404).send(errorMsg404);

    res.send(hr);
});


// POST hr/
router.post('/', auth, async (req, res) => {
    const { error } = validateHumanResource(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    let hr = await HumanResource.findOne({ contactId: req.body.contactId });
    if (hr) return res.status(400).send('hr info already existed.');

    hr = new HumanResource({
        contactId: req.body.contactId,
        name: req.body.name,
        desc: req.body.desc,
        sin: req.body.sin,
        salary: req.body.salary,
        jobTitle: req.body.jobTitle,
        jobType: req.body.jobType,
        jobDesc: req.body.jobDesc,
        vacationDays: req.body.vacationDays,
        sickDays: req.body.sickDays,
        joinDate: req.body.joinDate,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        createdBy: req.body.createdBy
    });

    await hr.save().then(result => {
        res.send(result);
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });
});

// PUT hr/id update an hr info
router.put('/:id', auth, async (req, res) => {
    const { error } = validateHumanResource(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const hr = await HumanResource.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        desc: req.body.desc,
        sin: req.body.sin,
        salary: req.body.salary,
        jobTitle: req.body.jobTitle,
        jobType: req.body.jobType,
        jobDesc: req.body.jobDesc,
        vacationDays: req.body.vacationDays,
        sickDays: req.body.sickDays,
        joinDate: req.body.joinDate,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        modifiedBy: req.body.modifiedBy
    },
        {
            new: true
        });

    if (!hr) return res.status(404).send(errorMsg404);

    res.send(hr);
});


// DELETE hr/id 
router.delete('/:id', auth, async (req, res) => {
    const hr = await HumanResource.findByIdAndRemove(req.params.id);

    if (!hr) return res.status(404).send(errorMsg404);

    res.send(hr);
});

module.exports = router;