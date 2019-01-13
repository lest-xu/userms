// const jwt = require('jsonwebtoken');
// const config = require('../config/default.json');
const Joi = require('joi');
const { Contact } = require('../models/contact');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const errorMsg404 = 'Invalid email or password.';

// user authentication
router.post('/', async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    let user = await Contact.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(errorMsg404);

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) return res.status(400).send(errorMsg404);

    const token = user.generateAuthToken();

    res.send(token);
});


function validateAuth(req) {
    const schema = {
        email: Joi.string().email({ minDomainAtoms: 2 }).max(256).required(),
        password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])[a-zA-Z0-9]{6,20}$/).required()
    }

    return Joi.validate(req, schema);
}

module.exports = router;