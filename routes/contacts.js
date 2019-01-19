const auth = require('../middleware/auth');
const validateObjectId = require("../middleware/validateObjectId");
const { Contact, validateContact } = require('../models/contact');
const express = require('express');
var _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
const errorMsg404 = 'The user with the given ID was not found.';
// const { LogMessage } = require('../middleware/error');

// GET users
router.get('/', auth, async (req, res) => {
    
    const users = await Contact.find().sort({ 'createdDate': -1 });
    res.send(users);
});


// get current user
// GET users/me
router.get('/me', auth, async (req, res) => {
    const user = await Contact.findById(req.user._id).select('-password');

    res.send(user);
});

// POST user
router.post('/', auth, async (req, res) => {
    const { error } = validateContact(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);
    
    let contact = await Contact.findOne({ email: req.body.email });
    if (contact) return res.status(400).send('email already registered.');

    contact = new Contact({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        nickName: req.body.nickName,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        profileImgUrl: req.body.profileImgUrl,
        isEnabled: req.body.isEnabled,
        phone: req.body.phone,
        phoneExtension: req.body.phoneExtension,
        mobile: req.body.mobile,
        fax: req.body.fax,
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email,
        emailConfirmed: req.body.emailConfirmed,
        twoFactor: req.body.twoFactor,
        loginCount: req.body.loginCount,
        failedCount: req.body.failedCount,
        isAdvanced: req.body.isAdvanced,
        createdBy: req.body.createdBy,
        modifiedBy: req.body.modifiedBy,
        homeAddress: req.body.homeAddress,
        mailingAddress: req.body.mailingAddress,
        hr: req.body.hr,
        department: req.body.department,
        role: req.body.role
    });

    // hash user password
    const salt = await bcrypt.genSalt(10);
    contact.password = await bcrypt.hash(contact.password, salt);

    await contact.save().then(result => {
        const token = contact.generateAuthToken();
        res.header('x-auth-token',token).send(_.pick(result, ['firstName', 'lastName', 'email', 'password']));
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });

});

// PUT update a user
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validateContact(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const contact = await Contact.findByIdAndUpdate(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        nickName: req.body.nickName,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        profileImgUrl: req.body.profileImgUrl,
        isEnabled: req.body.isEnabled,
        phone: req.body.phone,
        phoneExtension: req.body.phoneExtension,
        mobile: req.body.mobile,
        fax: req.body.fax,
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email,
        emailConfirmed: req.body.emailConfirmed,
        twoFactor: req.body.twoFactor,
        loginCount: req.body.loginCount,
        failedCount: req.body.failedCount,
        isAdvanced: req.body.isAdvanced,
        createdBy: req.body.createdBy,
        modifiedBy: req.body.modifiedBy,
        homeAddress: req.body.homeAddress,
        mailingAddress: req.body.mailingAddress,
        hr: req.body.hr,
        department: req.body.department,
        role: req.body.role
    },
        {
            new: true
        });

    if (!contact) return res.status(404).send(errorMsg404);

    res.send(contact);
});

router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const contact = await Contact.findByIdAndRemove(req.params.id);

    if (!contact) return res.status(404).send(errorMsg404);

    res.send(contact);
});

// GET users/:id
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const user = await Contact.findById(req.params.id);

    if (!user) return res.status(404).send(errorMsg404);

    res.send(user);
});

module.exports = router;