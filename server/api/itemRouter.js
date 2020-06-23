const Item = require('../db/models/item')
const User = require('../db/models/user')
const Category = require('../db/models/category')
const express = require('express')
const mongoose = require('mongoose');

const router = express.Router()

router.post('/addItem', (req, res) => {
    const body = req.body;

    if(!body) {
        next(err);
    }

    const item = new Item(body);

    if(!item) {
        next(err);
    }

    item.save().then(() => {
        res.status(201).json({
            success: true,
            message: 'Item added'
        })
    });
})

router.get('/getItems', async (req, res) => {
    await User.find({_id:req.body.userId }, (err, item) => {
        if (err) {
            next(err);
        }
        return res.json(item);
    }).catch(err => next(err));
})

router.put('/addItemToCategory', (req, res) => {
    const body = req.body;
    
    if(!body) {
        next(err);
    }
    
    Item.findOne({_id:body.itemId}, (err, item) => {
        if (err) {
            throw err;
        }
        item.categoryIds.push(body.categoryId);
        item.save(done);
    })
    .then(() => Category.findOne({_id: body.categoryId}, (err, category) => {
        if (err) {
            throw err;
        }
        category.items.push(body.itemId);
        category.save(done);
    }))
    .then(() => res.status(200).json({success: true, message: "item added to category"}))
    .catch((err) => next(err));
})

module.exports = router;
