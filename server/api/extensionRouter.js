const express = require('express');
const router = express();
const fetch = require("node-fetch");

/**
 * Response with a list of Places Search result objects.
 * 
 * req.params: {text: String}
 * 
 * response: JSON object 
 */
router.get('/placesSearch/:text', async (req, res, next) => {
  try {
    const response = await fetch(
      'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' +
      req.params.text + '&inputtype=textquery&fields=place_id,icon,photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyBfQXZ3F-buzSRz5RvVB0iIvQN_K2UxRVk', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const searchResults = await response.json();
    console.log('parsed', searchResults);
    res.json(searchResults.candidates);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
