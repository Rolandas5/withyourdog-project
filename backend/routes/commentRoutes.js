const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const checkCommentOwner = require('../middleware/checkCommentOwner');
const commentController = require('../controllers/commentController');
const isAdminMiddleware = require('../middleware/isAdminMiddleware');

// Tik prisijungę vartotojai gali komentuoti
router.post('/', authMiddleware, commentController.createComment);

// Komentarų sąrašas pagal vietą
router.get('/:placeType/:placeId', commentController.getCommentsForPlace);
// Visi komentarai - tik adminui (naudojamas AdminCommentsTab)
router.get('/all', authMiddleware, commentController.getAllComments); // Visi komentarai - tik adminui (naudojamas AdminCommentsTab)

router.get(
  '/all',
  authMiddleware,
  isAdminMiddleware,
  commentController.getAllComments
);

// Tik savininkas arba adminas gali redaguoti ar trinti
router.put(
  '/:id',
  authMiddleware,
  checkCommentOwner,
  commentController.updateComment
);
router.delete(
  '/:id',
  authMiddleware,
  checkCommentOwner,
  commentController.deleteComment
);

module.exports = router;
