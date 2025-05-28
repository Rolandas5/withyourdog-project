// routes/authRoutes.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// --- Registracija ---
router.post('/register', authController.register);

// --- Prisijungimas ---
router.post('/login', authController.login);

// --- Gauti dabartinio vartotojo duomenis ---
router.get('/user', authMiddleware, authController.getCurrentUser);

// --- Gauti visų vartotojų sąrašą (tik adminui) ---
router.get('/all-users', authMiddleware, authController.getAllUsers);

// --- Atnaujinti vartotojo rolę (tik adminui) ---
router.put(
  '/update-role/:userId',
  authMiddleware,
  authController.updateUserRole
);

// (jei prireiks - galėsi pridėti DELETE, pvz. trinti vartotoją)

module.exports = router;
