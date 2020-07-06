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
router.post('/addItem', async (req, res, next) => {
  const newItem = req.body;
  const response = {}; 
  try {
    await Item.create(newItem).exec(); 
    response.success = true;
    response.message = 'Successfully added a new Item to DB';
    res.json(response);
  } catch (error) {
    response.success = false;
    response.message = 'Failed to add new item document to DB';
    res.json(response);
    next(err);
  }
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
router.get('/getItems', async (req, res, next) => {
  try {
    const items = await Item.find( { userId: req.body.userId }).exec();
    res.json(items);
  } catch (error) {
    next(error);
  }
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
  const response = {}; 
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
  const response = {};
  try { 
    const itemId = req.body.itemId; 

    //deleting this itemId from all the categories it belonged to
    await Category.update({ }, { $pull: { items: this.itemId} }, { multi: true }, done).exec();
    
    await Item.deleteOne({ _id: itemId}).exec();

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
