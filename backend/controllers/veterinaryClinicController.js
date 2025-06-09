const VeterinaryClinic = require('../models/veterinaryClinicModel');
const fs = require('fs');
const path = require('path');

// Gauti klinikas pagal miestus (arba visus)
exports.getVeterinaryClinics = async (req, res) => {
  const cities = req.query.cities
    ? req.query.cities.split(',').map((c) => c.trim())
    : [];
  try {
    let clinics = [];
    if (VeterinaryClinic && VeterinaryClinic.find) {
      const query = cities.length > 0 ? { city: { $in: cities } } : {};
      clinics = await VeterinaryClinic.find(query);
      if (clinics.length > 0) return res.json(clinics);
    }
    // Fallback į JSON failą
    const filePath = path.join(__dirname, '../database/veterinaryClinics.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err)
        return res.status(500).json({ error: 'Nepavyko nuskaityti duomenų' });
      let clinics = JSON.parse(data);
      if (cities.length > 0) {
        clinics = clinics.filter((s) => cities.includes(s.city));
      }
      res.json(clinics);
    });
  } catch (e) {
    res.status(500).json({ error: 'Serverio klaida' });
  }
};

// Importuoti kelias klinikas į MongoDB
exports.importVeterinaryClinics = async (req, res) => {
  try {
    const clinics = req.body;
    if (!Array.isArray(clinics))
      return res.status(400).json({ error: 'Tikimasi masyvo' });
    const inserted = await VeterinaryClinic.insertMany(clinics);
    res.status(201).json(inserted);
  } catch (e) {
    res.status(500).json({ error: 'Nepavyko importuoti duomenų' });
  }
};
