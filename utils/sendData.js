module.exports = (res, statusCode, data) => {
    if (data === undefined) data = [];
    res.status(statusCode).json({
        status: 'success',
        results: data.length,
        data: data,
    });
};
