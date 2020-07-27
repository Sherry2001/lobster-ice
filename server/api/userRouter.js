const Item = require('../db/models/item');
const Category = require('../db/models/category');
const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(CLIENT_ID);
async function verify() {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
verify().catch(console.error);

/**
 * Authenticates a user's ID token. If it is valid, a check is done to see if the
 * user already exists. If they do not, they are added to the database. Either
 * way, a valid ID token will result in the user receiving a session.
 *
 * req.body: {id: string}
 *
 * response: status 200 for success
 */
router.post('/signIn', async (req, res, next) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(200).send('Successfully added a new Item to DB');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
