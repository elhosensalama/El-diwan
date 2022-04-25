const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({
    mergeParams: true,
});

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.setProductId, reviewController.createReview);

// Protect All Routes after this middleware
router.use(authController.protect);

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(authController.restrictTo('admin'), reviewController.deleteReview)
    .patch(authController.restrictTo('admin'), reviewController.updateReview);

module.exports = router;
