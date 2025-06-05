const express = require('express');
const router = express.Router();
const { getAllCafes, addCafe } = require('../controllers/cafesController');

router.get('/', getAllCafes);
router.post('/', addCafe);

module.exports = router;
