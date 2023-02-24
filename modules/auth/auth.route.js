const router = require('express').Router();
const { validation } = require('../../middleware/validation');
const authController = require('./controller/auth.controller');
const  validations  = require('./controller/auth.validation');

router.get('/', (req, res) => {
    res.json({ message: 'auth' });
});
router.post('/signup',validation(validations.signup), authController.signup);
router.get('/confirmEmail/:token', authController.confirmEmail);
router.get('/refreshToken/:token', authController.refreshToken);
router.post('/signin',validation(validations.signin), authController.signin);
router.get('/sendCode',authController.sendCode);
router.patch('/forgetPassword',authController.forgetPassword)
module.exports = router;