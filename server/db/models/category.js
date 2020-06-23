/**
 * Schema for category
 * 
 */

var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
  title: {type: String, required: true},
  userId: {type: mongoose.ObjectId, required: true},
  items: {type: [mongoose.ObjectId]},
});

module.exports = mongoose.model('categories', categorySchema);
