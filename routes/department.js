const auth = require('../middleware/auth');
const validateObjectId = require("../middleware/validateObjectId");
const { Department, validateDepartment } = require('../models/department');
const express = require('express');
const router = express.Router();
const errorMsg404 = 'The department info with the given ID was not found.';

// GET departments/
router.get('/', auth, async (req, res) => {
    const departments = await Department.find().sort({ 'createdDate': -1 });
    res.send(departments);
});


// POST departments/
router.post('/', auth, async (req, res) => {
    const { error } = validateDepartment(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    let department = await Department.findOne({ name: req.body.name });
    if (department) return res.status(400).send('department already existed.');

    department = new Department({
        name: req.body.name,
        desc: req.body.desc,
        manager: req.body.manager,
        createdBy: req.body.createdBy
    });

    await department.save().then(result => {
        res.send(result);
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });
});

// PUT departments/id update an department info
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validateDepartment(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const now = new Date();
    const department = await Department.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        desc: req.body.desc,
        manager: req.body.manager,
        modifiedBy: req.body.modifiedBy,
        modifiedDate: now
    },
        {
            new: true
        });

    if (!department) return res.status(404).send(errorMsg404);

    res.send(department);
});


// DELETE departments/id 
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const department = await Department.findByIdAndRemove(req.params.id);

    if (!department) return res.status(404).send(errorMsg404);

    res.send(department);
});

// GET departments/:id
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const department = await Department.findById(req.params.id);

    if (!department) return res.status(404).send(errorMsg404);

    res.send(department);
});


module.exports = router;