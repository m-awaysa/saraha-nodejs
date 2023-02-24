const multer = require('multer');
const { nanoid } = require('nanoid'); 
const multerValidation = {
    image: ['image/png','image/jpeg','image/jpg'],
    pdf: ['application/pdf']
};

const HME = (error, req, res, next) => {
    if (error) {
        res.status(400).json({ message: "multer", error });
    } else {
        next();
    }
}
function myMulter(multerValidation) {

    // if you want to install the image on server
    // const storage = multer.diskStorage(
    //     {
    //         destination: function (req, file, cb) {
    //             cb(null, 'upload/profile')
    //         },
    //         filename: function (req, file, cb) {
    //             cb(null, Date.now() + '_' + nanoid() + '_' + file.originalname)
    //         }
    //     }
    // );

    // for uploading image on cloud
    const storage = multer.diskStorage({});
    function fileFilter(req, file, cb) {
        if (multerValidation.includes(file.mimetype)) {

            cb(null, true)
        } else {
            cb('invalid file type ', false)
        }
    }

    const upload = multer({ dest: 'upload', fileFilter, storage });

    return upload;
}

module.exports = { myMulter, HME, multerValidation }

