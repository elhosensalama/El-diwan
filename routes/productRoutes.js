const express = require('express');

const productController = require(`../controllers/productController`);
const authController = require(`../controllers/authController`);
// const reviewController = require(`./../controllers/reviewController`);
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', productController.checkID);

// POST /product/product_id/reviews
// GET /product/product_id/reviews
// GET /product/product_id/reviews/review_id

/*router
    .route('/:productId/reviews')
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview
    );*/

router.use('/:productId/reviews', reviewRouter);

router
    .route('/top-5-best-selling')
    .get(productController.aliasTopProducts, productController.getAllProducts);

router
    .route('/')
    .get(productController.getAllProducts)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        productController.uploadProductImage,
        productController.resizeProductImage,
        productController.createProduct
    );

router
    .route('/:id')
    .get(productController.getProduct)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        productController.uploadProductImage,
        productController.resizeProductImage,
        productController.updateProduct
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        productController.deleteProduct
    );

module.exports = router;
