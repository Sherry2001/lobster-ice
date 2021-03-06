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
 * response: status 200 for success
 */
router.post('/createCategory', async (req, res, next) => {
  try {
    const newCategory = new Category(req.body); 
    await newCategory.save();
    res.status(200).send('Successfully created a new category');
  } catch (error) {
    next(error);
  }
});

/**
 * Get all of the user's categories- just names and ids.
 * 
 * req.params: {userId: String}
 * 
 * response: [{ title: String, _id: String}]
 * 
 * userId and _id of a category are Mongoose.objectIds
 */
router.get('/getCategories/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const categoriesData = await Category.find({ userId }, 'title').exec();
    const response = categoriesData;
    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * Get all the items belonging in a specified category
 * 
 * req.params: {categoryId: String}
 * 
 * categoryId is a Mongoose.objectId
 * 
 * response: [{title: String, 
 *             items: [Item],
 *            }]
 */
router.get('/getCategoryItems/:categoryId', async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const response = {};

    //get category name and a list of item ids
    const categoryData = await Category.findById(categoryId, 'title items').exec();
    
    if (!categoryData) {
      throw new Error('CategoryId does not exist in database');
    }
    response.title = categoryData.title;
    const itemIds = categoryData.items;

    const itemObjects = await Item.find({ _id: { $in: itemIds } }).exec();

    response.items = itemObjects;
    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * Delete a category and its id from all items in the category
 * 
 * req.body : {categoryId: String}
 * 
 * categoryId is a Mongoose.objectId
 * 
 * response: status 200 for success 
 */
router.delete('/deleteCategory', async (req, res, next) => {
  try {
    const categoryId = req.body.categoryId;

    const deletedCategory = await Category.findByIdAndRemove(categoryId).exec();
    if (!deletedCategory) {
      throw new Error('CategoryId does not exist in database');
    }
    await Item.updateMany({}, { $pull: { categoryIds: categoryId } }).exec();
    res.status(200).send('deleted category');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
