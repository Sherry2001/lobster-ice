const express = require('express');
const router = express.Router();
const User = require('../db/models/item');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

/**
 * Authenticates a user's ID token and returns their unique id.
 * @param idToken {string} The user's id token to be authenticated. More
 * documentation can be found here:
 * https://developers.google.com/identity/sign-in/web/reference#gapiauth2authresponse
 */
async function verify(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload['sub'];
}

/**
 * Authenticates a user's ID token and assigns them a session connected to their
 * account.
 *
 * If their ID token is valid, a check is done to see if the user already
 * exists. If they do not, they are added to the database. Either
 * way, a valid ID token will result in the user receiving a session.
 *
 * req.body: {id: string}
 *
 * response: status 200 for success
 */
router.post('/signIn', async (req, res, next) => {
  try {
    const idToken = req.body.idToken;
    const sub = await verify(idToken);
    let user = await User.findOne({ sub });
    if (user == null) {
      user = new User({ sub });
      await user.save();
    }
    // TODO: add session for user
    res.status(200).send('Successfully signed in');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
