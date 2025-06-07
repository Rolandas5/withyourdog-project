const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// GET /api/grooming-salons?cities=Marijampolė,Kaunas
router.get('/', (req, res) => {
  const cities = req.query.cities
    ? req.query.cities.split(',').map((c) => c.trim())
    : [];
  const filePath = path.join(__dirname, '../database/groomingSalons.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err)
      return res.status(500).json({ error: 'Nepavyko nuskaityti duomenų' });
    let salons = JSON.parse(data);
    if (cities.length > 0) {
      salons = salons.filter((s) => cities.includes(s.city));
    }
    res.json(salons);
  });
});

module.exports = router;
