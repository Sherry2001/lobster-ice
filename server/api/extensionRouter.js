const express = require('express');
const router = express();
const fetch = require("node-fetch");

/**
 * Response with a list of Places Search result objects.
 * 
 * req.params: {text: String}
 * 
 * response: JSON Object, example: 
 * [{
      formatted_address: '93-01 Astoria Blvd, Queens, NY 11369, United States',
      geometry: [Object],
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png',
      name: 'Buccaneer Diner',
      opening_hours: [Object],
      photos: [Array],
      place_id: 'ChIJIdl5QpdfwokRB2Ajbz5eRJw',
      rating: 4.2
    }]
 */
router.get('/placesSearch/:text', async (req, res, next) => {
  try {
    const response = await fetch(
      'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' +
      req.params.text + '&inputtype=textquery&fields=place_id,icon,photos,formatted_address,name,rating,opening_hours,geometry' +
      '&key=' + process.env.APIKEY, {
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
