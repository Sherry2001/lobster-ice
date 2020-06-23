/**
 * Router for item actions
 */
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Categories = require('../db/models/category')
const Items = require('../db/models/item')
const router = express()

/**
 * Get all of the user's categories- just names and ids.
 * 
 * req.body: {userId: mongoose.objectId}
 * 
 * response: [{title: String, categoryId: mongoose.objectId}]
 */
router.get('/getCategories', (req, res) => {
  const userId = req.body.userId;
  response = {}
  Categories.find({}, 'title', (err, data) => {
    if (err) {
      next(err); 
    } 
    if (data) {
      response = data; 
      res.json(response); 
    }
  });
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
router.get('/getCategoryItems', (req, res) => {
  const categoryId = req.body.categoryId;
  response = {}
  Categories.findOne({_id: categoryId}, 'title items', (err, data) => {
    if (err) {
      throw err;
    } 
    if (data) {
      return data
    }
  }).catch((err) => {
    next(err);
  }).then((data) => {
    this.response.title = data.title;
    itemObjects = [];
    itemIds = data.items;
    itemIds.forEach(async (itemId) => {
      const itemObject = await getItemInfo(itemId);
      itemObjects.push(itemObject); 
    }) 
    this.response.items = itemObjects;
    res.json(this.response);
  })
});

/**
 * Helper function to return an item object given item id 
 * @param  itemId 
 */
async function getItemInfo(itemId) {
  Items.findById(itemId, (err, data) => {
    if (err) {
      throw new Error('error getting itemInfo: ', err);
    } 
    if(data){
      return data;
    }
  })
}

/**
 * Delete a category and its id from all items in the category
 * 
 * req.body : {categoryId: mongoose.objectId}
 * 
 * response: {
 *            success: true/false.
 *            message: "deleted category" or "error when deleting"
 *           }
 *  or error
 */
router.get('/deleteCategory', (req, res) => {
  const categoryId = req.body.categoryId;
  response = {};
  Categories.find({_id: categoryId}, (err, data) =>{
    if (err) {
      throw err;
    }
    if (data) {
      return data.items;
    }
  })
  .then(async (categoryItems) => {
    categoryItems.forEach((itemId) => {
      await Items.update({_id: itemId}, { $pull: {categoryIds: this.categoryId}}, done);
    })
  })
  .then(() => {
    Categories.deleteOne({_id: categoryId}, (err, data) => {
      if(err) {
        throw err;
      }
    })
    this.response.success = true;
    this.response.message = "deleted category";
  })
  .catch((err) => {
    this.response.success = false;
    this.response.message = "error when deleting";
    next(err);
  })
  .then(() => {
    res.json(response);
  })
})

module.exports = router;
