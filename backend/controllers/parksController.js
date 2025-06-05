const { Park } = require('../models/parksModel');

exports.getAllParks = async (req, res) => {
  try {
    const parks = await Park.find();
    res.json(parks);
  } catch (err) {
    res.status(500).json({ error: 'Nepavyko gauti parkų duomenų' });
  }
};
