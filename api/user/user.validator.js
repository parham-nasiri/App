const Joi = require('joi');

const createUser = {
    body: Joi.object().keys({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(128).required(),
    })
}
const login = {
    body:Joi.object().keys({
    email:Joi.string().email().message('invalid email').trim().required(),
    password : Joi.string().trim().required()
    })
}
const getUserById = {
    body:Joi.object().keys({
    followingUserId:Joi.array().items(Joi.string().hex().length(24).message("invalid User Id")).required()
    })
}








module.exports = {login,createUser,getUserById}