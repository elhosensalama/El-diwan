const sharp = require('sharp');
const Product = require('../models/productModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const sendData = require('../utils/sendData');
const factory = require('./handlerFactory');
const upload = require('../utils/uploader');

// Image process

exports.uploadProductImage = upload.single('image');
exports.resizeProductImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    // 1) renaming the image
    req.body.image = `product-${req.params.id}-${Date.now()}.jpeg`;
    // 2) resize the image
    await sharp(req.file.buffer)
        .resize(800, 1000)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`./public/img/products/${req.body.image}`);
    next();
});

// Products Funcs

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, { path: 'reviews' });
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
exports.aliasTopProducts = (req, res, next) => {
    req.query.limit = '4';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,image';
    next();
};
