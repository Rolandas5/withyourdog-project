const PlaceCategory = require('../models/placeCategoryModel');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await PlaceCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Nepavyko gauti kategorijų' });
  }
};
