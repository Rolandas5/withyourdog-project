const BeachInfo = require('../models/beachInfoModel');

exports.getAllBeaches = async (req, res) => {
  try {
    const beaches = await BeachInfo.find();
    res.json(beaches);
  } catch (err) {
    res.status(500).json({ error: 'Nepavyko gauti paplūdimių informacijos' });
  }
};
