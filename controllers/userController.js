const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const upload = require('../utils/uploader');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

// User Funcs
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not defined! Please use sign up.',
    });
};
// Do Not update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`backend/public/img/users/${req.file.filename}`);
    next();
});
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
    // console.log(req.file);
    // 1) Create an error if user POSTed password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'Password Can not be modifaed in here, please use updateMyPassword route',
                400
            )
        );
    }
    // 2) filter out the object for unwanted fields
    const filteredBody = filterObj(req.body, 'name', 'email', 'phone_number');
    if (req.file) filteredBody.photo = req.file.filename;
    // 3) Update user document
    const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true,
    });
    // 4) Log the user in, send JWT
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    // 1) Change the Active property for deleting a user
    await User.findByIdAndUpdate(req.user._id, { active: false });
    // 2) Send Respode
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
