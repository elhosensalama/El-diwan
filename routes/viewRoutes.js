const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLogedIn, viewsController.getHomePage);

router.get('/dashboard', authController.protect, viewsController.getStatsAll);

router.get('/cart', viewsController.getCartPage);

router.get('/checkout', viewsController.getCheckoutPage);

router.get('/contact', viewsController.getContactPage);

router.get('/shop', viewsController.getAllProductsPage);

router.get('/shop/:slug', viewsController.getProduct);

router.get('/about', viewsController.getAboutPage);

router.get(
    '/manage_products',
    authController.protect,
    viewsController.manageProducts
);
router.get(
    '/manage_orders',
    authController.protect,
    viewsController.manageOrders
);
router.get(
    '/manage_reviews',
    authController.protect,
    viewsController.manageReviews
);
router.get(
    '/manage_account',
    authController.protect,
    viewsController.manageAccount
);
router.get(
    '/create_product',
    authController.protect,
    viewsController.getCreateProduct
);
router.get(
    '/edit_product/:productId',
    authController.protect,
    viewsController.getUpdateProduct
);
router.get(
    '/show_product/:productId',
    authController.protect,
    viewsController.getShowProduct
);
router.get(
    '/show_order/:orderId',
    authController.protect,
    viewsController.getShowOrder
);
router.get(
    '/show_review/:reviewId',
    authController.protect,
    viewsController.getShowReview
);

router.get('/tour/:slug', authController.isLogedIn, viewsController.getProduct);

// /login
router.get('/login', authController.isLogedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLogedIn, viewsController.getSignupForm);

module.exports = router;
