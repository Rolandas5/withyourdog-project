const express = require('express');
const router = express.Router();
const { getAllBeaches } = require('../controllers/beachInfoController');

router.get('/', getAllBeaches);

module.exports = router;
