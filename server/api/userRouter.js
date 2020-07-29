const User = require('../db/models/user');
const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

/**
 * Responds with the mongoId of a user based on their google account id.
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
 * Authenticates a user's ID token and returns their mongo ._id.
 *
 * req.body: {id: string}
 *
 * response: status 200 for success
 */
router.post('/authenticate', async (req, res, next) => {
  try {
    const idToken = req.body.id;
    const googleId = await verify(idToken);
    const userId = getMongoUserId(googleId);
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
      const newUser = new User({ googleId: googleId });
      newUser.save();
      return newUser._id;
    }
  } catch (error) {
    throw new Error(error);
  }
}

// Verifies a Google Sign-In ID token using Google's node package
async function verify(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const googleId = payload['sub'];
  return googleId;
}

module.exports = router;
