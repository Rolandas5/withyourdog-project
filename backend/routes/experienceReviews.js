const express = require('express');
const router = express.Router();
const experienceReviewController = require('../controllers/experienceReviewController');

router.get('/', experienceReviewController.getAllReviews);
router.post('/', experienceReviewController.addReview);
router.delete('/:id', experienceReviewController.deleteReview);
router.patch('/:id', experienceReviewController.updateReview);

module.exports = router;
