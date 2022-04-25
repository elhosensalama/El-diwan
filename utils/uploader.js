const multer = require('multer');
const AppError = require('./appError');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         // user-id-time.jpeg
//         // like user-5f4g5f4g5f4g5f4g54f-56516535531.jpeg
//         // 100% unique
//         const imageExtention = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${imageExtention}`);
//     },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError('Not an image! Please upload only an image!', 400),
            false
        );
    }
};

// const upload = multer({});
module.exports = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});
