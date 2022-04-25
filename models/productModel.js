const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A product must have a name'],
            unique: true,
            trim: true,
            maxLength: [
                50,
                'A product name must have less or equal 50 characters',
            ],
            minLength: [2, 'A Product name must have at least 2 characters'],
        },
        category: {
            type: String,
            required: [true, 'A product must have a category'],
            enum: {
                values: ['spices', 'legumes', 'grocery', 'other'],
                message: 'category is either: spices , legumes, grocery',
            },
        },
        quality: {
            type: String,
            required: [true, 'A product must have a quality value '],
            enum: {
                values: [
                    'fakher el-diwan',
                    'high class',
                    'noor el-nass',
                    'other',
                ],
                message:
                    'quality is either: father el-diwan , high class, noor el-nass',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        weight: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    //this can only be used on only creating but not for update
                    return val < this.price;
                },
                message: 'Discount ({VALUE}) Can not be more than the price',
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A product must have a description'],
        },
        slug: {
            type: String,
        },
        image: {
            type: String,
            required: [true, 'A product must have an image'],
            default: 'default.jpg',
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
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

// productSchema.index({ price: 1 });
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });

// Virtual Populate
productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
});

// Document Middleware : runs before .save() and .create() not {.inserMany()}
// .pre('save , (next) => {})
// .post('save , (doc,next) => {})
productSchema.pre('save', function (next) {
    this.slug = slugify(this.slug, { lower: true });
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
