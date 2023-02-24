
const auth = require('../../middleware/auth');
const { validation } = require('../../middleware/validation');
const router = require('express').Router();
const messageController = require('./controller/message.controller');
const  messageValidation = require('./controller/message.validation');

router.post('/:receiverId',validation(messageValidation.sendMessage),messageController.sendMessage)
router.get('/:receiverId/messages',auth(),messageController.userMessages)
router.delete('/:messageId',auth(),messageController.deleteMessage)

module.exports = router;