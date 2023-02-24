const joi = require('joi');

const signup = {
    body: joi.object().required().keys({
        name: joi.string().min(3).max(15).required().messages({
            'any.required':'plz your name',
            'string.empty':'name is empty'
        }),
        email: joi.string().email().max(50).required(),
        password: joi.string().min(5).max(20).required(),
        cPassword: joi.string().valid(joi.ref('password')).required().messages({
            'any.only':'password not match',
        }),
    })
}

const signin = {
    body: joi.object().required().keys({
        email: joi.string().email().max(50).required().messages({
            'any.required':'email is required',
        }),
        password: joi.string().min(5).max(20).required().messages({
            'string.empty':'password is required',
        }),
    })
}
module.exports = { signup, signin};