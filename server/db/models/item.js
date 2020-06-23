/**
 * Schema for item
 * 
 */

var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
  sourceLink: {type: String, required: true},
  highlight: {type: String, required: true},
  userId: {type: mongoose.ObjectId, required: true},
  comment: {type: String},
  placesId: {type: String}, //TODO to be clarfied
  categoryIds: {type: [mongoose.ObjectId]},
});

module.exports = mongoose.model('items', itemSchema);
