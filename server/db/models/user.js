/**
 * Schema for user
 * 
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  googleId: { type: String, required: true},
});

module.exports = mongoose.model('users', userSchema);
