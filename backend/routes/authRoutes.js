const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:place', async (req, res) => {
  const { place } = req.params;
  try {
    const response = await axios.get(
      `https://api.meteo.lt/v1/places/${place}/forecasts/long-term`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Nepavyko gauti orų duomenų' });
  }
});

module.exports = router;
