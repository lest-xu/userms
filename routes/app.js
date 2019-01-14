const auth = require('../middleware/auth');
const { App, validateApp } = require('../models/app');
const express = require('express');
const router = express.Router();
const errorMsg404 = 'The app with the given ID was not found.';

// GET app/
router.get('/', auth, async (req, res) => {
    const app = await App.find().sort({ 'createdDate': -1 });
    res.send(app);
});

// GET app/:id
router.get('/:id', auth, async (req, res) => {
    const app = await App.findById(req.params.id);

    if (!app) return res.status(404).send(errorMsg404);

    res.send(app);
});


// POST app/
router.post('/', auth, async (req, res) => {
    const { error } = validateApp(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    let app = await App.findOne({ name: req.body.name });
    if (app) return res.status(400).send('app already existed.');

    app = new App({
        name: req.body.name,
        desc: req.body.desc,
        iconId: req.body.iconId,
        url: req.body.url,
        logoUrl: req.body.logoUrl,
        enabled: req.body.enabled,
        createdBy: req.body.createdBy
    });

    await app.save().then(result => {
        res.send(result);
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });
});

// PUT app/id update an app info
router.put('/:id', auth, async (req, res) => {
    const { error } = validateApp(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const app = await App.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        desc: req.body.desc,
        iconId: req.body.iconId,
        url: req.body.url,
        logoUrl: req.body.logoUrl,
        enabled: req.body.enabled,
        modifiedBy: req.body.modifiedBy
    },
        {
            new: true
        });

    if (!app) return res.status(404).send(errorMsg404);

    res.send(app);
});


// DELETE app/id 
router.delete('/:id', auth, async (req, res) => {
    const app = await App.findByIdAndRemove(req.params.id);

    if (!app) return res.status(404).send(errorMsg404);

    res.send(app);
});

module.exports = router;