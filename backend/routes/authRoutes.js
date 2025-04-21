const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Naujo naudotojo rgistracija
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', authController.getCurrentUser); // gauname prisijungusio vartotojo duomenis

module.exports = router;
