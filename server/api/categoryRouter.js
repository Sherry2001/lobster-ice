/**
 * Router for category actions
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
router.post('/createCategory', (req, res, next) => {
  const newCategory = req.body;
  const response = {};
  try {
    await Category.create(newCategory).exec(); 
    response.success = true;
    response.message = 'Successfully created a new category';
    res.json(response); 
  } catch (error) {
    response.success = false;
    response.message = 'Failed to add new Category document to DB';
    next(err);
    res.json(response);
  } 
});

/**
 * Get all of the user's categories- just names and ids.
 * 
 * req.body: {userId: mongoose.objectId}
 * 
 * response: [{ title: String, _id: Mongoose.objectId}]
 */
router.get('/getCategories', async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const categoriesData = await Category.find({ userId }, 'title').exec();
    const response = categoriesData;
    res.json(response);
  } catch (err) {
    next(err);
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
router.get('/getCategoryItems', async (req, res, next) => {
  try {
    const categoryId = req.body.categoryId;
    const response = {};
    //get category name and a list of item ids
    const categoryData = await Category.findOne({ _id: categoryId }, 'title items').exec();
    response.title = categoryData.title;
    const itemIds = categoryData.items;

    const itemObjects = await Item.find({ _id: {$in : itemIds } }).exec();

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
router.get('/deleteCategory', async (req, res, next) => {
  try {
    const categoryId = req.body.categoryId;
    const response = {};

    await Item.update({ }, { $pull: { categoryIds: this.categoryId } }, {multi: true }, done).exec();
    await Category.deleteOne({ _id: categoryId }).exec();

    this.response.success = true;
    this.response.message = 'deleted category';
    res.json(response);
  } catch (error) {
    this.response.success = false;
    this.response.message = 'Failed to remove Category and update Item documents in DB';
    res.json(response);
    next(error);
  }
});

module.exports = router;
