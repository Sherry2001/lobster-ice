const Item = require('../db/models/item');
const Category = require('../db/models/category');
const express = require('express');

const router = express.Router();

/**
 * Add an item
 * 
 * req.body: {sourceLink: String,
 *            highlight: String,
 *            userId: mongoose.ObjectId,
 *            placesId: id(optional),
 *            comment: String (optional),}
 * 
 * response: {success: boolean,
 *            message: String}
 */
router.post('/addItem', (req, res) => {
  const newItem = req.body;
  const item = new Item(newItem);
  let response = {}; 
  item.save((err) => {
    if (err) {
      response.success = false;
      response.message = 'error adding item';
      res.json(response);
      next(err);
    } else {
      response.success = true;
      response.message = 'item added';
      res.json(response);
    }
  });
});

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
  Item.find({ userId: req.body.userId }, (err, items) => {
    if (err) {
      next(err);
    }
    if (items) {
      res.json(items);
    }
  });
});

/**
 * Add item to category
 * 
 * req.body: {itemId: mongoose.objectId,
 *            categoryId: mongoose.objectId}
 * 
 * response: {success: boolean,
 *            message: String}
 */
router.put('/addItemToCategory', async (req, res) => {
  const itemId = req.body.itemId;
  const categoryId = req.body.categoryId;
  let response = {}; 
  try {
    await Item.update({ _id: itemId }, { $push: { categoryIds: this.categoryId } }, done).exec();
    await Category.update({ _id: categoryId }, { $push: { items: this.itemId } }, done).exec();
    response.success = true;
    response.message = 'item added to category'; 
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = 'error adding item to category'; 
    res.json(response);
    next(error);
  }

  // For Cynthia's review, changed original code to the above,
  // deleted original code should show on github  -sherry
  // will remove these comments after review
});

/** 
 * Delete item
 * 
 * req.body: {itemId: mongoose.objectId}
 * 
 * response: {success: boolean,
 *            message: String}
 */
router.delete('/deleteItem', async (req, res) => {
  const itemId = req.body.itemId; 
  let response = {};
  try { 
    const itemObject = await Item.findOneAndRemove({ _id: itemId}).exec();
    const itemCategoryIds = itemObject.categoryIds;

    //deleting this itemId from all the categories it belonged to
    await Promise.all(itemCategoryIds.map(async (categoryId) => {
      await Category.update({ _id: categoryId}, { $pull: { items: this.itemId} }, done).exec();
    }))

    response.success = true;
    response.message = 'item deleted'; 
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = 'error deleting item'; 
    res.json(response);
    next(error);
  }
  
  // For Cynthia's review, changed original code to the above, 
  // deleted original code should show on github - sherry 
  // will remove these comments after review
});

module.exports = router;
