const express = require('express');
const multer = require('multer');
const path = require('path');
const dogProfileModel = require('../models/dogProfileModel');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Įkėlimas
router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// PATCH profiliui
router.patch('/:id', async (req, res) => {
  try {
    const dog = await dogProfileModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!dog) return res.status(404).json({ error: 'Profilis nerastas' });
    res.json(dog);
  } catch (err) {
    res.status(500).json({ error: 'Serverio klaida' });
  }
});

// Sukurti naują šuns profilį
router.post('/', async (req, res) => {
  try {
    const dog = await dogProfileModel.create(req.body);
    res.status(201).json(dog);
  } catch (err) {
    res.status(500).json({ error: 'Nepavyko sukurti profilio' });
  }
});

// Gauti VISUS šuns profilius pagal userId
router.get('/user/:userId', async (req, res) => {
  try {
    const dogs = await dogProfileModel.find({ userId: req.params.userId });
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: 'Serverio klaida' });
  }
});

// Ištrinti šuns profilį pagal ID
router.delete('/:id', async (req, res) => {
  try {
    const dog = await dogProfileModel.findByIdAndDelete(req.params.id);
    if (!dog) return res.status(404).json({ error: 'Profilis nerastas' });
    res.json({ message: 'Profilis ištrintas' });
  } catch (err) {
    res.status(500).json({ error: 'Serverio klaida' });
  }
});

module.exports = router;
