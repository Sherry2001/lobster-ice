/**
 * Router for item actions
 */
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Categories = require('../../db/models/category')

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

module.exports = router;
