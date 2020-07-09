/**
 * Schema for user
 * 
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String },
});

module.exports = mongoose.model('users', userSchema);
