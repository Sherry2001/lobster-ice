const Item = require('../db/models/item')
const User = require('../db/models/user')
const Category = require('../db/models/category')
const express = require('express')
const mongoose = require('mongoose');

const router = express.Router()

/**
 * Add an item
 * 
 * req.body: {sourceLink: String,
 *            highlight: String,
 *            placeId: id(optional),
 *            comments: String (optional),}
 * 
 * response: success/ failure
 */
router.post('/addItem', (req, res) => {
  const body = req.body;

  const item = new Item(body);

  item.save().then(() => {
    res.status(201).json({
      success: true,
      message: 'Item added'
    })
  })
    .catch(err => next(err));
})

/**
 * Get all items
 * 
 * req.body: {userId: mongoose.objectId}
 * 
 * response: [{sourceLink: String,
 *            highlight: String,
 *            placeId: id(optional),
 *            comments: String (optional),}]
 */
router.get('/getItems', (req, res) => {
  Item.find({userId:req.body.userId}, (err, item) => {
    if (err) {
      next(err);
    }
    return res.json(item);
  }).catch(err => res.json({success: false, message: 'Error getting items'}));
})

/**
 * Add item to category
 * 
 * req.body: {itemId: mongoose.objectId,
 *            categoryId: mongoose.objectId}
 * 
 * response: success/ error
 */
router.put('/addItemToCategory', (req, res) => {
  const body = req.body;

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
  .then(() => res.status(200).json({success: true, message: 'item added to category'}))
  .catch((err) => res.json({success: false, message: 'Error adding item to category'}))
})

/** 
 * Delete item
 * 
 * req.body: {itemId: mongoose.objectId}
 * 
 * response: success/ failure
 */
router.delete('/deleteItem', (req, res) => {
  Item.findOneAndDelete({_id: req.body.itemId}, (err, item) => {
    if(err) {
      next(err);
    }

    const loopCategories = async (() => {
      for (let i = 0; i < item.categoryIds.length; i++) {
        Category.findOne({_id: item.categoryIds[i]}, (err, category) => {
          if(err) {
            throw(err);
          }
          category.items.pull(req.body.itemId);
        })
      }     
    })
      .then(() => res.status(200).json({success: true, message: 'item deleted'}))
      .catch((err) => res.json({success: falase, message: 'error deleting item'}));
  })
})

module.exports = router;
