const Cafe = require('../models/cafeModel');

exports.getAllCafes = async (req, res) => {
  try {
    const cafes = await Cafe.find();
    res.json(cafes);
  } catch (err) {
    res.status(500).json({ error: 'Nepavyko gauti kavinių duomenų' });
  }
};

exports.addCafe = async (req, res) => {
  try {
    const newCafe = new Cafe(req.body);
    await newCafe.save();
    res.status(201).json(newCafe);
  } catch (err) {
    res.status(400).json({ error: 'Nepavyko pridėti kavinės' });
  }
};
