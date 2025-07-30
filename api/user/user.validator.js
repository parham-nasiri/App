const joi = require('joi');

const createUser = {
    body: joi.object().keys({
        username: joi.string().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(128).required(),
    })
}
const login = {
    body:joi.object().keys({
    email:joi.string().email().message('invalid email').trim().required(),
    password : joi.string().trim().required()
    })
}







module.exports = {login,createUser}