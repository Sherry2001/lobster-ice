/**
 * Schema for category
 * 
 */

const mongoose = require('mongoose');

let categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: mongoose.ObjectId, required: true },
  items: { type: [mongoose.ObjectId] },
});

module.exports = mongoose.model('categories', categorySchema);
