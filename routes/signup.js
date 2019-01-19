var _ = require('lodash');
const Joi = require('joi');
const { Contact } = require('../models/contact');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const errorMsg404 = 'email already registered.';

// user registration / signup
// generate authentication token
router.post('/', async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    let user = await Contact.findOne({ email: req.body.email });
    if (user) return res.status(400).send(errorMsg404);
    var now = new Date();
    const defaultImageUrl = 'https://pngimage.net/wp-content/uploads/2018/05/default-user-image-png-4.png';
    user = new Contact({
        firstName: 'NULL',
        lastName: 'NULL',
        gender: 'M',
        birthDate: now,
        profileImgUrl: defaultImageUrl,
        isEnabled: true,
        userName: req.body.email,
        password: req.body.password,
        email: req.body.email,
        emailConfirmed: false,
        twoFactor: false,
        loginCount: 0,
        failedCount: 0,
        isAdvanced: false,
        createdBy: req.body.email
    });

    // hash user password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save().then(result => {
        const token = user.generateAuthToken();
        res.header('x-auth-token',token).send(_.pick(result, ['email', 'password']));
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });

});


function validateAuth(req) {
    const schema = {
        email: Joi.string().email({ minDomainAtoms: 2 }).max(256).required(),
        password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])[a-zA-Z0-9]{6,20}$/).required()
    }

    return Joi.validate(req, schema);
}

module.exports = router;