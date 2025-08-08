const joi = require('joi');

const createTeacher = {
    body: joi.object().keys({
        teacherName: joi.string().min(3).max(30).required(),
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







module.exports = {login,createTeacher}