const GroomingSalon = require('../models/groomingSalonModel');
const fs = require('fs');
const path = require('path');

// Gauti kirpyklas pagal miestus (arba visus)
exports.getGroomingSalons = async (req, res) => {
  const cities = req.query.cities
    ? req.query.cities.split(',').map((c) => c.trim())
    : [];
  try {
    let salons = [];
    if (GroomingSalon && GroomingSalon.find) {
      const query = cities.length > 0 ? { city: { $in: cities } } : {};
      salons = await GroomingSalon.find(query);
      if (salons.length > 0) return res.json(salons);
    }
    // Fallback į JSON failą
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
  } catch (e) {
    res.status(500).json({ error: 'Serverio klaida' });
  }
};

// Importuoti kelias kirpyklas į MongoDB
exports.importGroomingSalons = async (req, res) => {
  try {
    const salons = req.body;
    if (!Array.isArray(salons))
      return res.status(400).json({ error: 'Tikimasi masyvo' });
    const inserted = await GroomingSalon.insertMany(salons);
    res.status(201).json(inserted);
  } catch (e) {
    res.status(500).json({ error: 'Nepavyko importuoti duomenų' });
  }
};
