const User = require('../db/models/user');
const express = require('express');
const router = express.Router();

/**
 * Responsds with the mongoId of a user based on their google account id.
 * If the user doesn't exist in mongo user db, new user created in mongo.
 * 
 * req.body: {googleId: String}
 * 
 * response: String (Mongoose.objectId)
 */
router.get('/getUserId/:googleId', async (req, res, next) => {
  const googleId = req.params.googleId;
  try {
    const mongoId = await getMongoUserId(googleId);
    res.json(mongoId);
  } catch (error) {
    next(error);
  }
});

/**
 * Helper function shared by Chrome and React
 * Returns a user's mongo ._id from their google account id. 
 * If user doesn't exist in mongo User db, create new user and return id.
 * @param {String} googleId 
 */
async function getMongoUserId(googleId) {
  try {
    const userDocument = await User.findOne({ googleId: googleId }).exec(); 
    if (userDocument) {
      return userDocument._id;
    } else {
      const newUser = new User({ googleId: googleId});
      newUser.save();
      return newUser._id;
    }
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = router;
