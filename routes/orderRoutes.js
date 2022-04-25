const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router({
    mergeParams: true,
});

router
    .route('/')
    .get(orderController.getAllOrders)
    .post(orderController.createOrder);

// Protect All Routes after this middleware
router.use(authController.protect);

router
    .route('/:id')
    .get(orderController.getOrder)
    .delete(authController.restrictTo('admin'), orderController.deleteOrder)
    .patch(authController.restrictTo('admin'), orderController.updateOrder);

module.exports = router;
