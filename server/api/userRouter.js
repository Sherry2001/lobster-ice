const User = require('../db/models/user');
const express = require('express');
const router = express.Router();

/**
 * Gets the mongoId of a user based on their google account id.
 * If the user doesn't exist in mongo user db, create a new user in mongo.
 * 
 * req.body: {googleId: String}
 * 
 * response: String (Mongoose.objectId)
 */
router.get('/getUserId/:googleId', async (req, res, next) => {
  const googleId = req.params.googleId;
  const userDocument = await User.findOne({ googleId: googleId }).exec(); 
  if (userDocument) {
    res.json(userDocument._id);
  } else {
    const newUser = new User(req.body);
    newUser.save();
    res.json(newUser._id);
  } 
});

module.exports = router;
