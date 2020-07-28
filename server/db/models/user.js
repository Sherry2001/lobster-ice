/**
 * Schema for user
 *
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  sub: { type: String },
});

module.exports = mongoose.model('users', userSchema);
