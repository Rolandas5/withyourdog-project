const express = require('express');
const router = express.Router();
const groomingSalonController = require('../controllers/groomingSalonController');

// GET /api/grooming-salons?cities=Marijampolė,Kaunas
router.get('/', groomingSalonController.getGroomingSalons);

// POST /api/grooming-salons (importuoti duomenis į MongoDB)
router.post('/', groomingSalonController.importGroomingSalons);

module.exports = router;
