const express = require('express');
const router = express.Router();
const veterinaryClinicController = require('../controllers/veterinaryClinicController');

// GET /api/veterinary-clinics?cities=Marijampolė
router.get('/', veterinaryClinicController.getVeterinaryClinics);

// POST /api/veterinary-clinics (importuoti duomenis į MongoDB)
router.post('/', veterinaryClinicController.importVeterinaryClinics);

module.exports = router;
