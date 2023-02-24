const auth = require('../../middleware/auth');
const { myMulter,HME, multerValidation } = require('../../services/multer');
const router = require('express').Router();
const userController = require('./controller/user.controller');

router.patch('/updatePassword',auth(),userController.updatePassword)
router.patch('/profile/picture',auth(),myMulter(multerValidation.image).single('image'),HME,userController.uploadProfilePic)


module.exports = router;