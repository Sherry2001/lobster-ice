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
router.post('/addItem', (req, res, next) => {
  const newItem = req.body;
  const item = new Item(newItem);
  let response = {}; 
  item.save((err) => {
    if (err) {
      response.success = false;
      response.message = 'Failed to add new item document to DB';
      res.json(response);
      next(err);
    } else {
      response.success = true;
      response.message = 'Successfully added a new Item to DB';
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
router.get('/getItems', (req, res, next) => {
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
router.put('/addItemToCategory', async (req, res, next) => {
  let response = {}; 
  try {
    const itemId = req.body.itemId;
    const categoryId = req.body.categoryId;
    //TODO: VERIFICATION OF USERID, SEE ISSUE #12
    await Item.update({ _id: itemId }, { $push: { categoryIds: this.categoryId } }, done).exec();
    await Category.update({ _id: categoryId }, { $push: { items: this.itemId } }, done).exec();
    response.success = true;
    response.message = 'Item added to category'; 
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = 'Failed to update Item and Category document in DB'; 
    res.json(response);
    next(error);
  }
});

/** 
 * Delete item
 * 
 * req.body: {itemId: mongoose.objectId}
 * 
 * response: {success: boolean,
 *            message: String}
 */
router.delete('/deleteItem', async (req, res, next) => {
  let response = {};
  try { 
    const itemId = req.body.itemId; 
    await Item.deleteOne({ _id: itemId}).exec();

    //deleting this itemId from all the categories it belonged to
    await Category.update({ }, { $pull: { items: this.itemId} }, { multi: true }, done).exec();
  
    response.success = true;
    response.message = 'Item successfully deleted from DB'; 
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = 'Failed to delete Item and update Category documents in DB'; 
    res.json(response);
    next(error);
  }
});

module.exports = router;
