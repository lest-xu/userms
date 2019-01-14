const auth = require('../middleware/auth');
const { Role, validateRole } = require('../models/role');
const { App } = require('../models/app');
const express = require('express');
const router = express.Router();
const errorMsg404 = 'The role info with the given ID was not found.';

// GET role/
router.get('/', auth, async (req, res) => {
    const role = await Role.find().sort({ 'createdDate': -1 });
    res.send(role);
});

// GET role/:id
router.get('/:id', auth, async (req, res) => {
    const role = await Role.findById(req.params.id);

    if (!role) return res.status(404).send(errorMsg404);

    res.send(role);
});


// POST role/
router.post('/', auth, async (req, res) => {
    const { error } = validateRole(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    let role = await Role.findOne({ name: req.body.name });
    if (role) return res.status(400).send('role already existed.');

    const apps = [];
    req.body.appIds.forEach(appId => {
        const app = await App.findById(appId);
        if (!app) return res.status(400).send("Invalid app.");
        apps.push(app);
    });

    role = new Role({
        name: req.body.name,
        desc: req.body.desc,
        apps: apps,
        createdBy: req.body.createdBy
    });

    await role.save().then(result => {
        res.send(result);
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });
});

// PUT role/id update an role info
router.put('/:id', auth, async (req, res) => {
    const { error } = validateRole(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const apps = [];
    req.body.appIds.forEach(appId => {
        const app = await App.findById(appId);
        if (!app) return res.status(400).send("Invalid app.");
        apps.push(app);
    });

    const role = await Role.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        desc: req.body.desc,
        apps: apps,
        modifiedBy: req.body.modifiedBy
    },
        {
            new: true
        });

    if (!role) return res.status(404).send(errorMsg404);

    res.send(role);
});


// DELETE role/id 
router.delete('/:id', auth, async (req, res) => {
    const role = await Role.findByIdAndRemove(req.params.id);

    if (!role) return res.status(404).send(errorMsg404);

    res.send(role);
});

module.exports = router;