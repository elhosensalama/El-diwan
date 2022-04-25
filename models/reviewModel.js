// publish / email for publish / review / rating / createdAt / ref to tour
const mongoose = require('mongoose');
const validator = require('validator');

const Product = require('./productModel');

const reviewSchema = new mongoose.Schema(
    {
        publisher: {
            type: String,
            required: [true, 'please write your name'],
        },
        publisher_email: {
            type: String,
            required: [true, 'please write your email'],
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        review: {
            type: String,
            required: [true, 'Review Can not be empty!'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createAt: {
            type: Date,
            default: Date.now(),
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: [true, 'Review must belong to a product!'],
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

// Static methods

reviewSchema.statics.calcAverageRatings = async function (productId) {
    const stats = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgReting: { $avg: '$rating' },
            },
        },
    ]);
    if (stats.length > 0)
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgReting,
        });
    else
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        });
};
reviewSchema.post('save', function () {
    // this points to Current Review
    // this.constructor points to Review Model
    this.constructor.calcAverageRatings(this.product);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.rev = await this.findOne();
    next();
});
reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(); does NOT work here, query is executed
    if (!this.rev) return;
    await this.rev.constructor.calcAverageRatings(this.rev.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
