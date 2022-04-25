const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAboutPage = catchAsync(async (req, res, next) => {
    res.status(200).render('about', {
        title: 'About',
        nav_item_about: true,
    });
});
exports.getCartPage = catchAsync(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).render('cart', {
        title: 'Cart',
        products,
        nav_item_cart: true,
    });
});
exports.getContactPage = catchAsync(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).render('contact', {
        title: 'Contact',
        products,
        nav_item_contact: true,
    });
});
exports.getAllProductsPage = catchAsync(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).render('shop', {
        title: 'shop',
        products,
        nav_item_shop: true,
    });
});
exports.getHomePage = catchAsync(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).render('overview', {
        title: 'Home',
        products,
        nav_item_home: true,
    });
});
exports.getCheckoutPage = catchAsync(async (req, res, next) => {
    // const products = await Product.find();
    res.status(200).render('checkout', {
        title: 'checkout',
        // products,
        // nav_item_home: true,
    });
});

exports.getProduct = catchAsync(async (req, res, next) => {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    const reviews = await Review.find({ product: product.id });
    if (!product) {
        return next(new AppError('There is no product with that name ', 404));
    }
    const relatedProducts = await Product.find({
        category: product.category,
    }).limit(3);
    res.status(200).render('product', {
        title: `${product.name} Product`,
        product,
        relatedProducts,
        reviews,
    });
});

exports.getLoginForm = catchAsync(async (req, res) => {
    // 1) build templete
    // 2) Render that template
    res.status(200).render('login', {
        title: 'Log into your account',
    });
});
exports.getSignupForm = catchAsync(async (req, res) => {
    // 1) build templete
    // 2) Render that template
    res.status(200).render('signup', {
        title: 'Create your new account',
    });
});

// TODO Backend

exports.manageAccount = catchAsync(async (req, res) => {
    res.status(200).render('db_settings', {
        title: 'Your Account',
        page_settings_val: true,
    });
});
exports.manageProducts = catchAsync(async (req, res) => {
    // 1) Get product data from collection
    let products;
    const q = req.query.name;
    const r = new RegExp(`.*${q}.*`, 'i');
    if (q) {
        products = await Product.find({ name: r });
    } else {
        products = await Product.find();
    }
    res.status(200).render('db_products', {
        title: 'manage products',
        page_products_val: true,
        products,
    });
});
exports.manageOrders = catchAsync(async (req, res) => {
    // 1) Get Order data from collection
    const orders = await Order.find();
    res.status(200).render('db_orders', {
        title: 'manage orders',
        page_orders_val: true,
        orders,
    });
});
exports.manageReviews = catchAsync(async (req, res) => {
    // 1) Get Review data from collection
    const reviews = await Review.find().populate({
        path: 'product',
        fields: 'name category',
    });
    res.status(200).render('db_reviews', {
        title: 'manage reviews',
        page_reviews_val: true,
        reviews,
    });
});
exports.getCreateProduct = catchAsync(async (req, res) => {
    res.status(200).render('db_create_product', {
        title: 'create product',
        page_create_product_val: true,
    });
});
exports.getUpdateProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    res.status(200).render('db_edit_product', {
        title: 'Edit product',
        product,
    });
});

exports.getShowProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    res.status(200).render('db_show_product', {
        title: 'Show product',
        product,
    });
});
exports.getShowOrder = catchAsync(async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    res.status(200).render('db_show_order', {
        title: 'Show Order',
        order,
    });
});
exports.getShowReview = catchAsync(async (req, res) => {
    const review = await Review.findById(req.params.reviewId);
    const product = await Product.findById(review.product);
    res.status(200).render('db_show_review', {
        title: 'Show Review',
        review,
        product,
    });
});

exports.getStatsAll = catchAsync(async (req, res) => {
    const products = await Product.find();
    const reviews = await Review.find();
    const orders = await Order.find();
    const bestProducts = await Product.find()
        .sort({ ratingsAverage: -1 })
        .limit(5);
    res.status(200).render('db_stats', {
        title: 'Dashboard',
        products,
        orders,
        reviews,
        bestProducts,
        page_dashboard_val: true,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalReviews: reviews.length,
        bestProductsTotal: bestProducts.length,
    });
});
