/**
 * Router for item actions
 */
const Categories = require('../db/models/category');
const express = require('express');
const Items = require('../db/models/item');
const router = express();
router.use(express.json());

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
    const categoriesData = await Categories.find({ userId: userId }, 'title', (error, data)).exec(); 
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
  response = {};
  try {
    //get category name and a list of item ids
    const categoryData =  await Categories.findOne({ _id: categoryId}, 'title items', (error, data)).exec();
    response.title = categoryData.title; 
    const itemIds = categoryData.items;
    const itemObjects = [];
    
    //for each item id, actually get the item object
    await Promise.all(itemIds.map(async (itemId) => {
      const itemObject = await Items.findById(itemId).exec(); 
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
  response = {};

  try {
    const category = await Categories.find({ _id: categoryId }).exec();
    const categoryItemIds = category.items;

    await Promise.all(categoryItemIds.map(async (itemId) => {
      await Items.update({ _id: itemId }, { $pull: { categoryIds: this.categoryId } }, done).exec();
    }));

    await Categories.deleteOne({ _id: categoryId }).exec();

    this.response.success = true;
    this.response.message = "deleted category";
    res.json(response);
  } catch (error) {
    this.response.success = false;
    this.response.message = "error when deleting";
    res.json(response);
    next(error);
  }
});

module.exports = router;
