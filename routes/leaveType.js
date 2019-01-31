const auth = require('../middleware/auth');
const validateObjectId = require("../middleware/validateObjectId");
const { LeaveType, validateLeaveType } = require('../models/leaveType');
const express = require('express');
const router = express.Router();
const errorMsg404 = 'The leave type info with the given ID was not found.';

// GET leaveType/
router.get('/', auth, async (req, res) => {
    const leaveTypes = await LeaveType.find().sort({ 'createdDate': -1 });
    res.send(leaveTypes);
});

// POST leaveType/
router.post('/', auth, async (req, res) => {
    const { error } = validateLeaveType(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    let leaveType = await LeaveType.findOne({ name: req.body.name });
    if (leaveType) return res.status(400).send('leave type info already existed.');

    leaveType = new leaveType({
        name: req.body.name,
        desc: req.body.desc,
        isUseAllowance: req.body.isUseAllowance,
        createdBy: req.body.createdBy
    });

    await leaveType.save().then(result => {
        res.send(result);
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });
});

// PUT leaveType/id update an leaveType info
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validateLeaveType(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const now = new Date();
    const leaveType = await LeaveType.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        desc: req.body.desc,
        isUseAllowance: req.body.isUseAllowance,
        modifiedBy: req.body.modifiedBy,
        modifiedDate: now
    },
        {
            new: true
        });

    if (!leaveType) return res.status(404).send(errorMsg404);

    res.send(leaveType);
});


// DELETE leaveType/id 
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const leaveType = await LeaveType.findByIdAndRemove(req.params.id);

    if (!leaveType) return res.status(404).send(errorMsg404);

    res.send(leaveType);
});

// GET leaveType/:id
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const leaveType = await LeaveType.findById(req.params.id);

    if (!leaveType) return res.status(404).send(errorMsg404);

    res.send(leaveType);
});


module.exports = router;