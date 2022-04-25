const mongoose = require('mongoose');
const validator = require('validator');

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please fill the first name field'],
    },
    country: {
        type: String,
        required: [true, 'Please fill the country field'],
        default: 'egypt',
    },
    state: {
        type: String,
        required: [true, 'Please fill the last name field'],
    },
    city: {
        type: String,
        required: [true, 'Please fill the last name field'],
    },
    // streetAddress: {
    //     type: String,
    //     required: [true, 'Please fill the last name field'],
    // },
    email: {
        type: String,
        required: [true, 'Please fill the email field'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phone: {
        type: String,
        required: [true, 'Please fill the mobile field'],
    },
    addInfo: {
        type: String,
    },
    products: {
        type: Array,
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
});

orderSchema.pre('save', function (next) {
    this.products.forEach((product) => {
        const val = +product.count * +product.price;
        this.totalPrice += val;
    });
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
