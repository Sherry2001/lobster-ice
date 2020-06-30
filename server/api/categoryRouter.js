/**
 * Router for item actions
 */
const Categories = require('../db/models/category');
const express = require('express');
const mongoose = require('mongoose');

const router = express();
router.use(express.json());
/**
 * Get all of the user's categories- just names and ids.
 * 
 * req.body: {userId: mongoose.objectId}
 * 
 * response: [{title: String, categoryId: mongoose.objectId}]
 */
router.get('/getCategories', async (req, res) => {
  const userId = req.body.userId;
  response = {};
  await Categories.find({ userId: userId }, (err, data) => {
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
