const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const sendData = require('../utils/sendData');

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndRemove(req.params.id);

        if (!doc) {
            return next(new AppError('No document Found with that ID', 404));
        }
        sendData(res, 204);
    });
exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(new AppError('No document Found with that ID', 404));
        }
        sendData(res, 200, doc);
    });
exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const newDoc = await Model.create(req.body);
        if (!newDoc) {
            return next(new AppError('No Document Created!', 400));
        }
        sendData(res, 201, newDoc);
    });
exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) {
            query = query.populate('reviews');
        }
        const doc = await query;
        if (!doc) {
            return next(new AppError('No document Found with that ID', 404));
        }
        sendData(res, 200, doc);
    });
exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        // To allow nested GET reviews on tour
        let filter = {};
        if (req.params.tourId) {
            filter = { tour: req.params.tourId };
        }
        // Execute Query

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        // const docs = await features.query.explain();
        const docs = await features.query;
        // query.sort().select().skip().limit()

        // Send Response
        sendData(res, 200, docs);
    });
