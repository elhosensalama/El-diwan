const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} is ${err.value}`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    // const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    const value = err.keyValue.name;
    const message = `Duplicate field value: "${value}". please use another value.`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
const handleJWTError = () =>
    new AppError('Invalid Token, please login again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Token Expired, please login again!', 401);

const sendErrorDev = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    } else {
        // WebSite
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message,
        });
    }
};
const sendErrorProd = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOpertional) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong!',
            });
        }
    } else if (err.isOpertional) {
        // Website
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message,
        });
    } else {
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: 'Please try again later',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        if (err.code === 11000) err = handleDuplicateFieldsDB(err);
        if (err.name === 'CastError') err = handleCastErrorDB(err);
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError') err = handleJWTError();
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
        sendErrorProd(err, req, res);
    }
};
