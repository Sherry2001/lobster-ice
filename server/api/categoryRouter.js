/**
 * Router for item actions
 */
const Category = require('../db/models/category');
const express = require('express');
const Item = require('../db/models/item');
const router = express();

/**
 * Create a new category
 * 
 * req.body: {title: String}
 * 
 * response: {success: boolean, message: String}
 */
router.post('/createCategory', (req, res) => {
  const newCategory = req.body; 
  let response = {};
  Category.create(newCategory, (err, data) => {
    if (err) {
      response.successs = false; 
      response.message = 'failed to add category';
      next (err);
    } else {
      response.success = true;
      response.message = 'created new category'; 
    } 
    res.json(response);
  })
});

/**
 * Get all of the user's categories- just names and ids.
 * 
 * req.body: {userId: mongoose.objectId}
 * 
 * response: [{ title: String, _id: Mongoose.objectId}]
 */
router.get('/getCategories', async (req, res) => {
  const userId = req.body.userId;
  try {
    const categoriesData = await Category.find({ userId: userId }, 'title', (error, data)).exec(); 
    const response = categoriesData;
    res.json(response);
  } catch (error) {
    next(error); 
  }
});

/**
 * Get all the items belonging in a specified category
 * 
 * req.body: {categoryId: mongoose.objectId}
 * 
 * response: [{title: String, 
 *             items: [{
 *               item objects from db 
 *             }]
 *            }]
 */
router.get('/getCategoryItems', async (req, res) => {
  const categoryId = req.body.categoryId;
  let response = {};
  try {
    //get category name and a list of item ids
    const categoryData =  await Category.findOne({ _id: categoryId}, 'title items', (error, data)).exec();
    response.title = categoryData.title; 
    const itemIds = categoryData.items;
    const itemObjects = [];
    
    //for each item id, actually get the item object
    await Promise.all(itemIds.map(async (itemId) => {
      const itemObject = await Item.findById(itemId).exec(); 
      itemObjects.push(itemObject); 
    }))
    response.items = itemObjects; 
    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * Delete a category and its id from all items in the category
 * 
 * req.body : {categoryId: mongoose.objectId}
 * 
 * response: {
 *            success: boolean,
 *            message: String,
 *           }
 * error 
 */
router.get('/deleteCategory', async (req, res) => {
  const categoryId = req.body.categoryId;
  let response = {};

  try {
    const category = await Category.find({ _id: categoryId }).exec();
    const categoryItemIds = category.items;

    await Promise.all(categoryItemIds.map(async (itemId) => {
      await Item.update({ _id: itemId }, { $pull: { categoryIds: this.categoryId } }, done).exec();
    }));

    await Category.deleteOne({ _id: categoryId }).exec();

    this.response.success = true;
    this.response.message = 'deleted category';
    res.json(response);
  } catch (error) {
    this.response.success = false;
    this.response.message = 'error when deleting';
    res.json(response);
    next(error);
  }
});

module.exports = router;
