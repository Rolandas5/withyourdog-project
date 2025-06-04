const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const isAdminMiddleware = require('../middleware/isAdminMiddleware');
const messagesController = require('../controllers/messagesController');

// Sukurti žinutę (gali visi)
router.post('/', messagesController.createMessage);

// Gauti visas žinutes (tik adminui)
router.get(
  '/all',
  authMiddleware,
  isAdminMiddleware,
  messagesController.getAllMessages
);

// Ištrinti žinutę (tik adminui)
router.delete(
  '/:id',
  authMiddleware,
  isAdminMiddleware,
  messagesController.deleteMessage
);

// Redaguoti žinutę (tik adminui)
router.put(
  '/:id',
  authMiddleware,
  isAdminMiddleware,
  messagesController.updateMessage
);

module.exports = router;
