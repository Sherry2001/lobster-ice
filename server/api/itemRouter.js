const Item = require('../db/models/item');
const Category = require('../db/models/category');
const express = require('express');
const router = express.Router();

/**
 * Add an item
 * 
 * req.body: {sourceLink: String,
 *            highlight: String,
 *            userId: String,
 *            placesId: String=,
 *            comment: String=,}
 * 
 * userId is of type Mongoose.objectId
 * response: status 200 for success
 */
router.post('/addItem', async (req, res, next) => {
  const newItem = req.body;
  try {
    await Item.create(newItem).exec(); 
    res.status(200).send('Successfully added a new Item to DB');
  } catch (error) {
    next(err);
  }
});

/**
 * Get all items
 * 
 * req.params: {userId: String}
 * 
 * userId is of type Mongoose.objectId
 * 
 * response: [Item]
 */
router.get('/getItems/:userId', async (req, res, next) => {
  try {
    const items = await Item.find( { userId: req.params.userId }).exec();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

/**
 * Add item to category
 * 
 * req.body: {itemId: String,
 *            categoryId: String}
 * 
 * itemId and categoryId are of type Mongoose.objectId
 * 
 * response: status 200 for success
 */
router.put('/addItemToCategory', async (req, res, next) => {
  try {
    const itemId = req.body.itemId;
    const categoryId = req.body.categoryId;
    //TODO: VERIFICATION OF USERID, SEE ISSUE #12
    await Item.update({ _id: itemId }, { $push: { categoryIds: this.categoryId } }, done).exec();
    await Category.update({ _id: categoryId }, { $push: { items: this.itemId } }, done).exec();
    res.status(200).send('Item added to category');
  } catch (error) {
    next(error);
  }
});

/** 
 * Delete item
 * 
 * req.body: {itemId: String}
 * 
 * itemId is of type Mongoose.objectId
 * 
 * response: status 200 for success
 */
router.delete('/deleteItem', async (req, res, next) => {
  try { 
    const itemId = req.body.itemId; 

    //deleting this itemId from all the categories it belonged to
    await Category.update({ }, { $pull: { items: this.itemId} }, { multi: true }, done).exec();
    await Item.deleteOne({ _id: itemId}).exec();

    res.status(200).send('Item successfully deleted from DB');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
