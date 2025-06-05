const express = require('express');
const router = express.Router();
const { getAllParks } = require('../controllers/parksController');

router.get('/parks', getAllParks);

module.exports = router;
