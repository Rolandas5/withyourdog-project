const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../controllers/placeCategoryController');

router.get('/', getAllCategories);

module.exports = router;
