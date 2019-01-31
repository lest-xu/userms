const auth = require('../middleware/auth');
const validateObjectId = require("../middleware/validateObjectId");
const { Absence, validateAbsence } = require('../models/absence');
const express = require('express');
const router = express.Router();
const errorMsg404 = 'The absence info with the given ID was not found.';

// GET absence/
router.get('/', auth, async (req, res) => {
    const absences = await Absence.find().sort({ 'startedOn': -1 });
    res.send(absences);
});

// POST absence/
router.post('/', auth, async (req, res) => {
    const { error } = validateAbsence(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    let absence = await Absence.findOne({ startedOn: req.body.startedOn });
    if (absence) return res.status(400).send('absence info already existed.');

    absence = new Absence({
        contactId: req.body.contactId,
        userEmail: req.body.userEmail,
        leaveTypeId: req.body.leaveTypeId,
        leaveTypeName: req.body.leaveTypeName,
        startedOn: req.body.startedOn,
        endedOn: req.body.endedOn,
        status: req.body.status,
        approvedBy: req.body.approvedBy,
        details: req.body.details
    });

    await absence.save().then(result => {
        res.send(result);
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });
});

// PUT absence/id update an absence info
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validateAbsence(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const now = new Date();
    const absence = await Absence.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
        approvedBy: req.body.approvedBy,
        approvedDate: req.body.approvedDate,
        dateDeducted: req.body.dateDeducted
    },
        {
            new: true
        });

    if (!absence) return res.status(404).send(errorMsg404);

    res.send(absence);
});


// DELETE absence/id 
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const absence = await Absence.findByIdAndRemove(req.params.id);

    if (!absence) return res.status(404).send(errorMsg404);

    res.send(absence);
});

// GET absence/:id
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const absence = await Absence.findById(req.params.id);

    if (!absence) return res.status(404).send(errorMsg404);

    res.send(absence);
});


module.exports = router;