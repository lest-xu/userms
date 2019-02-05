const auth = require('../middleware/auth');
const validateObjectId = require("../middleware/validateObjectId");
const { Inventory, validateInventory } = require('../models/inventory');
const express = require('express');
const router = express.Router();
const errorMsg404 = 'The inventory info with the given ID was not found.';

// GET inventories/
router.get('/', auth, async (req, res) => {
    const inventorys = await Inventory.find().sort({ 'createdDate': -1 });
    res.send(inventorys);
});

// POST inventories/
router.post('/', auth, async (req, res) => {
    const { error } = validateInventory(req.body);
    if (error) return res.status(400).send('Joi Error: ' + error.details[0].message);

    const inventory = new Inventory({
        contactId: req.body.contactId,
        name: req.body.name,
        desc: req.body.desc,
        category: req.body.category,
        brand: req.body.brand,
        model: req.body.model,
        itemNumber: req.body.itemNumber,
        location: req.body.location,
        condition: req.body.condition,
        isActive: req.body.isActive,
        purchasedDate: req.body.purchasedDate,
        price: req.body.price,
        quantity: req.body.quantity,
        userEmail: req.body.userEmail,
        startedOn: req.body.startedOn,
        endedOn: req.body.endedOn,
        status: req.body.status,
        createdBy: req.body.createdBy
    });

    await inventory.save().then(result => {
        res.send(result);
    }).catch(error => {
        debugger
        console.log(error);
        res.send(error['errmsg']);
    });
});

// PUT inventories/id update an inventory info
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validateInventory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const inventory = await Inventory.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        desc: req.body.desc,
        category: req.body.category,
        brand: req.body.brand,
        model: req.body.model,
        itemNumber: req.body.itemNumber,
        location: req.body.location,
        condition: req.body.condition,
        isActive: req.body.isActive,
        purchasedDate: req.body.purchasedDate,
        price: req.body.price,
        quantity: req.body.quantity,
        userEmail: req.body.userEmail,
        startedOn: req.body.startedOn,
        endedOn: req.body.endedOn,
        status: req.body.status
    },
        {
            new: true
        });

    if (!inventory) return res.status(404).send(errorMsg404);

    res.send(inventory);
});


// DELETE inventories/id 
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const inventory = await Inventory.findByIdAndRemove(req.params.id);

    if (!inventory) return res.status(404).send(errorMsg404);

    res.send(inventory);
});

// GET inventories/:id
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) return res.status(404).send(errorMsg404);

    res.send(inventory);
});


module.exports = router;