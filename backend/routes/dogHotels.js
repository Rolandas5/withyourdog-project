const express = require('express');
const router = express.Router();
const DogHotel = require('../models/dogHotelModel');

// GET /api/dog-hotels?cities=Marijampolė,Kaunas
router.get('/', async (req, res) => {
  const cities = req.query.cities
    ? req.query.cities.split(',').map((c) => c.trim())
    : [];
  try {
    let query = {};
    if (cities.length > 0) {
      query.city = { $in: cities.map((city) => new RegExp(city, 'i')) };
    }
    const hotels = await DogHotel.find(query);
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'Nepavyko gauti duomenų iš DB' });
  }
});

module.exports = router;
