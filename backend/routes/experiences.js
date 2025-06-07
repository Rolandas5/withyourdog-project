const express = require('express');
const router = express.Router();
const Experience = require('../models/experiencesModel');

// GET /api/experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
