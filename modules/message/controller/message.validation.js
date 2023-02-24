const Joi = require('joi');
const joi = require('joi');

const sendMessage = {
    params:Joi.object().required().keys({
        receiverId:Joi.string().required().min(24).max(24)
    }),
    body:Joi.object().required().keys({
        message:Joi.string().required().min(5).max(410)
    })
}

module.exports={sendMessage};